const { Client } = require('pg');
const { default: PQueue } = require('p-queue');
const queue = new PQueue({ concurrency: process.env.CONCURRENCY || 100 });

// should probably use env...
const client = new Client({
    user: process.env.POSTGRES_USER || 'postgres',
    host: process.env.POSTGRES_HOST || '127.0.0.1',
    database: process.env.POSTGRES_DB || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    port: process.env.PORT || 5432,
});

// used to create table
const tableDef = `CREATE TABLE IF NOT EXISTS public.articles (
    id SERIAL PRIMARY KEY,
    content text
);`

// queries
const writeQuery = `INSERT INTO articles(content) VALUES($1) RETURNING id`
const readQuery = `SELECT * from articles where id = $1`
const updateQuery = `UPDATE articles SET content = $2 WHERE id = $1`

// loop and simply write
async function bulkWrite(content, maxDocuments) {
    const times = [];
    const ids = [];

    for (let i = 0; i < maxDocuments; i++) {
        await queue.add(async function queueTask() {
            const start = new Date().getTime();
            const { rows } = await client.query(
                writeQuery,
                [content]
            );
            const end = new Date().getTime();
            times.push(end - start);
            ids.push(rows[0].id);
        });
    }

    await queue.onEmpty();
    const sum = times.reduce((acc, current) => acc + current, 0);
    const averageTime = sum / times.length;
    return { message: `Postgres average write time ${averageTime} ms`, ids };

}

async function bulkRead(ids) {
    await client.query(tableDef);

    const times = [];
    // 1. loop, use the ID.
    // 2. Fetch data with content
    for (let i = 0; i < ids.length; i++) {
        await queue.add(async () => {
            const id = ids[i];
            const start = new Date().getTime();
            await client.query(
                readQuery,
                [id]
            );
            const end = new Date().getTime();
            times.push(end - start);
        });
    }

    await queue.onEmpty();
    const sum = times.reduce((acc, current) => acc + current, 0);
    const averageTime = sum / times.length;
    return { message: `Postgres average read full select time ${averageTime} ms` };

}

async function bulkUpdate(ids) {
    await client.query(tableDef);

    const times = [];
    for (let i = 0; i < ids.length; i++) {
        await queue.add(async () => {
            const id = ids[i];
            const { rows } = await client.query(
                readQuery,
                [id]
            );
            const content = rows[0].content + 'new content';
            const start = new Date().getTime();
            await client.query(updateQuery, [id, content])
            const end = new Date().getTime();
            times.push(end - start);
        });
    }

    await queue.onEmpty();
    const sum = times.reduce((acc, current) => acc + current, 0);
    const averageTime = sum / times.length;
    return { message: `Postgres average update time ${averageTime} ms` };

}


async function write(content, maxDocuments) {
    console.time('POSTGRES_WRITE_TOTAL_TIME');
    const result = await bulkWrite(content, maxDocuments);
    console.timeEnd('POSTGRES_WRITE_TOTAL_TIME');
    return result;
}

async function read(ids) {
    console.time('POSTGRES_READ_TOTAL_TIME');
    const result = await bulkRead(ids);
    console.timeEnd('POSTGRES_READ_TOTAL_TIME');
    return result;
}

async function update(ids) {
    console.time('POSTGRES_UPDATE_TOTAL_TIME');
    const result = await bulkUpdate(ids);
    console.timeEnd('POSTGRES_UPDATE_TOTAL_TIME');
    return result;
}

async function setup() {
    await client.connect();
    await client.query(tableDef);
}

module.exports = {
    write,
    read,
    update,
    setup
}
const { Client } = require('pg');
const { default: PQueue } = require('p-queue');
const queue = new PQueue({ concurrency: process.env.CONCURRENCY || 100 });

const client = new Client({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'postgres',
    password: 'postgres',
    port: 5432,
});

const tableDef = `CREATE TABLE IF NOT EXISTS public.articles (
    id SERIAL PRIMARY KEY,
    content text
);`

const writeQuery = `INSERT INTO articles(content) VALUES($1) RETURNING id`
const readQuery = `SELECT * from articles where id = $1`

async function connectToPostgresAndBulkWrite(content, maxDocuments) {
    return new Promise(async (resolve, reject) => {        
        const times = [];
        const ids = [];
        for (let i = 0; i < maxDocuments; i++) {
            await queue.add(async function queueTask () {
                const start = new Date().getTime();
                const {rows} = await client.query(
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
        resolve({message: `Postgres average write time ${averageTime} ms`, ids});
    })
}

async function connectToPostgresAndBulkRead(ids) {
    return new Promise(async (resolve, reject) => {
        await client.query(tableDef);

        const times = [];        
        // 1. loop, use the ID.
        // 2. Fetch data with and without content to see performance difference
        for (let i = 0; i < ids.length; i++) {
            await queue.add(async () => {
                const start = new Date().getTime();
                await client.query(
                    readQuery,
                    [ids[i]]
                );
                const end = new Date().getTime();                
                times.push(end - start);
            });
        }

        await queue.onEmpty();
        const sum = times.reduce((acc, current) => acc + current, 0);
        const averageTime = sum / times.length;
        resolve({ message: `Postgres average read full select time ${averageTime} ms` });
    })
}

async function write(content, maxDocuments) {
    // console.time('bulkwrite-postgres');
    const result = await connectToPostgresAndBulkWrite(content, maxDocuments);
    // console.timeEnd('bulkwrite-postgres');
    return result;
}

async function read(maxDocuments) {
    // console.time('bulkread-mongo');
    const result = await connectToPostgresAndBulkRead(maxDocuments);
    // console.timeEnd('bulkread-mongo');
    return result;
}

async function setup() {
    // shouldn't be here, move to init
    await client.connect();
    await client.query(tableDef);
}

module.exports = {
    write, 
    read,
    setup
}
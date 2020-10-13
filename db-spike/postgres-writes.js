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

// Connection URL
const url = 'mongodb://root:password@localhost:27017';

const tableDef = `CREATE TABLE IF NOT EXISTS public.test (
    id SERIAL PRIMARY KEY,
    content text
);`

const writeQuery = `INSERT INTO test(content) VALUES($1)`

async function connectToPostgresAndBulkWrite(content, maxDocuments) {
    return new Promise(async (resolve, reject) => {
        await client.connect();
        
        await client.query(tableDef);

        const times = [];
        for (let i = 0; i < maxDocuments; i++) {
            await queue.add(async function queueTask () {
                const start = new Date().getTime();
                await client.query(
                    writeQuery,
                    [content]
                );
                const end = new Date().getTime();                
                times.push(end - start);
            });
        }

        await queue.onEmpty();
        const sum = times.reduce((acc, current) => acc + current, 0);
        const averageTime = sum / times.length;
        resolve(`Postgres average write time ${averageTime} ms`);
    })
}

module.exports = async function go(content, maxDocuments) {
    console.time('bulkwrite-postgres');
    const result = await connectToPostgresAndBulkWrite(content, maxDocuments);
    console.timeEnd('bulkwrite-postgres');
    return result;
}
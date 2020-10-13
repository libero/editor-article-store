const MongoClient = require('mongodb').MongoClient;
const { default: PQueue } = require('p-queue');
const queue = new PQueue({ concurrency: process.env.CONCURRENCY || 10 });

// Connection URL
const url = 'mongodb://root:password@localhost:27017';

async function connectToMongoAndBulkWrite(content, maxDocuments) {
    return new Promise(async (resolve, reject) => {
        const times = [];
        // Use connect method to connect to the server
        const client = await MongoClient.connect(url, {w: 1});
        const db = client.db('test');

        for (let i = 0; i < maxDocuments; i++) {
            await queue.add(async function queueTask () {
                const start = new Date().getTime();
                await db.collection('articles').insertOne({
                    content
                })
                const end = new Date().getTime();                
                times.push(end - start);
            });
        }

        await queue.onEmpty();
        const sum = times.reduce((acc, current) => acc + current, 0);
        const averageTime = sum / times.length;
        resolve(`Mongo average write time ${averageTime} ms`);
    })
}

async function connectToBulkReadIds(content, maxDocuments) {
    return new Promise(async (resolve, reject) => {
        const times = [];
        // Use connect method to connect to the server
        const client = await MongoClient.connect(url, {w: 1});
        const db = client.db('test');

        for (let i = 0; i < maxDocuments; i++) {
            await queue.add(async function queueTask () {
                const start = new Date().getTime();
                // perform read with and without selecting content
                const end = new Date().getTime();                
                times.push(end - start);
            });
        }

        await queue.onEmpty();
        const sum = times.reduce((acc, current) => acc + current, 0);
        const averageTime = sum / times.length;
        resolve(`Mongo average write time ${averageTime} ms`);
    })
}

async function write(content, maxDocuments) {
    console.time('bulkwrite-mongo');
    const result = await connectToMongoAndBulkWrite(content, maxDocuments);
    console.timeEnd('bulkwrite-mongo');
    return result;
}


async function read(maxDocuments) {
    console.time('bulkread-mongo');
    const result = await connectToBulkReadIds(maxDocuments);
    console.timeEnd('bulkread-mongo');
    return result;
}

module.exports = {
    write,
    read
}
const mongo = require('mongodb');
const { default: PQueue } = require('p-queue');
const queue = new PQueue({ concurrency: process.env.CONCURRENCY || 10 });

const MongoClient = mongo.MongoClient;

// Connection URL
const url = 'mongodb://root:password@localhost:27017';
let db;

async function setup() {
    // Use connect method to connect to the server
    const client = await MongoClient.connect(url, {w: 1});
    db = client.db('test');
}

async function connectToMongoAndBulkWrite(content, maxDocuments) {
    return new Promise(async (resolve, reject) => {
        const times = [];
        const ids = []

        for (let i = 0; i < maxDocuments; i++) {
            await queue.add(async function queueTask () {
                const start = new Date().getTime();
                const {insertedId} = await db.collection('articles').insertOne({
                    content
                })
                const end = new Date().getTime();                
                times.push(end - start);
                ids.push(insertedId);
            });
        }

        await queue.onEmpty();
        const sum = times.reduce((acc, current) => acc + current, 0);
        const averageTime = sum / times.length;
        resolve({message: `Mongo average write time ${averageTime} ms`, ids});
    })
}

async function connectToBulkReadIds(ids) {
    return new Promise(async (resolve, reject) => {
        const times = [];

        for (let i = 0; i < ids.length; i++) {
            await queue.add(async () => {
                const _id = mongo.ObjectID(ids[i]);
                const start = new Date().getTime();
                // perform read with and without selecting content
                await db.collection('articles').findOne({ _id });
                const end = new Date().getTime();                
                times.push(end - start);
            });
        }

        await queue.onEmpty();
        const sum = times.reduce((acc, current) => acc + current, 0);
        const averageTime = sum / times.length;
        resolve({message: `Mongo average read time ${averageTime} ms`});
    })
}

async function write(content, maxDocuments) {
    // console.time('bulkwrite-mongo');
    const result = await connectToMongoAndBulkWrite(content, maxDocuments);
    // console.timeEnd('bulkwrite-mongo');
    return result;
}


async function read(maxDocuments) {
    // console.time('bulkread-mongo');
    const result = await connectToBulkReadIds(maxDocuments);
    // console.timeEnd('bulkread-mongo');
    return result;
}

module.exports = {
    write,
    read,
    setup
}
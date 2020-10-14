const mongo = require('mongodb');
const { default: PQueue } = require('p-queue');
const queue = new PQueue({ concurrency: process.env.CONCURRENCY || 10 });

const MongoClient = mongo.MongoClient;

// Connection URL
const url = process.env.MONGO_URL || 'mongodb://root:password@localhost:27017';
let db;

async function setup() {
    // Use connect method to connect to the server
    const client = await MongoClient.connect(url, { w: process.env.WRITE_CONCERN || 1, useUnifiedTopology: true });
    db = client.db('test');
}

async function bulkWrite(content, maxDocuments) {
    // track times, use array since there is concurrency at play
    const times = [];
    // list of ids from the insert operations
    const ids = [];

    for (let i = 0; i < maxDocuments; i++) {
        await queue.add(async function queueTask() {
            const start = new Date().getTime();
            const { insertedId } = await db.collection('articles').insertOne({
                content
            })
            const end = new Date().getTime();
            times.push(end - start);
            ids.push(insertedId);
        });
    }

    // wait for the queue to be empty then calculate the average operation time
    await queue.onEmpty();
    const sum = times.reduce((acc, current) => acc + current, 0);
    const averageTime = sum / times.length;
    return { message: `Mongo average write time ${averageTime} ms`, ids };
}

async function bulkReadIds(ids) {
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
    return { message: `Mongo average read time ${averageTime} ms` };
}

async function bulkUpdateIds(ids) {
    const times = [];

    for (let i = 0; i < ids.length; i++) {
        await queue.add(async () => {
            const _id = mongo.ObjectID(ids[i]);
            const { content: oldContent } = await db.collection('articles').findOne({ _id });
            const content = oldContent + 'new content';
            const start = new Date().getTime();
            await db.collection('articles').updateOne({ _id }, { $set: { content } }, { multi: false, upsert: false });
            const end = new Date().getTime();
            times.push(end - start);
        });
    }

    await queue.onEmpty();
    const sum = times.reduce((acc, current) => acc + current, 0);
    const averageTime = sum / times.length;
    return { message: `Mongo average update time ${averageTime} ms` };
}

async function write(content, maxDocuments) {
    console.time('MONGO_WRITE_TOTAL_TIME');
    const result = await bulkWrite(content, maxDocuments);
    console.timeEnd('MONGO_WRITE_TOTAL_TIME');
    return result;
}


async function read(ids) {
    console.time('MONGO_READ_TOTAL_TIME');
    const result = await bulkReadIds(ids);
    console.timeEnd('MONGO_READ_TOTAL_TIME');
    return result;
}

async function update(ids) {
    console.time('MONGO_UPDATE_TOTAL_TIME');
    const result = await bulkUpdateIds(ids);
    console.timeEnd('MONGO_UPDATE_TOTAL_TIME');
    return result;
}

module.exports = {
    write,
    read,
    update,
    setup
}
const MongoClient = require('mongodb').MongoClient;
const LoremIpsum = require("lorem-ipsum").LoremIpsum;
const {default: PQueue} = require('p-queue');
const queue = new PQueue({ concurrency: process.env.CONCURRENCY || 100 });
const {v4} = require('uuid');


// Connection URL
const url = 'mongodb://root:password@localhost:27017';

const maxDocuments = process.env.MAX_DOCS || 1000;
const maxParagraphs = process.env.MAX_PARA || 150;
const minParagraphs = process.env.MIN_PARA || 50;

const numberOfParagraphs = Math.floor(Math.random() * (maxParagraphs - minParagraphs) + minParagraphs);

const lorem = new LoremIpsum({
    sentencesPerParagraph: {
        max: maxParagraphs,
        min: minParagraphs
    },
    wordsPerSentence: {
        max: 20,
        min: 10
    }
});

const content = lorem.generateParagraphs(numberOfParagraphs);
console.log('content length', content.length);
console.log('size', Math.floor(Buffer.byteLength(content, 'utf8') / 1024));
 return;
async function connectToMongoAndBulkWrite() {
    return new Promise(async (resolve, reject) => {
        const times = [];
        // Use connect method to connect to the server
        const client = await MongoClient.connect(url);
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
        resolve(`all writes complete, average write time ${averageTime} ms`);
    })
}
async function go() {
    console.time('bulkwrite');
    const result = await connectToMongoAndBulkWrite();
    console.timeEnd('bulkwrite');
    return result;
}

go().then(result => {
    console.log('done', result);
    process.exit(0);
}).catch(error => {
    console.log('failed', error);
    process.exit(1);
})

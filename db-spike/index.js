const LoremIpsum = require("lorem-ipsum").LoremIpsum;
const { write: mongoWrite, read: mongoRead, setup: setupMongo } = require('./mongo');
const { write: postgresWrite, read: postgreRead, setup: setupPostgres } = require('./postgres');

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
console.log('size in kbs', Math.floor(Buffer.byteLength(content, 'utf8') / 1024));

async function go() {
    await setupPostgres();
    await setupMongo();
    const mongoWriteResult = await mongoWrite(content, maxDocuments);
    const mongoReadResult = await mongoRead(mongoWriteResult.ids);
    const postgresWriteResult = await postgresWrite(content, maxDocuments);
    const postgresReadResult = await postgreRead(postgresWriteResult.ids);
    console.log(mongoWriteResult.message);
    console.log(mongoReadResult.message);
    console.log(postgresWriteResult.message);
    console.log(postgresReadResult.message);
}

go().then(() => {
    console.log('all done');
    process.exit(0);
}).catch((e) => {
    console.log('failed', e);
    process.exit(1);
})

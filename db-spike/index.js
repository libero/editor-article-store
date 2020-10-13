const LoremIpsum = require("lorem-ipsum").LoremIpsum;
const { write: mongoWrite, read: mongoRead } = require('./mongo-writes');
const { write: postgresWrite, read: postgreRead } = require('./postgres-writes');

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
    // const mongoWriteResult = await mongoWrite(content, maxDocuments);
    // const mongoReadResult = await mongoRead(maxDocuments);
    const postgresWriteResult = await postgresWrite(content, maxDocuments);
    const postgresReadResult = await postgreRead(maxDocuments);
    // console.log(mongoWriteResult);
    console.log(postgresWriteResult);
    console.log(postgresReadResult);
}

go().then(() => {
    console.log('all done');
    process.exit(0);
}).catch((e) => {
    console.log('failed', e);
    process.exit(1);
})

const LoremIpsum = require("lorem-ipsum").LoremIpsum;
const mongoWrites = require('./mongo-writes');
const postgresWrites = require('./postgres-writes');

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
    const mongoResult = await mongoWrites(content, maxDocuments);
    console.log('mongo done', mongoResult);
}

go().then(() => {
    console.log('all done');
    process.exit(0);
}).catch(() => {
    console.log('failed');
    process.exit(1);
})

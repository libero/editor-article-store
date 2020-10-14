const LoremIpsum = require("lorem-ipsum").LoremIpsum;
const { write: mongoWrite, read: mongoRead, setup: setupMongo, update: mongoUpdate } = require('./mongo');
const { write: postgresWrite, read: postgreRead, setup: setupPostgres, update: postgresUpdate } = require('./postgres');

// The default produces roughly 500kb - 1MB of text.
// Mongo has a limit of 16mb per document because of BSON limits
// https://docs.mongodb.com/manual/reference/limits/
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

// geneate some random content that is then passed to mongo and postgres to be inserted
const content = lorem.generateParagraphs(numberOfParagraphs);

console.log('\n***************');
console.log('content length', content.length);
console.log('size in kbs', Math.floor(Buffer.byteLength(content, 'utf8') / 1024));
console.log('***************\n');

// run all the db connection then insert, read, and update
async function go() {
    // set up the connections and schemas (for sql)
    await setupPostgres();
    await setupMongo();

    // perform, insert, read and then update on mongo
    console.log('***************');
    console.log('starting mongo operations');
    const mongoWriteResult = await mongoWrite(content, maxDocuments);
    const mongoReadResult = await mongoRead(mongoWriteResult.ids);
    const mongoUpdateResult = await mongoUpdate(mongoWriteResult.ids);
    console.log('finished mongo operations\n');

    // perform, insert, read and then update on postgres
    console.log('***************');
    console.log('starting postgres operations');
    const postgresWriteResult = await postgresWrite(content, maxDocuments);
    const postgresReadResult = await postgreRead(postgresWriteResult.ids);
    const postgresUpdateResult = await postgresUpdate(postgresWriteResult.ids);
    console.log('finished postgres update\n');

    // mongo results
    console.log('\n***************\n');
    console.log(mongoWriteResult.message);
    console.log(mongoReadResult.message);
    console.log(mongoUpdateResult.message);
    console.log('\n***************\n');

    // postgres results
    console.log('\n***************\n');
    console.log(postgresWriteResult.message);
    console.log(postgresReadResult.message);
    console.log(postgresUpdateResult.message);
    console.log('\n***************\n');
}

go().then(() => {
    console.log('All done');
    process.exit(0);
}).catch((e) => {
    console.log('An error has occured', e);
    process.exit(1);
})

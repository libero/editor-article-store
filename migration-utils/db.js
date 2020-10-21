
const { MongoClient } = require("mongodb");

module.exports = async function initialiseDb() {
    const client = await MongoClient.connect(process.env.MONGO_URL);
    return client.db(process.env.MONGO_DB_NAME);
}


import { MongoClient } from "mongodb";

export default async function initialiseDb(url: string, databaseName: string, cert?: (string | Buffer)[]) {
  console.log('Connecting to DB...')
  const client = await MongoClient.connect(url, { 
    sslValidate: !!cert,
    sslCA: cert,
    useNewUrlParser: true,
    useUnifiedTopology: true 
  });
  console.log('Connected to DB.');
  return client.db(databaseName);
}

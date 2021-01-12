import { MongoClient } from "mongodb";

export default async function initialiseDb(url: string, databaseName: string, cert?: (string | Buffer)[]) {
  const client = await MongoClient.connect(url, { 
    sslValidate: !!cert,
    sslCA: cert,
    useNewUrlParser: true,
    useUnifiedTopology: true 
  });
  return client.db(databaseName);
}

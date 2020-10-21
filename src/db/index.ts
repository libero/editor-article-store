import { MongoClient } from "mongodb";

export default async function initialiseDb(url: string, databaseName: string) {
  const client = await MongoClient.connect(url, { useUnifiedTopology: true });
  return client.db(databaseName);
}

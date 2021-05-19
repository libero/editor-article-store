import { MongoClient } from "mongodb";

async function connectToDB() {
  const client = await MongoClient.connect('mongodb://root:password@localhost:27017', { 
    useNewUrlParser: true,
    useUnifiedTopology: true 
  });
  return { db: client.db('editor'), client };
}

export const clearCollections = async (collections: string[]) => {
 const { db, client } = await connectToDB();
 for(const collection of collections) {
  await db.collection(collection).deleteMany({});
 }
 await client.close();
};

export const populateCollection = async (collection: string, data: {}[]) => {
  const { db, client } = await connectToDB();
  await db.collection(collection).insertMany(data)
  await client.close();
};
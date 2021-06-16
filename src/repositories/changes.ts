import { Db } from 'mongodb';
import { Change } from '../types/change';
import { JSONObject } from '../model/types';

const MAX_PAGE_SIZE = 100;

export interface ChangesResultSet {
    changes: Array<Change>;
    total: number;
}

export type ChangeRepository = {
    insert: (change: Change) => Promise<string>;
    get: (articleId: string, page?: number) => Promise<ChangesResultSet>;
    getAllRawChanges: (articleId: string) => Promise<JSONObject[]>;
};

export default async function changeRepository(db: Db): Promise<ChangeRepository> {
    const changesCollection = db.collection('changes');

    try {
        console.log('Creating changes indexes...');
        await changesCollection.createIndex(
            { articleId: 1 },
            {
                name: 'articleId',
            },
        );
    } catch (error) {
        throw new Error('Failed to create index for collection: changes - ' + error.message);
    }

    return {
        insert: async (change: Change) => {
            const { insertedId } = await changesCollection.insertOne({
                ...change,
                created: new Date().toISOString(),
            });
            return insertedId as string;
        },
        get: async (articleId: string, page = 0) => {
            const skip = page * MAX_PAGE_SIZE;
            const changesCursor = changesCollection
                .find({ articleId })
                .sort({ timestamp: 1 })
                .skip(skip)
                .limit(MAX_PAGE_SIZE);

            const changes = (await changesCursor.toArray()) as Array<Change>;
            const total = await changesCursor.count();

            return { changes, total };
        },

        getAllRawChanges: (articleId: string, page = 0) => {
            const changesCursor = changesCollection.find({ articleId }).sort({ timestamp: 1 });

            return changesCursor.toArray() as Promise<JSONObject[]>;
        },
    };
}

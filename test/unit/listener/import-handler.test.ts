import { Db } from 'mongodb';
import { AssetService } from '../../../src/services/asset';

const mockMongoInsert = jest.fn();
const dbMock = {
    collection: () => ({
        insertOne: mockMongoInsert,
    }),
} as unknown as Db;

const getAssetMock = jest.fn();
const saveAssetMock = jest.fn();
const assetServiceMock = {
    getArticleAssetKeysByFilename: jest.fn(),
    getAsset: getAssetMock,
    getAssetUrl: jest.fn(),
    saveAsset: saveAssetMock,
} as AssetService;

const importTransformMock = jest.fn();
const transformServiceMock = {
    importTransform: importTransformMock,
    exportTransform: jest.fn(),
    articleMetaOrderTransform: jest.fn(),
};

const decompressMock = jest.fn();
jest.mock('decompress', () => decompressMock);

jest.mock('file-type', () => ({
    fromBuffer: () => ({ mime: 'text/xml' }),
}));

import importHandler from '../../../src/listeners/import-handler';

describe('importHandler', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        getAssetMock.mockImplementation(() => Promise.resolve('someBody'));
        saveAssetMock.mockImplementation(() => Promise.resolve(''));
        decompressMock.mockImplementation(() =>
            Promise.resolve([
                {
                    path: '/elife-54296-vor-r1.xml',
                    data: 'somecontent',
                },
            ]),
        );
        importTransformMock.mockImplementation(() => 'someTransformedContent');
    });

    it("doesn't throw when initialized", () => {
        expect(() => importHandler(assetServiceMock, transformServiceMock, dbMock)).not.toThrow();
    });
    it('fetches the zip file contents from srcBucket and uploads to targetBucket', async () => {
        expect(getAssetMock).not.toBeCalled();
        expect(saveAssetMock).not.toBeCalled();
        await importHandler(assetServiceMock, transformServiceMock, dbMock).import('elife-54296-vor-r1.zip', 'kryia');
        expect(getAssetMock).toBeCalledWith('elife-54296-vor-r1.zip', 'kryia');
        expect(saveAssetMock).toBeCalledWith('54296', 'somecontent', 'text/xml', 'elife-54296-vor-r1.xml');
    });

    it('uploads all files in the src zip to the target bucket', async () => {
        expect(saveAssetMock).not.toBeCalled();
        decompressMock.mockImplementation(() =>
            Promise.resolve([
                {
                    path: '/elife-54296-vor-r1.xml',
                    data: 'somecontent',
                },
                {
                    path: '/noneArticleFile.txt',
                    data: 'somecontent',
                },
            ]),
        );
        await importHandler(assetServiceMock, transformServiceMock, dbMock).import('elife-54296-vor-r1.zip', 'kryia');
        expect(saveAssetMock).toBeCalledTimes(2);
        expect(saveAssetMock).toBeCalledWith('54296', 'somecontent', 'text/xml', 'elife-54296-vor-r1.xml');
        expect(saveAssetMock).toBeCalledWith('54296', 'somecontent', 'text/xml', 'noneArticleFile.txt');
    });

    it('stores xml in articles collection', async () => {
        expect(mockMongoInsert).not.toBeCalled();
        await importHandler(assetServiceMock, transformServiceMock, dbMock).import('elife-54296-vor-r1.zip', 'kryia');
        expect(mockMongoInsert).toBeCalledWith({
            articleId: '54296',
            datatype: 'xml',
            fileName: 'elife-54296-vor-r1.xml',
            version: 'r1',
            xml: 'somecontent',
        });
    });
    it('throws correct error if unable to fetch zip from s3', async () => {
        getAssetMock.mockImplementation(() => Promise.reject('Something went wrong fetching'));
        await expect(
            importHandler(assetServiceMock, transformServiceMock, dbMock).import('elife-54296-vor-r1.zip', 'kryia'),
        ).rejects.toThrow(
            'Error when fetching and unzipping object: { Key: elife-54296-vor-r1.zip, Bucket: kryia } - Something went wrong fetching',
        );
    });
    it('throws the correct error if the fetched file can not be unzipped', async () => {
        decompressMock.mockImplementation(() => Promise.reject('Something went wrong unzipping'));
        await expect(
            importHandler(assetServiceMock, transformServiceMock, dbMock).import('elife-54296-vor-r1.zip', 'kryia'),
        ).rejects.toThrow(
            'Error when fetching and unzipping object: { Key: elife-54296-vor-r1.zip, Bucket: kryia } - Something went wrong unzipping',
        );
    });

    it('throws an error if no article xml is found in zip', async () => {
        decompressMock.mockImplementation(() =>
            Promise.resolve([
                {
                    path: '/noneArticleFile.jpeg',
                    data: 'somecontent',
                },
            ]),
        );
        await expect(
            importHandler(assetServiceMock, transformServiceMock, dbMock).import('elife-54296-vor-r1.zip', 'kryia'),
        ).rejects.toThrow('Error finding article XML file in object: { Key: elife-54296-vor-r1.zip, Bucket: kryia }');
        expect(mockMongoInsert).not.toBeCalled();
        expect(saveAssetMock).not.toBeCalled();
    });

    it('throws an error if storing the object in target s3 fails', async () => {
        saveAssetMock.mockImplementation(() => {
            throw new Error('Something went wrong storing');
        });
        await expect(
            importHandler(assetServiceMock, transformServiceMock, dbMock).import('elife-54296-vor-r1.zip', 'kryia'),
        ).rejects.toThrow('Something went wrong storing');
    });

    it('throws an error if unable to store article in db collection', async () => {
        mockMongoInsert.mockImplementation(() => {
            throw new Error('Something went wrong on insert');
        });
        await expect(
            importHandler(assetServiceMock, transformServiceMock, dbMock).import('elife-54296-vor-r1.zip', 'kryia'),
        ).rejects.toThrow(
            'Error storing article XML: { ArticleID: 54296, Version: r1 } - Something went wrong on insert',
        );
    });

    it('calls transform service if enabled', async () => {
        expect(importTransformMock).not.toBeCalled();
        await importHandler(assetServiceMock, transformServiceMock, dbMock, true).import(
            'elife-54296-vor-r1.zip',
            'kryia',
        );
        expect(importTransformMock).toBeCalledTimes(1);
        expect(mockMongoInsert).toBeCalledWith({
            articleId: '54296',
            datatype: 'xml',
            fileName: 'elife-54296-vor-r1.xml',
            version: 'r1',
            xml: 'someTransformedContent',
        });
    });

    it('does not call transform service when disabled', async () => {
        expect(importTransformMock).not.toBeCalled();
        await importHandler(assetServiceMock, transformServiceMock, dbMock, false).import(
            'elife-54296-vor-r1.zip',
            'kryia',
        );
        expect(importTransformMock).not.toBeCalled();
    });

    it('replaces graphic ref in xml with returned key from saving asset', async () => {
        let assetUUID = 0;
        decompressMock.mockImplementation(() =>
            Promise.resolve([
                {
                    path: '/elife-54296-vor-r1.xml',
                    data: '<article><graphic xlink:href="sometif.tif" mimetype="image" mime-subtype="tiff"/></article>',
                },
                {
                    path: '/sometif.tif',
                    data: 'someTiffContent',
                },
            ]),
        );
        saveAssetMock.mockImplementation((_, __, ___, fileName) => {
            assetUUID++;
            return `${assetUUID}/${fileName}`;
        });
        await importHandler(assetServiceMock, transformServiceMock, dbMock, false).import(
            'elife-54296-vor-r1.zip',
            'kryia',
        );
        expect(mockMongoInsert).toBeCalledWith({
            articleId: '54296',
            datatype: 'xml',
            fileName: 'elife-54296-vor-r1.xml',
            version: 'r1',
            xml: '<article><graphic xlink:href="2/sometif.tif" mimetype="image" mime-subtype="tiff"/></article>',
        });
    });
});

import { S3 } from 'aws-sdk';
import { Db } from "mongodb";

const mockMongoInsert = jest.fn();
const dbMock = {
  collection: () => ({
    insertOne: mockMongoInsert
  })
} as unknown as Db;

const s3GetObjectMock = jest.fn();
const s3PutObjectMock = jest.fn();
const s3Mock = {
  getObject: s3GetObjectMock,
  putObject: s3PutObjectMock
} as unknown as S3;

const decompressMock = jest.fn();
jest.mock('decompress', () => decompressMock);

jest.mock('file-type', () => ({ 
  fromBuffer: () => ({ mime: 'text/xml' }) 
}));
const convertMock = jest.fn();
jest.mock('../../src/listeners/convert-image', () => convertMock);

import importHandler from '../../src/listeners/import-handler';

describe('importHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    s3GetObjectMock.mockImplementation(() => ({ promise: jest.fn(() => Promise.resolve({ Body: 'someBody' }))}));
    s3PutObjectMock.mockImplementation(()=>({ promise: jest.fn(() => Promise.resolve())}))
    decompressMock.mockImplementation(() => Promise.resolve([{
      path: '/elife-54296-vor-r1.xml',
      data: 'somecontent'
    }]));
    convertMock.mockImplementation(() => ({
      buffer: 'someBuffer',
      contentType: { mime: 'image/jpeg' }
    }))
  });

  it("doesn't throw when initialized", () => {
    expect(() => importHandler(s3Mock, dbMock, 'editor')).not.toThrow();
  })
  it('fetches the zip file contents from srcBucket and uploads to targetBucket', async () => {
    expect(s3GetObjectMock).not.toBeCalled();
    expect(s3PutObjectMock).not.toBeCalled();
    await importHandler(s3Mock, dbMock, 'editor').import('elife-54296-vor-r1.zip', 'kryia');
    expect(s3GetObjectMock).toBeCalledWith({ Key: 'elife-54296-vor-r1.zip', Bucket: 'kryia' });
    expect(s3PutObjectMock).toBeCalledWith(expect.objectContaining({ Key: '54296/elife-54296-vor-r1.xml', Bucket: 'editor' }))
  });

  it('uploads all files in the src zip to the target bucket', async () => {
    expect(s3PutObjectMock).not.toBeCalled();
    decompressMock.mockImplementation(() => Promise.resolve([{
      path: '/elife-54296-vor-r1.xml',
      data: 'somecontent'
    },{
      path: '/noneArticleFile.txt',
      data: 'somecontent'
    }]))
    await importHandler(s3Mock, dbMock, 'editor').import('elife-54296-vor-r1.zip', 'kryia');
    expect(s3PutObjectMock).toBeCalledTimes(2);
    expect(s3PutObjectMock).toBeCalledWith(expect.objectContaining({ Key: '54296/elife-54296-vor-r1.xml', Bucket: 'editor' }));
    expect(s3PutObjectMock).toBeCalledWith(expect.objectContaining({ Key: '54296/noneArticleFile.txt', Bucket: 'editor' }));
  });

  it('converts any tif file and uploads both original tif and converted jpeg', async () => {
    expect(s3PutObjectMock).not.toBeCalled();
    decompressMock.mockImplementation(() => Promise.resolve([{
      path: '/elife-54296-vor-r1.xml',
      data: 'somecontent'
    },{
      path: '/noneArticleFile.tif',
      data: 'somecontent'
    }]))
    await importHandler(s3Mock, dbMock, 'editor').import('elife-54296-vor-r1.zip', 'kryia');
    expect(s3PutObjectMock).toBeCalledTimes(3);
    expect(s3PutObjectMock).toBeCalledWith(expect.objectContaining({ Key: '54296/elife-54296-vor-r1.xml', Bucket: 'editor' }));
    expect(s3PutObjectMock).toBeCalledWith(expect.objectContaining({ Key: '54296/noneArticleFile.tif', Bucket: 'editor' }));
    expect(s3PutObjectMock).toBeCalledWith(expect.objectContaining({ Key: '54296/noneArticleFile.jpg', Bucket: 'editor' }));
  });

  it('stores xml in articles collection', async () => {
    expect(mockMongoInsert).not.toBeCalled();
    await importHandler(s3Mock, dbMock, 'editor').import('elife-54296-vor-r1.zip', 'kryia');
    expect(mockMongoInsert).toBeCalledWith({
      "articleId": "54296", 
      "datatype": "xml", 
      "fileName": "elife-54296-vor-r1.xml", 
      "version": "r1", 
      "xml": "somecontent"
    });
  });
  it('throws correct error if unable to fetch zip from s3', async () => {
    s3GetObjectMock.mockImplementation(() => ({ promise: jest.fn(() => { throw new Error('Something went wrong fetching')})}));
    await expect(importHandler(s3Mock, dbMock, 'editor').import('elife-54296-vor-r1.zip', 'kryia')).rejects.toThrow('Error when fetching and unzipping object: { Key: elife-54296-vor-r1.zip, Bucket: kryia } - Error: Something went wrong fetching');
  })
  it('throws the correct error if the fetched file can not be unzipped', async () => {
    decompressMock.mockImplementation(() => Promise.reject('Something went wrong unzipping'));
    await expect(importHandler(s3Mock, dbMock, 'editor').import('elife-54296-vor-r1.zip', 'kryia')).rejects.toThrow('Error when fetching and unzipping object: { Key: elife-54296-vor-r1.zip, Bucket: kryia } - Something went wrong unzipping');
  });

  it('throws an error if no article xml is found in zip', async () => {
    decompressMock.mockImplementation(() => Promise.resolve([{
      path: '/noneArticleFile.jpeg',
      data: 'somecontent'
    }]))
    await expect(importHandler(s3Mock, dbMock, 'editor').import('elife-54296-vor-r1.zip', 'kryia')).rejects.toThrow('Error finding article XML file in object: { Key: elife-54296-vor-r1.zip, Bucket: kryia }');
    expect(mockMongoInsert).not.toBeCalled();
    expect(s3PutObjectMock).not.toBeCalled();
  })

  it('throws an error if storing the object in target s3 fails', async () => {
      s3PutObjectMock.mockImplementation(() => ({ promise: jest.fn(() => { throw new Error('Something went wrong storing')})}));
      await expect(importHandler(s3Mock, dbMock, 'editor').import('elife-54296-vor-r1.zip', 'kryia')).rejects.toThrow('Error when storing object: { Key: 54296/elife-54296-vor-r1.xml, Bucket: editor } - Error: Something went wrong storing');
  })

  it('throws an error if unable to convert a tif file', async () => {
    convertMock.mockImplementation(() => { throw new Error('Unable to convert')});
    decompressMock.mockImplementation(() => Promise.resolve([{
      path: '/elife-54296-vor-r1.xml',
      data: 'somecontent'
    },{
      path: '/noneArticleFile.tif',
      data: 'somecontent'
    }]))
    await expect(importHandler(s3Mock, dbMock, 'editor').import('elife-54296-vor-r1.zip', 'kryia')).rejects.toThrow('Error when converting .tif file: { Key: 54296/noneArticleFile.tif, Bucket: editor } - Error: Unable to convert');
  });
  it('throws an error if unable to upload the converted image to s3', async () => {
    decompressMock.mockImplementation(() => Promise.resolve([{
      path: '/elife-54296-vor-r1.xml',
      data: 'somecontent'
    },{
      path: '/noneArticleFile.tif',
      data: 'somecontent'
    }]))
    s3PutObjectMock.mockImplementation((params) => {
      if (params.ContentType === 'image/jpeg') {
       return  { promise: () => { throw new Error('Something went wrong uploading')}}
      }
      return { promise: jest.fn(() => Promise.resolve())}
    });
    await expect(importHandler(s3Mock, dbMock, 'editor').import('elife-54296-vor-r1.zip', 'kryia')).rejects.toThrow('Error when storing object: { Key: 54296/noneArticleFile.jpg, Bucket: editor } converted from .tif file: { Key: 54296/noneArticleFile.tif, Bucket: editor } - Error: Something went wrong uploading');
  });

  it('throws an error if unable to store article in db collection', async () => {
    mockMongoInsert.mockImplementation(() => { throw new Error('Something went wrong on insert')});
    await expect(importHandler(s3Mock, dbMock, 'editor').import('elife-54296-vor-r1.zip', 'kryia')).rejects.toThrow('Error storing article XML: { ArticleID: 54296, Version: r1 } - Error: Something went wrong on insert');

  })
});
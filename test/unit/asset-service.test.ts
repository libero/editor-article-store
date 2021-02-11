import { S3 } from "aws-sdk";
import { AssetRepository } from "../../src/repositories/assets";
import assetService from "../../src/services/asset";
import { ConfigManagerInstance } from "../../src/services/config-manager";
import { Asset } from "../../src/types/asset";
import imageConverter from '../../src/utils/convert-image-utils';

jest.mock('uuid', () => ({ v4: () => '11111111-1111-1111-1111-111111111111'}));

const getSignedUrlMock = jest.fn();
const headObjectMock = jest.fn();
const putObjectMock = jest.fn();
const getObjectMock = jest.fn();

const mockS3 = ({
  getSignedUrl: getSignedUrlMock,
  headObject: headObjectMock,
  putObject: putObjectMock,
  getObject: getObjectMock
} as unknown) as S3;

const mockConfigGet = jest.fn();

const mockConfigManager = ({
  get: mockConfigGet
}as unknown) as ConfigManagerInstance;

const mockGetByArticleId = jest.fn(async () => ({ assets: [{_id: 'someAssetId', articleId: 'articleId', assetId: 'assetId', fileName: 'someFile.tiff'}], total: 1}));
const mockGetByQuery = jest.fn(async () => ({ assets: [{_id: 'someAssetId123', articleId: 'articleId123', assetId: 'assetId123', fileName: 'someFile123.tiff'}], total: 1}));

const mockAssetRepo: AssetRepository = {
  insert: async (asset: Asset) => 'someAssetId',
  getByArticleId: mockGetByArticleId,
  getByQuery: mockGetByQuery
}

jest.mock('../../src/utils/convert-image-utils');

describe("assetService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getSignedUrlMock.mockImplementation(() => "http://mock");
    headObjectMock.mockImplementation(() => ({ promise: () => {} }));
    putObjectMock.mockImplementation(() => ({ promise: () => {} }));
    getObjectMock.mockImplementation(() => ({ promise: () => ({ Body: 'object' })}));
    mockConfigGet.mockImplementation(() => "editorS3Bucket");
    (imageConverter as jest.Mock).mockImplementation((content) => ({ buffer: content, contentType: { mime: "image/jpeg" }}));
  })

  describe('getAsset', () => {
    it('should return the content of an S3 object', async () => {
      const asset = await assetService(
        mockS3,
        mockAssetRepo,
        mockConfigManager
      ).getAsset("12304/11111111-1111-1111-1111-111111111111/name.jpg", "someBucket");
      expect(getObjectMock).toBeCalledWith({ Key: "12304/11111111-1111-1111-1111-111111111111/name.jpg", Bucket: "someBucket" });
      expect(asset).toBe('object');
    });

    it('should throw s3 error if getObject fails', async () => {
      getObjectMock.mockImplementation(() => {throw new Error('Some Error')});
      await expect(assetService(
        mockS3,
        mockAssetRepo,
        mockConfigManager
      ).getAsset("12304/11111111-1111-1111-1111-111111111111/name.jpg", "someBucket")).rejects.toThrow('Some Error')
    });
  });

  describe('getAssetUrl', () => {
    it("returns url for correct s3 object", async () => {
        const url = await assetService(
          mockS3,
          mockAssetRepo,
          mockConfigManager
        ).getAssetUrl("12304/11111111-1111-1111-1111-111111111111/name.jpg");
        expect(url).toBe("http://mock");
        expect(getSignedUrlMock).toHaveBeenCalledWith("getObject", {
          Bucket: "editorS3Bucket",
          Key: "12304/11111111-1111-1111-1111-111111111111/name.jpg",
          Expires: 3600,
        });
      });
      it("returns null if no object exists", async () => {
        const anError = new Error('NotFound') as NodeJS.ErrnoException;
        anError.code = "NotFound";
        headObjectMock.mockImplementation(() => ({ promise: () => { throw anError  }}));
  
        await expect(assetService(
          mockS3,
          mockAssetRepo,
          mockConfigManager
        ).getAssetUrl("12304/asset/name.jpg")).resolves.toBe(null);
      });
  
      it("throws an error if headObject request fails", async () => {
        headObjectMock.mockImplementation(() => ({ promise: () => { throw new Error("SomeError") }}));
  
        await expect(assetService(
          mockS3,
          mockAssetRepo,
          mockConfigManager
        ).getAssetUrl("12304/11111111-1111-1111-1111-111111111111/name.jpg")).rejects.toThrow("SomeError");
      });
    });
    describe("saveAsset", () => {
      it("saves a non tiff asset to the S3 bucket", async () => {
        const assetkey = await assetService(
          mockS3,
          mockAssetRepo,
          mockConfigManager
        ).saveAsset("11111", Buffer.from("some content"), "image/jpeg", "someFileName.jpeg");
        expect(assetkey).toBe("11111111-1111-1111-1111-111111111111/someFileName.jpeg");
        expect(putObjectMock).toBeCalledWith(expect.objectContaining({
          Bucket: "editorS3Bucket",
          Key: "11111/11111111-1111-1111-1111-111111111111/someFileName.jpeg",
          ACL: "private",
          ContentType: "image/jpeg",
        }));
      });
      it("throws correct error if putObject fails", async () => {
        putObjectMock.mockImplementation(() => { throw new Error("Some Error")});
        await expect(assetService(
          mockS3,
          mockAssetRepo,
          mockConfigManager
        ).saveAsset("11111", Buffer.from("some content"), "image/jpeg", "someFileName.jpeg")).rejects.toThrow("Error when storing S3 object: { Key: 11111/11111111-1111-1111-1111-111111111111/someFileName.jpeg, Bucket: editorS3Bucket } - Some Error");
      });
    
      it("converts a tiff to a jpeg and stores both and returns jpeg key", async () => {
        const assetKey = await assetService(
          mockS3,
          mockAssetRepo,
          mockConfigManager
        ).saveAsset("11111", Buffer.from("some content"), "image/tiff", "someFileName.tiff");
        expect(assetKey).toBe("11111111-1111-1111-1111-111111111111/someFileName.jpeg");
        expect(putObjectMock).toBeCalledTimes(2);
        expect(putObjectMock).toBeCalledWith(expect.objectContaining({
          Bucket: "editorS3Bucket",
          Key: "11111/11111111-1111-1111-1111-111111111111/someFileName.tiff",
          ACL: "private",
          ContentType: "image/tiff",
        }));
        expect(putObjectMock).toBeCalledWith(expect.objectContaining({
          Bucket: "editorS3Bucket",
          Key: "11111/11111111-1111-1111-1111-111111111111/someFileName.jpeg",
          ACL: "private",
          ContentType: "image/jpeg",
        }));
      });

      it("throws correct error if tif conversion fails", async () => {
        (imageConverter as jest.Mock).mockImplementation(() => { throw new Error("Error converting")});
        await expect(assetService(
          mockS3,
          mockAssetRepo,
          mockConfigManager
        ).saveAsset("11111", Buffer.from("some content"), "image/tiff", "someFileName.tiff")).rejects.toThrow("Error when converting .tif file: { Key: 11111/11111111-1111-1111-1111-111111111111/someFileName.tiff, Bucket: editorS3Bucket } - Error converting");
      });

      it("converts both .tif and .tiff files", async () => {
        const assetKey1 = await assetService(
          mockS3,
          mockAssetRepo,
          mockConfigManager
        ).saveAsset("11111", Buffer.from("some content"), "image/tiff", "someFileName.tiff");
        expect(imageConverter).toBeCalledTimes(1);
        const assetKey2 = await assetService(
          mockS3,
          mockAssetRepo,
          mockConfigManager
        ).saveAsset("11111", Buffer.from("some content"), "image/tiff", "someFileName.tif");
        expect(imageConverter).toBeCalledTimes(2);
        expect(assetKey1).toEqual(assetKey2);
      });

      it("throws correct error if storing the converted tif file fails", async () => {
        const mockPutObject = jest.fn((params) => { 
          if(params.Key === "11111/11111111-1111-1111-1111-111111111111/someFileName.jpeg") { throw new Error("Some Error")}
          return { promise: () => {} };
        });
        putObjectMock.mockImplementation(mockPutObject as unknown as () => { promise: () => void });
        await expect(assetService(
          mockS3,
          mockAssetRepo,
          mockConfigManager
        ).saveAsset("11111", Buffer.from("some content"), "image/tiff", "someFileName.tif")).rejects.toThrow("Error when storing S3 object: { Key: 11111/11111111-1111-1111-1111-111111111111/someFileName.jpeg, Bucket: editorS3Bucket } converted from .tif file: { Key: 11111/11111111-1111-1111-1111-111111111111/someFileName.tif, Bucket: editorS3Bucket } - Some Error");
      });
    });
    describe('getArticleAssetKeysByFilename', () => {
      it('returns expected list of keys', async () => {
        const assetKeys = await assetService(
          mockS3,
          mockAssetRepo,
          mockConfigManager
        ).getArticleAssetKeysByFilename('someAssetId123', 'someFile123.tiff');
        expect(mockGetByQuery).toBeCalledWith({ articleId: 'someAssetId123', fileName: 'someFile123.tiff'})
        expect(assetKeys).toEqual(['articleId123/assetId123/someFile123.tiff'])
      });
    });
  });

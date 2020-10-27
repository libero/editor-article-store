import { S3 } from "aws-sdk";
import assetService from "../../src/services/asset";
import { ConfigManagerInstance } from "../../src/services/config-manager";

describe("assetService", () => {
  test("Should call S3 with the correct key and bucket", async () => {
    const mockS3 = {
      getSignedUrl: jest.fn().mockReturnValue("http://mock"),
      headObject: jest.fn().mockReturnValue({ promise: jest.fn().mockResolvedValue(true) }),
    };
    await assetService(
      (mockS3 as unknown) as S3,
      ({ get: () => "editorS3Bucket" } as unknown) as ConfigManagerInstance
    ).getAssetUrl("12304", "asset/name.jpg");
    expect(mockS3.getSignedUrl).toHaveBeenCalledWith("getObject", {
      Bucket: "editorS3Bucket",
      Key: "12304/asset/name.jpg",
      Expires: 3600,
    });
  });
});

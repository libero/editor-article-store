import fs from "fs";
import path from "path";
import convert from "../../../src/utils/convert-image-utils";

describe("convertImage", () => {
  test("should convert a tif buffer", async () => {
    const buffer = fs.readFileSync(
      path.join(__dirname, "../../", "test-files", "test.tif")
    );
    const { buffer: jpgBuffer, contentType } = await convert(buffer);
    expect(contentType).toBeDefined();
    expect(jpgBuffer).toBeDefined();
    const { mime = "" } = contentType || {};
    expect((jpgBuffer || "").toString("utf8").length).toBeGreaterThan(0);
    expect(mime).toBe("image/jpeg");
  });

  test("should not convert a non-tif buffer", async () => {
    const buffer = fs.readFileSync(
      path.join(__dirname, "../../", "test-files", "test.txt")
    );
    const { buffer: jpgBuffer, contentType } = await convert(buffer);
    expect(jpgBuffer).toBe(undefined);
    expect(contentType).toBe(null);
  });
});

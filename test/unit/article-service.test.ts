import { Db } from "mongodb";
import articleService from "../../src/services/article";

let getByArticleIdMock = jest.fn().mockReturnValue(null);
let getArticlesMock = jest.fn().mockReturnValue(null);
jest.mock('../../src/repositories/articles', () => {
  return jest.fn().mockImplementation(() => ({
    getByArticleId: getByArticleIdMock,
    get: getArticlesMock
}))});

describe("articleService", () => {
  const db = {} as unknown as Db;

  beforeEach(async () => {
    jest.restoreAllMocks();
  });

  test("should not throw", () => {
    expect(() => {
      articleService({} as unknown as Db);
    }).not.toThrow();
  });

  test("Returns null if article is not found", async () => {
    getByArticleIdMock = jest.fn().mockReturnValue(null);
    const result = await articleService(db).findByArticleId("123");
    expect(result).toBe(null);
  });

  test("Returns article if found", async () => {
    const data = {
      _id: 123,
      xml: "<xml></xml",
      datatype: "xml",
      articleId: "12345",
      fileName: "main.xml",
      version: "v1"
    };
    getByArticleIdMock = jest.fn().mockReturnValue(data);
    const result = await articleService(db).findByArticleId("12345");
    expect(result).toBeDefined();
    expect(result).toEqual({...data });
  });

  test("Returns empty array if no articles", async () => {
    getArticlesMock = jest.fn().mockReturnValue([]);
    const articles = await articleService(db).getArticles(0);
    expect(articles.length).toBe(0);
    expect(getArticlesMock).toBeCalledWith(0);
  });

  test("Returns  array if there articles", async () => {
    const data = {
      xml: "<xml></xml",
      datatype: "xml",
      articleId: "12345",
      fileName: "main.xml",
    };
    getArticlesMock = jest.fn().mockReturnValue([data]);
    const articles = await articleService(db).getArticles(0);
    expect(articles.length).toBe(1);
    expect(articles[0]).toEqual({ ...data });
    expect(getArticlesMock).toBeCalledWith(0);
  });
});

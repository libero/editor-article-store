import { Db } from "mongodb";
import { ArticleRepository } from "../../../src/repositories/articles";
import articleService from "../../../src/services/article";
import { ChangeRepository } from "../../../src/repositories/changes";

let getByArticleIdMock = jest.fn();
let getArticlesMock = jest.fn();

const mockArticleRepo = {
  insert: jest.fn(),
  getByArticleId: getByArticleIdMock,
  get: getArticlesMock
} as ArticleRepository;

let insertChangesMock = jest.fn();
let getChanesMock = jest.fn();

const mockChangesRepo =  {
    insert: insertChangesMock,
    get: getChanesMock,
    getAllRawChanges: jest.fn()
} as ChangeRepository;

describe("articleService", () => {
  const db = {} as unknown as Db;

  beforeEach(async () => {
    jest.restoreAllMocks();
    getByArticleIdMock.mockImplementation(() => null);
    getArticlesMock.mockImplementation(() => null);
  });

  test("should not throw", () => {
    expect(() => {
      articleService(mockArticleRepo, mockChangesRepo);
    }).not.toThrow();
  });

  test("Returns null if article is not found", async () => {
    const result = await articleService(mockArticleRepo, mockChangesRepo).findByArticleId("123");
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
    getByArticleIdMock.mockImplementation(() => data);
    const result = await articleService(mockArticleRepo, mockChangesRepo).findByArticleId("12345");
    expect(result).toBeDefined();
    expect(result).toEqual({...data });
  });

  test("Returns empty array if no articles", async () => {
    getArticlesMock.mockImplementation(() => []);
    const articles = await articleService(mockArticleRepo, mockChangesRepo).getArticles(0);
    expect(articles.length).toBe(0);
    expect(getArticlesMock).toBeCalledWith(0);
  });

  test("Returns  array if there are articles", async () => {
    const data = {
      xml: "<xml></xml>",
      datatype: "xml",
      articleId: "12345",
      fileName: "main.xml",
    };
    getArticlesMock.mockImplementation(() => [data]);
    const articles = await articleService(mockArticleRepo, mockChangesRepo).getArticles(0);
    expect(articles.length).toBe(1);
    expect(articles[0]).toEqual({ ...data });
    expect(getArticlesMock).toBeCalledWith(0);
  });
});

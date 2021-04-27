import {ArticleRepository} from "../../../src/repositories/articles";
import articleService from "../../../src/services/article";
import {ChangeRepository} from "../../../src/repositories/changes";
import {getArticleManuscript} from "../../../src/xml-exporter/article-parser";
import {applyChangesToManuscript} from "../../../src/model/changes.utils";
import {getAllFigureAssets} from "../../../src/model/utils";

let getByArticleIdMock = jest.fn();
let getArticlesMock = jest.fn();

const mockArticleRepo = {
  insert: jest.fn(),
  getByArticleId: getByArticleIdMock,
  get: getArticlesMock
} as ArticleRepository;

let insertChangesMock = jest.fn();
let getChanesMock = jest.fn();

jest.mock('../../../src/xml-exporter/article-parser');
jest.mock('../../../src/model/changes.utils');
jest.mock('../../../src/model/utils');

const mockChangesRepo =  {
    insert: insertChangesMock,
    get: getChanesMock,
    getAllRawChanges: jest.fn()
} as ChangeRepository;

describe("articleService", () => {

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
      xml: "<xml></xml>",
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
    getArticlesMock.mockImplementation(() => ({ articles: [], total: 0 }));
    const articles = await articleService(mockArticleRepo, mockChangesRepo).getArticles(0);
    expect(articles.articles.length).toBe(0);
    expect(articles.total).toBe(0);
    expect(getArticlesMock).toBeCalledWith(0);
  });

  test("Returns array if there are articles", async () => {
    const data = {
      xml: "<xml></xml>",
      datatype: "xml",
      articleId: "12345",
      fileName: "main.xml",
    };
    getArticlesMock.mockImplementation(() => ({ articles: [data], total: 1 }));
    const articles = await articleService(mockArticleRepo, mockChangesRepo).getArticles(0);
    expect(articles.articles.length).toBe(1);
    expect(articles.articles[0]).toEqual({ ...data });
    expect(articles.total).toBe(1);
    expect(getArticlesMock).toBeCalledWith(0);
  });

  test("Returns null for article manifest when article not found", async () => {
    getByArticleIdMock.mockImplementation(() => null);
    const articles = await articleService(mockArticleRepo, mockChangesRepo).getManifest('ARTICLE_ID');
    expect(articles).toBe(null);
  });

  test("Returns a manifest for article", async () => {
    const data = {
      _id: 'ARTICLE_ID',
      xml: "<xml></xml>",
      datatype: "xml",
      articleId: "12345",
      fileName: "main.xml",
      version: "v1"
    };

    (getArticleManuscript as jest.Mock).mockReturnValue({
      articleInfo: {
        articleType: 'ARTICLE_TYPE'
      }
    });

    getByArticleIdMock.mockImplementation(() => data);
    (applyChangesToManuscript as jest.Mock).mockImplementation(_ => _);
    (getAllFigureAssets as jest.Mock).mockReturnValue({
      'fig1': 'asset1.jpg',
      'fig2': 'asset2.tif'
    });
    const manifest = await articleService(mockArticleRepo, mockChangesRepo).getManifest('ARTICLE_ID');
    expect(manifest).toEqual({
      "articleId": "ARTICLE_ID",
      "assets": [{
        "id": "fig1",
        "path": "/api/v1/articles/ARTICLE_ID/assets/asset1.jpg",
        "type": "image/jpeg"
      }, {"id": "fig2", "path": "/api/v1/articles/ARTICLE_ID/assets/asset2.tif", "type": "image/jpeg"}],
      "path": "/api/v1/articles/ARTICLE_ID/export",
      "type": "ARTICLE_TYPE"
    });
  });

});

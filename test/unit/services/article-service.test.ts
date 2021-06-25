import { ArticleRepository } from '../../../src/repositories/articles';
import articleService from '../../../src/services/article';
import { ChangeRepository } from '../../../src/repositories/changes';
import { getArticleManuscript } from '../../../src/xml-exporter/article-parser';
import { applyChangesToManuscript } from '../../../src/model/changes.utils';
import { getAllFigureAssets } from '../../../src/model/utils';

const getByArticleIdMock = jest.fn();
const getArticlesMock = jest.fn();

const mockArticleRepo = {
    insert: jest.fn(),
    getByArticleId: getByArticleIdMock,
    get: getArticlesMock,
} as ArticleRepository;

const insertChangesMock = jest.fn();
const getChanesMock = jest.fn();

jest.mock('../../../src/xml-exporter/article-parser');
jest.mock('../../../src/model/changes.utils');
jest.mock('../../../src/model/utils');

const mockChangesRepo = {
    insert: insertChangesMock,
    get: getChanesMock,
    getAllRawChanges: jest.fn(),
} as ChangeRepository;

describe('articleService', () => {
    beforeEach(async () => {
        jest.restoreAllMocks();
        getByArticleIdMock.mockImplementation(() => null);
        getArticlesMock.mockImplementation(() => null);
    });

    test('should not throw', () => {
        expect(() => {
            articleService(mockArticleRepo, mockChangesRepo);
        }).not.toThrow();
    });

    test('Returns null if article is not found', async () => {
        const result = await articleService(mockArticleRepo, mockChangesRepo).findByArticleId('123');
        expect(result).toBe(null);
    });

    test('Returns article if found', async () => {
        const data = {
            _id: 123,
            xml: '<xml></xml>',
            datatype: 'xml',
            articleId: '12345',
            fileName: 'main.xml',
            version: 'v1',
        };
        getByArticleIdMock.mockImplementation(() => data);
        const result = await articleService(mockArticleRepo, mockChangesRepo).findByArticleId('12345');
        expect(result).toBeDefined();
        expect(result).toEqual({ ...data });
    });

    test('Returns empty array if no articles', async () => {
        getArticlesMock.mockImplementation(() => ({ articles: [], total: 0 }));
        const articles = await articleService(mockArticleRepo, mockChangesRepo).getArticles(0);
        expect(articles.articles.length).toBe(0);
        expect(articles.total).toBe(0);
        expect(getArticlesMock).toBeCalledWith(0);
    });

    test('Returns array if there are articles', async () => {
        const data = {
            xml: '<xml></xml>',
            datatype: 'xml',
            articleId: '12345',
            fileName: 'main.xml',
        };
        getArticlesMock.mockImplementation(() => ({ articles: [data], total: 1 }));
        const articles = await articleService(mockArticleRepo, mockChangesRepo).getArticles(0);
        expect(articles.articles.length).toBe(1);
        expect(articles.articles[0]).toEqual({ ...data });
        expect(articles.total).toBe(1);
        expect(getArticlesMock).toBeCalledWith(0);
    });
});

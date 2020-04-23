import { Article } from '../../src/types/article';
import { articleManager } from '../../src/services/article-manager';

const article: Article = {
  id: '00001'
} as Article;

describe('articleManager', () => {
  test('Can add an Article', () => {
    expect(articleManager.add(article)).toBe(undefined);
  });

  test('Can not add a duplicate Article', () => {
    expect(articleManager.add(article)).toBe(undefined);
    expect([...articleManager.values()].length).toBe(1);
  });

  test('Can check if an article exists', () => {
    expect(articleManager.has('00001')).toBe(true);
  });

  test('Can check if an Article does not exist', () => {
    expect(articleManager.has('00002')).toBe(false);
  });

  test('Can get an Article', () => {
    expect(articleManager.get('00001')).toMatchObject(article);
  });

  test('Can get an Article that does not exist', () => {
    expect(articleManager.get('00002')).toBe(undefined);
  });

  test('Can get an iterator of articles', () => {
    return expect([...articleManager.values()].length).toBe(1);
  });
});

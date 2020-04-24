import { articleManager } from '../../src/services/article-manager';
import { loadArticlesFromPath } from '../../src/utils/article-utils';

describe('loadArticlesFromPath()', () => {
  test('Copes with an invalid path', async () => {
    const input = './path/to/some/files';
    const output = {
      code: 'ENOENT'
    };
    return expect(loadArticlesFromPath(input, articleManager)).rejects.toMatchObject(output);
  });

  test('Copes with a directory with content', async () => {
    const input = './resources/articles';
    return expect(loadArticlesFromPath(input, articleManager));
  });
});

import { default as fs } from 'fs';

import { articleManager } from '../services/article-manager.js';
import { Article } from '../types/article.js';

export async function loadArticles(path: string): Promise<void> {
  fs.readdir(path, function(error, contents) {
    if (error) {
      return console.log('Unable to scan directory: ' + error);
    }

    contents.forEach(function(file) {
      const article: Article = {
        id: file,
        root: `${path}/${file}`
      };
      articleManager.add(article);
    });
  });
}

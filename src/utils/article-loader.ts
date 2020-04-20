import { default as fs } from 'fs';

import { config } from '../config/default.js';
import { articleManager } from '../services/article-manager.js';
import { Article } from '../types/article.js';

export async function loadArticles(): Promise<void> {
  fs.readdir(config.articleRoot, function(error, contents) {
    if (error) {
      return console.log('Unable to scan directory: ' + error);
    }

    contents.forEach(function(file) {
      const article: Article = {
        id: file,
        root: `${config.articleRoot}/${file}`
      };
      articleManager.add(article);
    });
  });
}

import { Article } from '../types/article';
import { ArticleManager } from '../types/article-manager';

import { default as fs } from 'fs';
import { default as path } from 'path';

// Imports articles from the specified path into the specified ArticleManager
export async function loadArticlesFromPath(pathToArticles: string, manager: ArticleManager): Promise<void> {
  const contents: string[] = await fs.promises.readdir(pathToArticles);
  for (const entry of contents) {
    const entryPath: string = path.join(pathToArticles, entry);
    const entryStats: fs.Stats = await fs.promises.stat(entryPath);

    // We are only interested in directories, everything else is ignored...
    if (entryStats.isDirectory()) {
      // Read the contents of the article directory, at the moment we are only looking for the main article XML.
      const articleFiles: string[] = await fs.promises.readdir(entryPath);
      for (const file of articleFiles) {
        // FIXME: Making the assumption that the first file xml file that isn't a manifest is the article is far from
        //        robust, but it will do for now. This code will be revisted anyhow when other resource types need to be
        //        indexed.
        if (file.endsWith('.xml') && file !== 'manifest.xml') {
          const article: Article = {
            id: entry,
            root: entryPath,
            xml: path.join(entryPath, file)
          };
          manager.add(article);
          break;
        }
      }
    }
  }
}

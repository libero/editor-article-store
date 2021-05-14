import fetch from 'node-fetch';
import { DOMParser, XMLSerializer } from 'xmldom';
import fontoxpath from  'fontoxpath';
import { ConfigManager } from '../types/config-manager';

export interface TransformService {
  importTransform: (xml: string) => Promise<string>;
  articleMetaOrderTransform: (xml: string) => Promise<string>
};

export default (config: ConfigManager): TransformService => {
  return {
    importTransform: async (xml: string) => {
      let response;
      try {
        console.log('Transforming imported XML');
        response = await fetch(config.get('importTransformUrl'), { method: 'POST', body: xml })
      } catch (e) {
        throw new Error('Failed to transform the imported xml: ' + e.message)
      }
      return response.text()
    },
    articleMetaOrderTransform: async (xml: string) => {
      const documentNode = new DOMParser().parseFromString(xml, 'text/xml');
      const result = await fontoxpath.evaluateUpdatingExpression(articleMetaOrderingExpression, documentNode);
      fontoxpath.executePendingUpdateList(result.pendingUpdateList);
      return new XMLSerializer().serializeToString(documentNode)
    }
  }
}

const articleMetaOrderingExpression = `
replace node //article-meta with <article-meta>{
  //article-meta/*:article-id,
  //article-meta/*:article-version,
  //article-meta/*:article-version-alternatives,
  //article-meta/*:article-categories,
  //article-meta/*:title-group,
  //article-meta/*:contrib-group,
  //article-meta/*:aff,
  //article-meta/*:aff-alternatives,
  //article-meta/*:x,
  //article-meta/*:author-notes,
  //article-meta/*:pub-date,
  //article-meta/*:pub-date-not-available,
  //article-meta/*:volume,
  //article-meta/*:volume-id,
  //article-meta/*:volume-series,
  //article-meta/*:issue,
  //article-meta/*:issue-id,
  //article-meta/*:issue-title,
  //article-meta/*:issue-sponsor,
  //article-meta/*:issue-part,
  //article-meta/*:volume-issue-group,
  //article-meta/*:isbn,
  //article-meta/*:supplement,
  //article-meta/*:fpage,
  //article-meta/*:lpage,
  //article-meta/*:page-range,
  //article-meta/*:elocation-id,
  //article-meta/*:email,
  //article-meta/*:ext-link,
  //article-meta/*:uri,
  //article-meta/*:product,
  //article-meta/*:supplementary-material,
  //article-meta/*:history,
  //article-meta/*:pub-history,
  //article-meta/*:permissions,
  //article-meta/*:self-uri,
  //article-meta/*:related-article,
  //article-meta/*:related-object,
  //article-meta/*:abstract,
  //article-meta/*:trans-abstract,
  //article-meta/*:kwd-group,
  //article-meta/*:funding-group,
  //article-meta/*:support-group,
  //article-meta/*:conference,
  //article-meta/*:counts,
  //article-meta/*:custom-meta-group
}</article-meta>
`
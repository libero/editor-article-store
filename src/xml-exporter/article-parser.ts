// import xmldom from 'xmldom';

import {Manuscript} from "../model/manuscript";
import { createTitleState } from '../model/title';
import {createBodyState} from "../model/body";
import {createAbstractState, createImpactStatementState} from "../model/abstract";
import {createAcknowledgementsState} from "../model/acknowledgements";
import {Article} from "../types/article";

import { parseXML } from "./parser-xml";

export function getArticleManuscript(article: Article): Manuscript {
  const xmlDoc = parseXML(article.xml);

  // addSelectors(xmlDoc.constructor);
  const title = xmlDoc.querySelector('title-group article-title') as Element;
  // // const keywordGroups = doc.querySelectorAll('kwd-group');
  // const abstract = xmlDoc.querySelector('abstract:not([abstract-type])') as Element;
  // const impactStatement = xmlDoc.querySelector('abstract[abstract-type="toc"]') as Element;
  // // const authors = doc.querySelectorAll('contrib[contrib-type="author"]');
  // // const affiliations = doc.querySelectorAll('contrib-group:first-of-type aff');
  // // const references = doc.querySelectorAll('ref-list ref element-citation');
  // // const authorNotes = doc.querySelector('author-notes');
  // // const relatedArticles = doc.querySelectorAll('related-article');
  // const acknowledgements = xmlDoc.querySelector('ack') as Element;
  // const body = xmlDoc.querySelector('body') as Element;

  return {
    title: createTitleState(title),
    // abstract: createAbstractState(abstract),
    // impactStatement: createImpactStatementState(impactStatement),
    // keywordGroups: createKeywordGroupsState(Array.from(keywordGroups)),
    // authors: authorsState,
    // body: createBodyState(body, article.articleId),
    // affiliations: createAffiliationsState(Array.from(affiliations)),
    // references: createReferencesState(Array.from(references)),
    // relatedArticles: createRelatedArticleState(Array.from(relatedArticles)),
    // acknowledgements: createAcknowledgementsState(acknowledgements),
    // articleInfo: new ArticleInformation(doc.documentElement, authorsState),
    // journalMeta: {
  //   //   publisherName: getTextContentFromPath(doc, 'journal-meta publisher publisher-name'),
  //   //   issn: getTextContentFromPath(doc, 'journal-meta issn')
  //   // }
  } as Manuscript;
}

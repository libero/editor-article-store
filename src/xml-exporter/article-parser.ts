import {Manuscript} from "../model/manuscript";
import { createTitleState } from '../model/title';
import {createBodyState} from "../model/body";
import {createAbstractState, createImpactStatementState} from "../model/abstract";
import {createAcknowledgementsState} from "../model/acknowledgements";
import {Article} from "../types/article";

import { parseXML } from "./xml-utils";
import {createRelatedArticleState} from "../model/related-article";

export function getArticleManuscript(article: Article): Manuscript {
  const xmlDoc = parseXML(article.xml);

  const title = xmlDoc.querySelector('title-group article-title') as Element;
  // // const keywordGroups = doc.querySelectorAll('kwd-group');
  const abstract: Element | undefined = Array.from(xmlDoc.querySelectorAll('abstract'))
    .find((el: Element) => !el.hasAttribute('abstract-type'));

  const impactStatement: Element | undefined = Array.from(xmlDoc.querySelectorAll('abstract'))
    .find((el: Element) => el.getAttribute('abstract-type') === 'toc');

  // // const authors = doc.querySelectorAll('contrib[contrib-type="author"]');
  // // const affiliations = doc.querySelectorAll('contrib-group:first-of-type aff');
  // // const references = doc.querySelectorAll('ref-list ref element-citation');
  // // const authorNotes = doc.querySelector('author-notes');
  const relatedArticles = xmlDoc.querySelectorAll('related-article');
  const acknowledgements: Element | null = xmlDoc.querySelector('ack');
  const body = xmlDoc.querySelector('body') as Element;

  return {
    title: createTitleState(title),
    abstract: createAbstractState(abstract),
    impactStatement: createImpactStatementState(impactStatement),
    acknowledgements: createAcknowledgementsState(acknowledgements),
    body: createBodyState(body),

    // keywordGroups: createKeywordGroupsState(Array.from(keywordGroups)),
    // authors: authorsState,
    // affiliations: createAffiliationsState(Array.from(affiliations)),
    // references: createReferencesState(Array.from(references)),
    relatedArticles: createRelatedArticleState(Array.from(relatedArticles)),
    // articleInfo: new ArticleInformation(doc.documentElement, authorsState),
    // journalMeta: {
  //   //   publisherName: getTextContentFromPath(doc, 'journal-meta publisher publisher-name'),
  //   //   issn: getTextContentFromPath(doc, 'journal-meta issn')
  //   // }
  } as Manuscript;
}

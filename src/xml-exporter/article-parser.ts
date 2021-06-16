import { Manuscript } from '../model/manuscript';
import { createTitleState } from '../model/title';
import { createBodyState } from '../model/body';
import { createAbstractState, createImpactStatementState } from '../model/abstract';
import { createAcknowledgementsState } from '../model/acknowledgements';
import { Article } from '../types/article';

import { parseXML } from './xml-utils';
import { createRelatedArticleState } from '../model/related-article';
import { createAffiliationsState } from '../model/affiliation';
import { createAuthorsState } from '../model/person';
import { createKeywordGroupsState } from '../model/keyword';
import { ArticleInformation } from '../model/article-information';
import { createReferencesState } from '../model/reference';

export function getArticleManuscript(article: Article): Manuscript {
    const xmlDoc = parseXML(article.xml);

    const title = xmlDoc.querySelector('title-group article-title') as Element;
    const keywordGroups = xmlDoc.querySelectorAll('kwd-group');
    const abstract: Element | undefined = Array.from(xmlDoc.querySelectorAll('abstract')).find(
        (el: Element) => !el.hasAttribute('abstract-type'),
    );

    const impactStatement: Element | undefined = Array.from(xmlDoc.querySelectorAll('abstract')).find(
        (el: Element) => el.getAttribute('abstract-type') === 'toc',
    );

    const authorsXml = Array.from(xmlDoc.querySelectorAll('contrib')).filter(
        (xmlNode) => xmlNode.getAttribute('contrib-type') === 'author',
    );
    const authorNotesXml = xmlDoc.querySelector('author-notes');
    const references = xmlDoc.querySelectorAll('ref-list ref > element-citation');

    const affiliations = xmlDoc.querySelectorAll('contrib-group:first-of-type aff');
    const relatedArticles = xmlDoc.querySelectorAll('related-article');
    const acknowledgements: Element | null = xmlDoc.querySelector('ack');
    const body = xmlDoc.querySelector('body') as Element;

    const authorsState = createAuthorsState(authorsXml, authorNotesXml);

    return {
        title: createTitleState(title),
        abstract: createAbstractState(abstract),
        impactStatement: createImpactStatementState(impactStatement),
        acknowledgements: createAcknowledgementsState(acknowledgements),
        body: createBodyState(body),
        keywordGroups: createKeywordGroupsState(Array.from(keywordGroups)),
        authors: authorsState,
        affiliations: createAffiliationsState(Array.from(affiliations)),
        references: createReferencesState(Array.from(references)),
        relatedArticles: createRelatedArticleState(Array.from(relatedArticles)),
        articleInfo: new ArticleInformation(xmlDoc.documentElement, authorsState),
    } as Manuscript;
}

import { EditorState } from 'prosemirror-state';
import { DOMSerializer } from 'prosemirror-model';
import xmldom from 'xmldom';

import { Article } from '../types/article';
import { Manuscript } from '../model/manuscript';
import { parseXML } from '../xml-exporter/xml-utils';
import { serializeAbstractState, serializeImpactStatementState } from '../model/abstract';
import { serializeTitleState } from '../model/title';
import { serializeAcknowledgementState } from '../model/acknowledgements';
import { serializeBodyState } from '../model/body';
import { serializeRelatedArticles } from '../model/related-article';
import { serializeAuthors } from '../model/person';
import { serializeAffiliations } from '../model/affiliation';
import { serializeKeywordGroups } from '../model/keyword';
import { serializeReferenceState } from '../model/reference';
import { serializeArticleInformaion } from '../model/article-information';

export function createXmlDomSerializer(editorState: EditorState): DOMSerializer {
    return DOMSerializer.fromSchema(editorState.schema);
}

export function serializeManuscriptSection(editorState: EditorState, document: Document): DocumentFragment {
    const serializer = createXmlDomSerializer(editorState);
    return serializer.serializeFragment(editorState.doc.content, { document });
}

export function serializeManuscript(article: Article, manuscript: Manuscript): string {
    const xmlDoc = parseXML(article.xml);

    serializeTitleState(xmlDoc, manuscript);
    serializeAbstractState(xmlDoc, manuscript);
    serializeImpactStatementState(xmlDoc, manuscript);
    serializeAcknowledgementState(xmlDoc, manuscript);
    serializeBodyState(xmlDoc, manuscript);
    serializeRelatedArticles(xmlDoc, manuscript);
    serializeAuthors(xmlDoc, manuscript);
    serializeAffiliations(xmlDoc, manuscript);
    serializeKeywordGroups(xmlDoc, manuscript);
    serializeReferenceState(xmlDoc, manuscript);
    serializeArticleInformaion(xmlDoc, manuscript);
    return new xmldom.XMLSerializer().serializeToString(xmlDoc);
}

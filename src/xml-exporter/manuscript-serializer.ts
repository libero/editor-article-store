import {EditorState} from 'prosemirror-state';
import {DOMSerializer} from "prosemirror-model";
import {Article} from "../types/article";
import {Manuscript} from "../model/manuscript";

import xmldom from 'xmldom';
import {parseXML} from "./parser-xml";

export function createXmlDomSerializer(editorState: EditorState): DOMSerializer {
  return DOMSerializer.fromSchema(editorState.schema);
}

export function serializeManuscriptSection(editorState: EditorState, document: Document ): DocumentFragment {
  const serializer = createXmlDomSerializer(editorState);
  return serializer.serializeFragment(editorState.doc.content, { document });
}

export function serializeManuscript(article: Article, manuscript: Manuscript): string {
  const xmlDoc = parseXML(article.xml);

  const titleXml = serializeManuscriptSection(manuscript.title, xmlDoc);
  const title = xmlDoc.querySelector('title-group article-title') as Element;
  title.innerHTML = '';
  title.appendChild(titleXml);

  // // // const keywordGroups = doc.querySelectorAll('kwd-group');
  // const abstract = doc.querySelector('abstract:not([abstract-type])') as Element;
  // const impactStatement = doc.querySelector('abstract[abstract-type="toc"]') as Element;
  // // // const authors = doc.querySelectorAll('contrib[contrib-type="author"]');
  // // // const affiliations = doc.querySelectorAll('contrib-group:first-of-type aff');
  // // // const references = doc.querySelectorAll('ref-list ref element-citation');
  // // // const authorNotes = doc.querySelector('author-notes');
  // // // const relatedArticles = doc.querySelectorAll('related-article');
  // const acknowledgements = doc.querySelector('ack') as Element;
  // const body = doc.querySelector('body') as Element;
  return new xmldom.XMLSerializer().serializeToString(xmlDoc);
}

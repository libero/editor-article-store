import {EditorState} from 'prosemirror-state';
import {DOMSerializer} from "prosemirror-model";
import {Article} from "../types/article";
import {Manuscript} from "../model/manuscript";

import xmldom from 'xmldom';
import {parseXML} from "./parser-xml";

export function createXmlDomSerializer(editorState: EditorState): DOMSerializer {
  return DOMSerializer.fromSchema(editorState.schema);
}

export function serializeManuscriptSection(editorState: EditorState, document: Document): DocumentFragment {
  const serializer = createXmlDomSerializer(editorState);
  return serializer.serializeFragment(editorState.doc.content, { document });
}

export function serializeManuscript(article: Article, manuscript: Manuscript): string {
  const xmlDoc = parseXML(article.xml);

  const titleXml = serializeManuscriptSection(manuscript.title, xmlDoc);
  const titleEl = xmlDoc.querySelector('title-group article-title') as Element;
  clearNode(titleEl);
  titleEl.parentNode!.replaceChild(titleXml, titleEl);

  const abstractXML = serializeManuscriptSection(manuscript.abstract, xmlDoc);
  let abstractEl = Array.from(xmlDoc.querySelectorAll('abstract'))
    .find((el: Element) => !el.hasAttribute('abstract-type'));
  if (!abstractEl) {
    abstractEl = xmlDoc.createElement('abstract');
    xmlDoc.querySelector('article-meta')!.appendChild(abstractEl);
  }
  clearNode(abstractEl);
  abstractEl.appendChild(abstractXML.firstChild!.firstChild!);

  const impactStatementXml = serializeManuscriptSection(manuscript.impactStatement, xmlDoc);
  let impactStatementEl = Array.from(xmlDoc.querySelectorAll('abstract'))
    .find((el: Element) => el.getAttribute('abstract-type') === 'toc');

  if (!impactStatementEl) {
    impactStatementEl = xmlDoc.createElement('abstract');
    impactStatementEl.setAttribute('abstract-type', 'toc');
    xmlDoc.querySelector('article-meta')!.appendChild(impactStatementEl);
  }

  clearNode(impactStatementEl);
  impactStatementEl.appendChild(impactStatementXml.firstChild!.firstChild!);

  const acknowledgementsXml = serializeManuscriptSection(manuscript.acknowledgements, xmlDoc);
  let acknowledgementsEl = xmlDoc.querySelector('ack') as Element;

  if (!acknowledgementsEl) {
    acknowledgementsEl = xmlDoc.createElement('ack');
    acknowledgementsEl.setAttribute('id', 'ack');
    const ackTitleEl = xmlDoc.createElement('title');

    ackTitleEl.appendChild(xmlDoc.createTextNode('Acknowledgements'));
    acknowledgementsEl.appendChild(ackTitleEl);
    xmlDoc.querySelector('back')!.appendChild(acknowledgementsEl);
  }

  const ackTitleEl = acknowledgementsEl.firstChild as Element;
  clearNode(acknowledgementsEl);
  acknowledgementsEl.appendChild(ackTitleEl);
  acknowledgementsEl.appendChild(acknowledgementsXml);

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

function clearNode(el: Element) {
  Array.from(el.childNodes).forEach(child => child.parentNode!.removeChild(child))
}

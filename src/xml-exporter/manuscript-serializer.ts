import {EditorState} from 'prosemirror-state';
import {DOMSerializer} from "prosemirror-model";
import * as jsdom from "jsdom";
import {Article} from "../types/article";
import {Manuscript} from "../model/manuscript";

export function createXmlDomSerializer(editorState: EditorState): DOMSerializer {
  return DOMSerializer.fromSchema(editorState.schema);
}

export function serializeManuscriptSection(editorState: EditorState, dom: jsdom.JSDOM): DocumentFragment {
  const serializer = createXmlDomSerializer(editorState);
  return serializer.serializeFragment(editorState.doc.content, { document: dom.window.document });
}

export function serializeManuscript(article: Article, manuscript: Manuscript): string {
  const dom = new jsdom.JSDOM(article.xml);

  const titleXml = serializeManuscriptSection(manuscript.title, dom);
  const title = dom.window.document.querySelector('title-group article-title') as Element;
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
  return dom.serialize();
}

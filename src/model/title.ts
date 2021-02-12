import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import xmldom from 'xmldom';

import * as titleConfig from './config/title.config';
import { makeSchemaFromConfig } from './utils';


export function createTitleState(content: Element): EditorState {
  const schema = makeSchemaFromConfig(titleConfig.topNode, titleConfig.nodes, titleConfig.marks);
  const xmlContentDocument = new xmldom.DOMImplementation().createDocument('', '', null);
  const title = xmlContentDocument.createElement('title');
  // const xmlContentDocument = new jsdom.JSDOM('').window.document;
  if (content) {
    title.appendChild(content);
  }

  return EditorState.create({
    doc: ProseMirrorDOMParser.fromSchema(schema).parse(title),
    schema
  });
}

import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import jsdom from "jsdom";

import * as titleConfig from './config/title.config';
import { makeSchemaFromConfig } from './utils';

export function createTitleState(content: Element): EditorState {
  const schema = makeSchemaFromConfig(titleConfig.topNode, titleConfig.nodes, titleConfig.marks);
  const xmlContentDocument = new jsdom.JSDOM('').window.document;

  if (content) {
    xmlContentDocument.body.appendChild(content);
  }

  return EditorState.create({
    doc: ProseMirrorDOMParser.fromSchema(schema).parse(xmlContentDocument),
    schema
  });
}

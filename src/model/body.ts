import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { set } from 'lodash';

import * as bodyConfig from './config/body.config';
import { makeSchemaFromConfig } from './utils';
import jsdom from "jsdom";

export function createBodyState(content: Element, id: string): EditorState {
  const schema = makeSchemaFromConfig(bodyConfig.topNode, bodyConfig.nodes, bodyConfig.marks);
  const xmlContentDocument = new jsdom.JSDOM('').window.document;

  if (content) {
    xmlContentDocument.body.appendChild(content);
  }

  set(xmlContentDocument, 'manuscriptPath', `/manuscripts/${id}`);

  return EditorState.create({
    doc: ProseMirrorDOMParser.fromSchema(schema).parse(xmlContentDocument),
    schema
  });
}

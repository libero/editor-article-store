import { EditorState } from 'prosemirror-state';
import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';
import jsdom from "jsdom";

import { makeSchemaFromConfig } from './utils';
import * as abstractConfig from './config/abstract.config';

export function createAbstractState(content: Element): EditorState {
  const schema = makeSchemaFromConfig(abstractConfig.topNode, abstractConfig.nodes, abstractConfig.marks);
  const xmlContentDocument = new jsdom.JSDOM('').window.document;

  if (content) {
    xmlContentDocument.body.appendChild(content);
  }

  return EditorState.create({
    doc: ProseMirrorDOMParser.fromSchema(schema).parse(xmlContentDocument),
    schema
  });
}

export function createImpactStatementState(content: Element): EditorState {
  const schema = makeSchemaFromConfig(abstractConfig.topNode, abstractConfig.nodes, abstractConfig.marks);
  const xmlContentDocument = new jsdom.JSDOM('').window.document;

  if (content) {
    xmlContentDocument.body.appendChild(content);
  }

  return EditorState.create({
    doc: ProseMirrorDOMParser.fromSchema(schema).parse(xmlContentDocument),
    schema
  });
}

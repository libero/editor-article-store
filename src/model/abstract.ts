import { EditorState } from 'prosemirror-state';
import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';
import xmldom from 'xmldom';

import { makeSchemaFromConfig } from './utils';
import * as abstractConfig from './config/abstract.config';

export function createAbstractState(content?: Element): EditorState {
  const schema = makeSchemaFromConfig(abstractConfig.topNode, abstractConfig.nodes, abstractConfig.marks);
  const xmlContentDocument = new xmldom.DOMImplementation().createDocument('', '', null);
  const abstractEl = xmlContentDocument.createElement('abstract');
  if (content) {
    abstractEl.appendChild(content);
  }

  return EditorState.create({
    doc: ProseMirrorDOMParser.fromSchema(schema).parse(abstractEl),
    schema
  });
}

export function createImpactStatementState(content?: Element): EditorState {
  const schema = makeSchemaFromConfig(abstractConfig.topNode, abstractConfig.nodes, abstractConfig.marks);
  const xmlContentDocument = new xmldom.DOMImplementation().createDocument('', '', null);
  const abstractEl = xmlContentDocument.createElement('abstract');

  if (content) {
    abstractEl.appendChild(content);
  }

  return EditorState.create({
    doc: ProseMirrorDOMParser.fromSchema(schema).parse(abstractEl),
    schema
  });
}

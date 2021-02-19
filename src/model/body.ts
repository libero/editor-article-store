import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';

import * as bodyConfig from './config/body.config';
import { makeSchemaFromConfig } from './utils';
import xmldom from 'xmldom';
import {Manuscript} from "./manuscript";
import {serializeManuscriptSection} from "../xml-exporter/manuscript-serializer";
import {clearNode} from "../xml-exporter/xml-utils";

export function createBodyState(content: Element): EditorState {
  const schema = makeSchemaFromConfig(bodyConfig.topNode, bodyConfig.nodes, bodyConfig.marks);
  const xmlContentDocument = new xmldom.DOMImplementation().createDocument('', '', null);
  const body = xmlContentDocument.createElement('body');
  if (content) {
    body.appendChild(content);
  }

  return EditorState.create({
    doc: ProseMirrorDOMParser.fromSchema(schema).parse(body),
    schema
  });
}

export function serializeBodyState(xmlDoc: Document, manuscript: Manuscript) {
  const bodyXml = serializeManuscriptSection(manuscript.body, xmlDoc);
  const bodyEl = xmlDoc.querySelector('body') as Element;

  clearNode(bodyEl);
  bodyEl.appendChild(bodyXml);
}

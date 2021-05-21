import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';

import * as acknowledgementsConfig from './config/acknowledgements.config';
import { makeSchemaFromConfig } from './utils';
import xmldom from 'xmldom';
import {clearNode} from "../xml-exporter/xml-utils";
import {serializeManuscriptSection} from "../xml-exporter/manuscript-serializer";
import {Manuscript} from "../model/manuscript";

export function createAcknowledgementsState(content?: Element | null): EditorState {
  const xmlContentDocument = new xmldom.DOMImplementation().createDocument('', '', null);
  const ack = xmlContentDocument.createElement('ack');
  if (content) {
    const ackTitle = content.querySelector('title');
    if (ackTitle) {
      content.removeChild(ackTitle);
    }
  }

  const schema = makeSchemaFromConfig(
    acknowledgementsConfig.topNode,
    acknowledgementsConfig.nodes,
    acknowledgementsConfig.marks
  );

  if (content) {
    ack.appendChild(content);
  }

  return EditorState.create({
    doc: ProseMirrorDOMParser.fromSchema(schema).parse(ack),
    schema
  });
}

export function serializeAcknowledgementState(xmlDoc: Document, manuscript: Manuscript) {
  const acknowledgementsXml = serializeManuscriptSection(manuscript.acknowledgements, xmlDoc);
  let acknowledgementsEl = xmlDoc.querySelector('ack') as Element;

  if (!acknowledgementsEl) {
    acknowledgementsEl = xmlDoc.createElement('ack');
    acknowledgementsEl.setAttribute('id', 'ack');
    const ackTitleEl = xmlDoc.createElement('title');

    ackTitleEl.appendChild(xmlDoc.createTextNode('Acknowledgements'));
    acknowledgementsEl.appendChild(ackTitleEl);
    xmlDoc.querySelector('back')?.appendChild(acknowledgementsEl);
  }

  const ackTitleEl = acknowledgementsEl.firstChild as Element;
  clearNode(acknowledgementsEl);
  acknowledgementsEl.appendChild(ackTitleEl);
  acknowledgementsEl.appendChild(acknowledgementsXml);
}

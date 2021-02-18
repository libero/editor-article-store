import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';

import * as acknowledgementsConfig from './config/acknowledgements.config';
import { makeSchemaFromConfig } from './utils';
import xmldom from 'xmldom';

export function createAcknowledgementsState(content?: Element | null): EditorState {
  const xmlContentDocument = new xmldom.DOMImplementation().createDocument('', '', null);
  xmlContentDocument.createElement('title');
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
    xmlContentDocument.appendChild(content);
  }

  return EditorState.create({
    doc: ProseMirrorDOMParser.fromSchema(schema).parse(xmlContentDocument),
    schema
  });
}

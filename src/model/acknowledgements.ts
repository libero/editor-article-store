import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';

import * as acknowledgementsConfig from './config/acknowledgements.config';
import { makeSchemaFromConfig } from './utils';
import jsdom from "jsdom";

export function createAcknowledgementsState(content?: Element): EditorState {
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
  const xmlContentDocument = new jsdom.JSDOM('').window.document;

  if (content) {
    xmlContentDocument.body.appendChild(content);
  }

  return EditorState.create({
    doc: ProseMirrorDOMParser.fromSchema(schema).parse(xmlContentDocument),
    schema
  });
}

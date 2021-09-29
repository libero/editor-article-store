import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import xmldom from '@xmldom/xmldom';

import * as titleConfig from './config/title.config';
import { makeSchemaFromConfig } from './utils';
import { clearNode } from '../xml-exporter/xml-utils';
import { serializeManuscriptSection } from '../xml-exporter/manuscript-serializer';
import { Manuscript } from './manuscript';

export function createTitleState(content?: Element): EditorState {
    const schema = makeSchemaFromConfig(titleConfig.topNode, titleConfig.nodes, titleConfig.marks);
    const xmlContentDocument = new xmldom.DOMImplementation().createDocument('', '', null);
    const title = xmlContentDocument.createElement('title');

    if (content) {
        title.appendChild(content);
    }

    return EditorState.create({
        doc: ProseMirrorDOMParser.fromSchema(schema).parse(title),
        schema,
    });
}

export function serializeTitleState(xmlDoc: Document, manuscript: Manuscript) {
    const titleXml = serializeManuscriptSection(manuscript.title, xmlDoc);
    const titleEl = xmlDoc.querySelector('title-group article-title') as Element;
    if (titleEl) {
        titleEl.replaceWith(titleXml);
    }
}

import { EditorState } from 'prosemirror-state';
import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';
import xmldom from '@xmldom/xmldom';

import { makeSchemaFromConfig } from './utils';
import * as abstractConfig from './config/abstract.config';
import { serializeManuscriptSection } from '../xml-exporter/manuscript-serializer';
import { clearNode } from '../xml-exporter/xml-utils';
import { Manuscript } from '../model/manuscript';

export function createAbstractState(content?: Element): EditorState {
    const schema = makeSchemaFromConfig(abstractConfig.topNode, abstractConfig.nodes, abstractConfig.marks);
    const xmlContentDocument = new xmldom.DOMImplementation().createDocument('', '', null);
    const abstractEl = xmlContentDocument.createElement('abstract');
    if (content) {
        abstractEl.appendChild(content);
    }

    return EditorState.create({
        doc: ProseMirrorDOMParser.fromSchema(schema).parse(abstractEl),
        schema,
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
        schema,
    });
}

export function serializeAbstractState(xmlDoc: Document, manuscript: Manuscript) {
    const abstractXML = serializeManuscriptSection(manuscript.abstract, xmlDoc);
    let abstractEl = Array.from(xmlDoc.querySelectorAll('abstract')).find(
        (el: Element) => !el.hasAttribute('abstract-type'),
    );
    if (!abstractEl) {
        abstractEl = xmlDoc.createElement('abstract');
        xmlDoc.querySelector('article-meta')?.appendChild(abstractEl);
    }
    clearNode(abstractEl);
    abstractEl.appendChild(abstractXML.firstChild!.firstChild!);
}

export function serializeImpactStatementState(xmlDoc: Document, manuscript: Manuscript) {
    const impactStatementXml = serializeManuscriptSection(manuscript.impactStatement, xmlDoc);
    let impactStatementEl = Array.from(xmlDoc.querySelectorAll('abstract')).find(
        (el: Element) => el.getAttribute('abstract-type') === 'toc',
    );

    if (!impactStatementEl) {
        impactStatementEl = xmlDoc.createElement('abstract');
        impactStatementEl.setAttribute('abstract-type', 'toc');
        xmlDoc.querySelector('article-meta')!.appendChild(impactStatementEl);
    }

    clearNode(impactStatementEl);
    impactStatementEl.appendChild(impactStatementXml.firstChild!.firstChild!);
}

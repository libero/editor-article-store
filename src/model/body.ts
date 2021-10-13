import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';

import * as bodyConfig from './config/body.config';
import { makeSchemaFromConfig } from './utils';
import xmldom from '@xmldom/xmldom';
import { Manuscript } from './manuscript';
import { serializeManuscriptSection } from '../xml-exporter/manuscript-serializer';
import { clearNode } from '../xml-exporter/xml-utils';

export function createBodyState(content: Element): EditorState {
    const schema = makeSchemaFromConfig(bodyConfig.topNode, bodyConfig.nodes, bodyConfig.marks);
    const xmlContentDocument = new xmldom.DOMImplementation().createDocument('', '', null);
    const body = xmlContentDocument.createElement('body');
    if (content) {
        body.appendChild(content);
    }

    return EditorState.create({
        doc: ProseMirrorDOMParser.fromSchema(schema).parse(body),
        schema,
    });
}

export function serializeBodyState(xmlDoc: Document, manuscript: Manuscript) {
    const bodyXml = serializeManuscriptSection(manuscript.body, xmlDoc);
    const bodyEl = xmlDoc.querySelector('body') as Element;

    clearNode(bodyEl);
    bodyEl.appendChild(bodyXml);

    const figs = bodyEl.querySelectorAll('fig');
    const figElementMap: Array<Element[]> = [];

    figs.forEach((fig: Element, index: number) => {
        bodyEl.querySelectorAll(`xref[rid="${fig.getAttribute('id')}"]`).forEach((el) => {
            figElementMap[index] ? figElementMap[index].push(el) : (figElementMap[index] = [el]);
        });
        fig.setAttribute('id', `fig${index + 1}`);
    });

    figElementMap.forEach((value: Element[], index) => {
        value?.forEach((element) => {
            element.setAttribute('rid', `fig${index + 1}`);
        });
    });
}

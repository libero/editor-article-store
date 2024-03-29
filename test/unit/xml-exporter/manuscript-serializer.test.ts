jest.mock('uuid', () => ({
    v5: () => 'unique_id',
    v4: () => 'unique_id',
}));
import { DOMSerializer } from 'prosemirror-model';
import xmldom from '@xmldom/xmldom';
import { readFileSync } from 'fs';
import { join, resolve } from 'path';

import {
    createXmlDomSerializer,
    serializeManuscript,
    serializeManuscriptSection,
} from '../../../src/xml-exporter/manuscript-serializer';
import { createBodyState } from '../../../src/model/body';
import { getArticleManuscript } from '../../../src/xml-exporter/article-parser';
import { parseXML } from '../../../src/xml-exporter/xml-utils';

describe('serializeManuscript', () => {
    it('serializes manuscript', () => {
        const xml = readFileSync(resolve(join(__dirname, '../..', '/test-files/manuscript.xml'))).toString('utf8');
        const article = {
            articleId: '1',
            datatype: 'text/xml',
            fileName: 'manuscript.xml',
            version: '1.0',
            xml,
        };
        const manuscript = getArticleManuscript(article);
        const outputXml = serializeManuscript(article, manuscript);

        expect(outputXml).toMatchSnapshot();
    });

    it('has no side-effects', () => {
        const xml = readFileSync(resolve(join(__dirname, '../..', '/test-files/manuscript.xml'))).toString('utf8');
        const article = {
            articleId: '1',
            datatype: 'text/xml',
            fileName: 'manuscript.xml',
            version: '1.0',
            xml,
        };
        const manuscript = getArticleManuscript(article);
        const outputXml = serializeManuscript(article, manuscript);

        const xmlDoc = parseXML(article.xml);
        const outputXmlDoc = new xmldom.DOMParser().parseFromString(outputXml);
        const serializer = new xmldom.XMLSerializer();

        // deleting affected sections of manuscript will allow to check
        // when manuscript is serialized Prosemirror formats xml adding more whitespaces
        deleteAllNodes(xmlDoc, 'abstract');
        deleteAllNodes(xmlDoc, 'ack');
        deleteAllNodes(xmlDoc, 'article-meta > contrib-group');
        deleteAllNodes(xmlDoc, 'body');
        deleteAllNodes(xmlDoc, 'related-article');
        deleteAllNodes(xmlDoc, 'kwd-group');
        deleteAllNodes(xmlDoc, 'ref-list');
        deleteAllNodes(xmlDoc, 'article-meta > author-notes');
        deleteAllNodes(xmlDoc, 'permissions');
        deleteAllNodes(xmlDoc, 'subj-group[subj-group-type="major-subject"]');
        deleteAllNodes(xmlDoc, 'pub-date[date-type="pub"]');

        deleteAllNodes(outputXmlDoc, 'abstract');
        deleteAllNodes(outputXmlDoc, 'ack');
        deleteAllNodes(outputXmlDoc, 'article-meta > contrib-group');
        deleteAllNodes(outputXmlDoc, 'body');
        deleteAllNodes(outputXmlDoc, 'related-article');
        deleteAllNodes(outputXmlDoc, 'kwd-group');
        deleteAllNodes(outputXmlDoc, 'ref-list');
        deleteAllNodes(outputXmlDoc, 'article-meta > author-notes');
        deleteAllNodes(outputXmlDoc, 'permissions');
        deleteAllNodes(outputXmlDoc, 'subj-group[subj-group-type="major-subject"]');
        deleteAllNodes(outputXmlDoc, 'pub-date[date-type="pub"]');

        expect(serializer.serializeToString(xmlDoc)).toEqual(serializer.serializeToString(outputXmlDoc));
    });
});

describe('EditorState serializer', () => {
    it('creates a DOMSerializer', () => {
        const xml = new xmldom.DOMImplementation().createDocument('', '', null).createElement('p');
        const editorState = createBodyState(xml);
        const serializer = createXmlDomSerializer(editorState);

        expect(serializer).toBeInstanceOf(DOMSerializer);
        expect(Object.keys(serializer.marks)).toEqual([
            'italic',
            'bold',
            'subscript',
            'superscript',
            'strikethrough',
            'underline',
            'link',
        ]);

        expect(Object.keys(serializer.nodes)).toEqual([
            'paragraph',
            'refCitation',
            'heading',
            'boxText',
            'figureLicense',
            'figure',
            'figureTitle',
            'figureAttribution',
            'figureCitation',
            'figureLegend',
            'listItem',
            'orderedList',
            'bulletList',
            'text',
        ]);
    });

    it('serializes EditorState', () => {
        const xml = new xmldom.DOMImplementation().createDocument('', '', null).createElement('p');
        xml.appendChild(xml.ownerDocument.createTextNode('Test content'));
        const editorState = createBodyState(xml);
        const xmlFragment = serializeManuscriptSection(editorState, xml.ownerDocument);
        expect(xmlFragment.textContent).toBe('Test content');
        expect(xmlFragment).toBeInstanceOf(xml.ownerDocument.createDocumentFragment().constructor);
    });
});

function deleteAllNodes(doc: Document, nodeName: string) {
    doc.documentElement.querySelectorAll(nodeName).forEach((node) => {
        node.parentNode!.removeChild(node);
    });
}

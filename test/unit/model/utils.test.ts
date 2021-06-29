import { Schema } from 'prosemirror-model';
import {
    getAllFigureAssets,
    getTextContentFromPath,
    makeSchemaFromConfig,
    removeEmptyNodes,
} from '../../../src/model/utils';
import { readFileSync } from 'fs';
import { join, resolve } from 'path';
import { getArticleManuscript } from '../../../src/xml-exporter/article-parser';
import { parseXML } from '../../../src/xml-exporter/xml-utils';
import * as xmldom from 'xmldom';

describe('Model utils', () => {
    it('makes schema from config', () => {
        const schema = makeSchemaFromConfig(
            'doc',
            ['doc', 'abstract', 'paragraph', 'text'],
            ['italic', 'bold', 'subscript', 'superscript', 'strikethrough', 'underline'],
        );

        expect(schema).toBeInstanceOf(Schema);
        console.log(Object.keys(schema.nodes));
        expect(Object.keys(schema.nodes)).toEqual(['doc', 'abstract', 'paragraph', 'text']);
        expect(Object.keys(schema.marks)).toEqual([
            'italic',
            'bold',
            'subscript',
            'superscript',
            'strikethrough',
            'underline',
        ]);
        expect(schema.topNodeType.name === 'doc');
    });

    it('gets text content of xml node', () => {
        const doc = parseXML('<section>Text content</section>');
        expect(getTextContentFromPath(doc, 'section')).toEqual('Text content');
    });

    it('returns empty string if path does not exist', () => {
        const doc = parseXML('<div></div>');
        expect(getTextContentFromPath(doc, 'section')).toEqual('');
    });

    it('returns all figure nodes in prosemirror document', () => {
        const xml = readFileSync(resolve(join(__dirname, '../..', '/test-files/manuscript.xml'))).toString('utf8');
        const article = {
            articleId: '1',
            datatype: 'text/xml',
            fileName: 'manuscript.xml',
            version: '1.0',
            xml,
        };
        const manuscript = getArticleManuscript(article);
        const figures = getAllFigureAssets(manuscript);
        console.log(figures);
        expect(figures).toEqual({
            fig1: 'elife-60263-fig1.tif',
            fig2: 'elife-60263-fig2.tif',
        });
    });
});

describe('removeEmptyNodes', () => {
    it('removes empty xml nodes', () => {
        const xmlString =
            '<parent-node><to-be-removed-1/><to-be-removed-2 foo="bar"/><to-be-removed-3></to-be-removed-3><to-be-retained>Hello World!</to-be-retained></parent-node>';
        const xmlDoc = new xmldom.DOMParser().parseFromString(xmlString, 'text/xml');
        const xmlSerializer = new xmldom.XMLSerializer();
        const processedXML = removeEmptyNodes(xmlDoc.getElementsByTagName('parent-node')[0] as HTMLElement);
        expect(xmlSerializer.serializeToString(processedXML)).toBe(
            '<parent-node><to-be-retained>Hello World!</to-be-retained></parent-node>',
        );
    });
    it('returns input if no children nodes exist', () => {
        const xmlString = '<parent-node/>';
        const xmlDoc = new xmldom.DOMParser().parseFromString(xmlString, 'text/xml');
        const xmlSerializer = new xmldom.XMLSerializer();
        const processedXML = removeEmptyNodes(xmlDoc.getElementsByTagName('parent-node')[0] as HTMLElement);
        expect(xmlSerializer.serializeToString(processedXML)).toBe('<parent-node/>');
    });
});

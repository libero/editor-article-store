import xmldom from '@xmldom/xmldom';
import { Manuscript } from '../../../src/model/manuscript';
import { createTitleState, serializeTitleState } from '../../../src/model/title';
import { parseXML } from '../../../src/xml-exporter/xml-utils';

describe('Manuscript state factory', () => {
    it('creates title state', () => {
        const xmlDoc = parseXML(`<article>
        <body> A sample <italic>text</italic> with <sub>a</sub> variety of <sup>tags</sup> </body>
    </article>`);
        const editorState = createTitleState(xmlDoc.querySelector('body')!);
        expect(editorState).toMatchSnapshot();
    });

    it('creates empty title state', () => {
        const editorState = createTitleState(undefined);
        expect(editorState.doc.textContent).toBe('');
    });
});

describe('Serialization to XML', () => {
    const xmlSerializer = new xmldom.XMLSerializer();

    it('serializes empty title correctly', () => {
        const xmlDoc = parseXML(
            '<article><article-meta><title-group><article-title>Foo</article-title></title-group></article-meta></article>',
        );

        const manuscript = {
            title: createTitleState(undefined),
        } as Manuscript;

        serializeTitleState(xmlDoc, manuscript);
        expect(xmlSerializer.serializeToString(xmlDoc)).toBe(
            '<article>' +
                '<article-meta>' +
                '<title-group><article-title/></title-group>' +
                '</article-meta>' +
                '</article>',
        );
    });

    it('serializes populated title correctly', () => {
        const xmlDoc = parseXML(
            '<article><article-meta><title-group><article-title>Foo</article-title></title-group></article-meta></article>',
        );
        const titleXML = parseXML(`<article>
            <article-title>Bar</article-title>
        </article>`);
        const manuscript = {
            title: createTitleState(titleXML.querySelector('article-title') as Element),
        } as Manuscript;

        serializeTitleState(xmlDoc, manuscript);
        expect(xmlSerializer.serializeToString(xmlDoc)).toBe(
            '<article>' +
                '<article-meta>' +
                '<title-group><article-title>Bar</article-title></title-group>' +
                '</article-meta>' +
                '</article>',
        );
    });
});

import { Node as ProsemirrorNode } from 'prosemirror-model';
import { nodes } from '../../../../src/model/config/nodes';
import * as xmldom from '@xmldom/xmldom';
import { parseXML } from '../../../../src/xml-exporter/xml-utils';

jest.mock('uuid', () => ({
    v4: () => 'unique_id',
}));

jest.mock('../../../../src/model/figure', () => ({
    getFigureImageUrlFromXml: () => 'IMAGE_URL',
    createFigureLicenseAttributes: () => ({
        copyrightHolder: 'Copyright holder',
        copyrightStatement: 'Copyright stmt',
        copyrightYear: 'Copyright year',
        licenseType: 'License type',
    }),
    createEmptyLicenseAttributes: () => ({
        copyrightHolder: '',
        copyrightStatement: '',
        copyrightYear: '',
        licenseType: '',
    }),
}));

describe('nodes spec', () => {
    const xmlDoc = new xmldom.DOMImplementation().createDocument(null, null);

    it('checks nodes spec definition', () => {
        expect(nodes).toMatchSnapshot();
    });

    it('checks annotatedReferenceInfoDoc spec', () => {
        expect(nodes['annotatedReferenceInfoDoc'].toDOM()).toEqual(['p', 0]);
    });

    it('checks article-title spec', () => {
        expect(nodes['article-title'].toDOM()).toEqual(['article-title', 0]);
    });

    it('checks abstract spec', () => {
        expect(nodes['abstract'].toDOM()).toEqual(['p', 0]);
    });

    it('checks keyword spec', () => {
        expect(nodes['keyword'].toDOM()).toEqual(['div', 0]);
    });

    it('checks paragraph spec', () => {
        expect(nodes['paragraph'].toDOM()).toEqual(['p', 0]);
    });

    it('checks section spec', () => {
        expect(nodes['section'].toDOM()).toEqual(['section', 0]);
    });

    it('checks boxText spec', () => {
        expect(nodes['boxText'].toDOM()).toEqual(['boxed-text', 0]);
    });

    it('checks figureTitle spec', () => {
        expect(nodes['figureTitle'].toDOM()).toEqual(['title', 0]);
    });

    it('checks figureLegend spec', () => {
        expect(nodes['figureLegend'].toDOM()).toEqual(['p', 0]);
    });

    it('checks figureAttribution spec', () => {
        expect(nodes['figureAttribution'].toDOM()).toEqual(['p', 0]);
    });

    it('checks orderedList spec', () => {
        expect(nodes['orderedList'].toDOM()).toEqual(['ol', 0]);
    });

    it('checks bulletList spec', () => {
        expect(nodes['bulletList'].toDOM()).toEqual(['ul', 0]);
    });

    it('checks listItem spec', () => {
        expect(nodes['listItem'].toDOM()).toEqual(['li', 0]);
    });

    it('checks heading spec attributes', () => {
        const doc = parseXML(`<sec>
        <title id="title1">Test</title>
        <sec>
            <title id="title2"> Second level heading </title>
        </sec>
    </sec>`);
        expect(nodes['heading'].parseDOM[0].getAttrs!(doc.querySelector('#title1')!)).toEqual({
            domId: 'unique_id',
            level: 1,
        });
        expect(nodes['heading'].parseDOM[0].getAttrs!(doc.querySelector('#title2')!)).toEqual({
            domId: 'unique_id',
            level: 2,
        });
    });

    it('checks heading spec rendering', () => {
        const node = new ProsemirrorNode();
        node.attrs = { level: 3, domId: 'SOME_ID' };
        expect(nodes['heading'].toDOM(node)).toEqual(['h3', { id: 'SOME_ID' }, 0]);
    });

    it('checks refCitation spec XML attributes', () => {
        const node = xmlDoc.createElement('xref');
        node.appendChild(xmlDoc.createTextNode('SOME_TEXT'));
        node.setAttribute('rid', 'SOME_ID');
        expect(nodes['refCitation'].parseDOM[0].getAttrs!(node)).toEqual({ refText: 'SOME_TEXT', refId: 'SOME_ID' });
    });

    it('checks refCitation spec HTML (clipboards) attributes', () => {
        const node = xmlDoc.createElement('a');
        node.appendChild(xmlDoc.createTextNode('SOME_TEXT'));
        node.setAttribute('data-cit-type', 'reference');
        node.setAttribute('data-ref-id', 'SOME_ID');
        node.setAttribute('data-ref-text', 'SOME_TEXT');
        expect(nodes['refCitation'].parseDOM[1].getAttrs!(node)).toEqual({ refText: 'SOME_TEXT', refId: 'SOME_ID' });
    });

    it('checks refCitation spec rendering', () => {
        const node = new ProsemirrorNode();

        node.attrs = { refId: 'SOME_ID', refText: 'SOME_TEXT' };
        expect(nodes['refCitation'].toDOM(node)).toEqual([
            'xref',
            {
                'ref-type': 'bibr',
                rid: 'SOME_ID',
            },
            'SOME_TEXT',
        ]);
    });

    it('checks figure spec rendering', () => {
        const node = xmlDoc.createElement('fig');
        node.setAttribute('id', 'SOME_ID');
        const label = xmlDoc.createElement('label');
        label.appendChild(xmlDoc.createTextNode('SOME_LABEL'));
        node.appendChild(label);
        expect(nodes['figure'].parseDOM[0].getAttrs(node)).toEqual({
            id: 'SOME_ID',
            label: 'SOME_LABEL',
            img: 'IMAGE_URL',
        });
    });

    it('checks figureLicese attributes', () => {
        const node = xmlDoc.createElement('fig');
        expect(nodes['figureLicense'].parseDOM[0].getAttrs!(node)).toEqual({
            licenseInfo: {
                copyrightHolder: 'Copyright holder',
                copyrightStatement: 'Copyright stmt',
                copyrightYear: 'Copyright year',
                licenseType: 'License type',
            },
        });
    });

    it('checks figureLicese rendering', () => {
        const node = xmlDoc.createElement('fig');
        expect(nodes['figureLicense'].toDOM()).toEqual(['license-p', 0]);
    });

    it('checks figureCitation spec XML attributes', () => {
        const node = xmlDoc.createElement('xref');
        node.setAttribute('rid', 'SOME_ID');
        expect(nodes['figureCitation'].parseDOM[0].getAttrs!(node)).toEqual({ figIds: ['SOME_ID'] });
    });

    it('checks figureCitation spec HTML (clipboards) attributes', () => {
        const node = xmlDoc.createElement('a');
        node.setAttribute('data-fig-ids', 'SOME_ID1 SOME_ID2');
        expect(nodes['figureCitation'].parseDOM[1].getAttrs!(node)).toEqual({ figIds: ['SOME_ID1', 'SOME_ID2'] });
    });

    it('checks figureCitation spec rendering', () => {
        const node = new ProsemirrorNode();

        node.attrs = { figIds: ['SOME_ID1', 'SOME_ID2'] };
        expect(nodes['figureCitation'].toDOM(node)).toEqual([
            'xref',
            {
                'ref-type': 'fig',
                rid: 'SOME_ID1 SOME_ID2',
            },
            0,
        ]);
    });
});

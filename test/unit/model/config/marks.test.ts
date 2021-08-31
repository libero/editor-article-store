import { Node as ProsemirrorNode } from 'prosemirror-model';

import { marks } from '../../../../src/model/config/marks';
import * as xmldom from '@xmldom/xmldom';

describe('nodes spec', () => {
    it('checks nodes spec definition', () => {
        expect(marks).toMatchSnapshot();
    });

    it('checks sub spec', () => {
        expect(marks['subscript'].toDOM()).toEqual(['sub', 0]);
    });

    it('checks sup spec', () => {
        expect(marks['superscript'].toDOM()).toEqual(['sup', 0]);
    });

    it('checks italic spec', () => {
        expect(marks['italic'].toDOM()).toEqual(['italic', 0]);
    });

    it('checks strikethrough spec', () => {
        expect(marks['strikethrough'].toDOM()).toEqual(['sc', 0]);
    });

    it('checks underline spec', () => {
        expect(marks['underline'].toDOM()).toEqual(['underline', 0]);
    });

    it('checks bold spec', () => {
        expect(marks['bold'].toDOM()).toEqual(['bold', 0]);
    });

    it('checks link spec attributes', () => {
        const xmlDoc = new xmldom.DOMImplementation().createDocument(null, null);
        const node = xmlDoc.createElement('a');
        node.setAttribute('xlink:href', 'URL');
        expect(marks['link'].parseDOM[0].getAttrs!(node)).toEqual({ href: 'URL' });
    });

    it('checks link spec rendering', () => {
        const node = new ProsemirrorNode();
        node.attrs = { href: 'URL' };
        expect(marks['link'].toDOM(node)).toEqual(['ext-link', { 'xlink:href': 'URL', 'ext-link-type': 'uri' }, 0]);
    });
});

import { clearNode, parseXML } from '../../../src/xml-exporter/xml-utils';

describe('xml-utils', () => {
    it('checks clearNode', () => {
        const dom = parseXML('<div></div><div></div><div></div>');
        const el = dom.documentElement;
        el.innerHTML = '<div></div><div></div><div></div>';
        clearNode(el);
        expect(el.childNodes.length).toBe(0);
    });

    it('checks xml selectors', () => {
        const dom = parseXML(`<?xml version="1.0" encoding="UTF-8"?>
      <journal-meta>
          <journal-id journal-id-type="nlm-ta">elife</journal-id>
          <journal-id journal-id-type="publisher-id">eLife</journal-id>
          <journal-title-group>
              <journal-title>eLife</journal-title>
          </journal-title-group>
          <issn pub-type="epub" publication-format="electronic">2050-084X</issn>
          <publisher>
              <publisher-name>eLife Sciences Publications, Ltd</publisher-name>
          </publisher>
      </journal-meta>`);

        expect(dom.querySelector('journal-meta')!.nodeName).toBe('journal-meta');
        expect(dom.querySelectorAll('journal-id').length).toBe(2);
        expect(dom.querySelector('publisher-name')!.matches('publisher publisher-name')).toBe(true);
        expect(dom.querySelector('journal-id')!.getAttribute('journal-id-type')).toBe('nlm-ta');
        expect(dom.querySelector('journal-id')!.hasAttribute('journal-id-type')).toBe(true);
        expect(dom.querySelector('publisher')!.querySelector('publisher-name')!.textContent).toBe(
            'eLife Sciences Publications, Ltd',
        );
    });
});

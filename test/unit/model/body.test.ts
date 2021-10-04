import xmldom from '@xmldom/xmldom';
import { createBodyState, serializeBodyState } from '../../../src/model/body';
import { Manuscript } from '../../../src/model/manuscript';
import { parseXML } from '../../../src/xml-exporter/xml-utils';

describe('Manuscript state factory', () => {
    it('creates body state', () => {
        const xmlDoc = parseXML(`<article>
        <body> A sample <italic>text</italic> with <sub>a</sub> variety of <sup>tags</sup> </body>
    </article>`);
        const editorState = createBodyState(xmlDoc.querySelector('body')!);
        expect(editorState).toMatchSnapshot();
    });
});

describe('serializeBodyState', () => {
    it('replaces xml docs body with manuscripts body state', () => {
        const xml = parseXML(`
        <article>
            <body>
                I am some body text
            </body>
        </article>
        `);
        const bodyXML = parseXML(`
            <article><body>
                <p>I am some different body <bold>text</bold></p>
            </body></article>
        `);
        const manuscript = {
            body: createBodyState(bodyXML.querySelector('body')!),
        } as Manuscript;

        serializeBodyState(xml, manuscript);
        expect(new xmldom.XMLSerializer().serializeToString(xml)).toBe(`
        <article>
            <body><p>I am some different body <bold>text</bold></p></body>
        </article>`);
    });

    it('sequentially reset figure ids', () => {
        const xml = parseXML(`
            <article>
                <body/>
            </article>
        `);
        const bodyXML = parseXML(`
            <article><body>
                <fig id="0000000000" position="float">
                    <label>Fig 1.</label>
                        <caption>
                            <title>A Fig</title>
                        </caption>
                    <graphic mime-subtype="tiff" mimetype="image" xlink:href="elife-00666-scheme1-fig1.tif"/>
                </fig>
                <fig id="1111111111" position="float">
                    <label>Fig 2.</label>
                        <caption>
                            <title>Another Fig</title>
                        </caption>
                    <graphic mime-subtype="tiff" mimetype="image" xlink:href="elife-00666-scheme1-fig1.tif"/>
                </fig>
                <p><xref ref-type="fig" rid="1111111111">Fig 2.</xref>I am some different body <bold>text</bold><xref ref-type="fig" rid="0000000000">Fig 1.</xref></p>
            </body></article>
        `);
        const manuscript = {
            body: createBodyState(bodyXML.querySelector('body')!),
        } as Manuscript;

        serializeBodyState(xml, manuscript);
        expect(new xmldom.XMLSerializer().serializeToString(xml)).toBe(`
            <article>
                <body><fig id="fig1" position="float"><label>Fig 1.</label><caption><title>A Fig</title><p/><p/></caption><graphic mime-subtype="tiff"  xlink:href="elife-00666-scheme1-fig1.tif" mimetype="image"/></fig><fig id="fig2" position="float"><label>Fig 2.</label><caption><title>Another Fig</title><p/><p/></caption><graphic mime-subtype="tiff"  xlink:href="elife-00666-scheme1-fig1.tif" mimetype="image"/></fig><p><xref ref-type="fig" rid="fig2">Fig 2.</xref>I am some different body <bold>text</bold><xref ref-type="fig" rid="fig1">Fig 1.</xref></p></body>
            </article>`);
    });
});

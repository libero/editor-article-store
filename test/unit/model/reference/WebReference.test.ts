import { WebReference } from '../../../../src/model/reference/WebReference';
import { parseXML } from '../../../../src/xml-exporter/xml-utils';
import * as xmldom from 'xmldom';

jest.mock('uuid', () => ({
    v4: () => 'unique_id',
}));

const emptyWebRefJSON = {
    year: '',
    dateInCitation: '',
    extLink: '',
};

const populatedWebRefJSON = {
    year: 'year',
    dateInCitation: '2011-10-10',
    extLink: 'extLink',
};

describe('WebReference', () => {
    it('creates a blank WebReference when passed no constructor args', () => {
        const webReference = new WebReference();
        expect(webReference).toEqual(expect.objectContaining(emptyWebRefJSON));
        expect(webReference.articleTitle.doc.textContent).toBe('');
        expect(webReference.source.doc.textContent).toBe('');
        expect(webReference.id).toBe('unique_id');
    });
    describe('fromJSON', () => {
        it('returns empty WebReference when called with empty data object', () => {
            const webReference = new WebReference({});
            expect(webReference).toEqual(expect.objectContaining(emptyWebRefJSON));
            expect(webReference.articleTitle.doc.textContent).toBe('');
            expect(webReference.source.doc.textContent).toBe('');
            expect(webReference.id).toBe('unique_id');
        });
        it('returns WebReference when called with populated data object ', () => {
            const webReference = new WebReference({
                ...populatedWebRefJSON,
                articleTitle: {
                    doc: {
                        content: [
                            {
                                text: 'I am articleTitle text',
                                type: 'text',
                            },
                        ],
                        type: 'annotatedReferenceInfoDoc',
                    },
                    selection: {
                        anchor: 0,
                        head: 0,
                        type: 'text',
                    },
                },
                source: {
                    doc: {
                        content: [
                            {
                                text: 'I am source text',
                                type: 'text',
                            },
                        ],
                        type: 'annotatedReferenceInfoDoc',
                    },
                    selection: {
                        anchor: 0,
                        head: 0,
                        type: 'text',
                    },
                },
            });
            expect(webReference).toEqual(expect.objectContaining(populatedWebRefJSON));
            expect(webReference.articleTitle.doc.textContent).toBe('I am articleTitle text');
            expect(webReference.source.doc.textContent).toBe('I am source text');
            expect(webReference.id).toBe('unique_id');
        });

        it('creates an WebReference with specified data and ID', () => {
            const webReference = new WebReference({ ...populatedWebRefJSON, _id: 'SOME_ID' });
            expect(webReference.id).toBe('SOME_ID');
            expect(webReference).toStrictEqual(expect.objectContaining(populatedWebRefJSON));
        });
    });
    describe('fromXml', () => {
        it('returns empty WebReference when called with empty XML fragment', () => {
            const xmlWrapper = parseXML(`<article><element-citation /></article>`);
            const webReference = new WebReference(xmlWrapper.querySelector('element-citation') as Element);
            expect(webReference).toEqual(expect.objectContaining(emptyWebRefJSON));
            expect(webReference.articleTitle.doc.textContent).toBe('');
            expect(webReference.source.doc.textContent).toBe('');
            expect(webReference.id).toBe('unique_id');
        });
        it('returns WebReference when called with populated XML fragment', () => {
            const xmlWrapper = parseXML(`<article><element-citation>
        <year iso-8601-date="1994">1994</year>
        <article-title>Solar System Live</article-title>
        <source>The Washington Post</source>
        <ext-link ext-link-type="uri" xlink:href="https://www.fourmilab.ch/solar/">https://www.fourmilab.ch/solar/</ext-link>
        <date-in-citation iso-8601-date="1995-09-10">September 10, 1995</date-in-citation>
      </element-citation></article>`);

            const webReference = new WebReference(xmlWrapper.querySelector('element-citation') as Element);
            expect(webReference).toEqual(
                expect.objectContaining({
                    year: '1994',
                    dateInCitation: '1995-09-10',
                    extLink: 'https://www.fourmilab.ch/solar/',
                }),
            );

            expect(webReference.articleTitle.doc.textContent).toBe('Solar System Live');
            expect(webReference.source.doc.textContent).toBe('The Washington Post');
            expect(webReference.id).toBe('unique_id');
        });

        it('returns WebReference when called with populated XML fragment and empty date-in-citation', () => {
            const xmlWrapper = parseXML(`<article><element-citation>
        <year iso-8601-date="1994">1994</year>
        <article-title>Solar System Live</article-title>
        <source>The Washington Post</source>
        <ext-link ext-link-type="uri" xlink:href="https://www.fourmilab.ch/solar/">https://www.fourmilab.ch/solar/</ext-link>
        <date-in-citation></date-in-citation>
      </element-citation></article>`);

            const webReference = new WebReference(xmlWrapper.querySelector('element-citation') as Element);
            expect(webReference).toEqual(
                expect.objectContaining({
                    year: '1994',
                    dateInCitation: '',
                    extLink: 'https://www.fourmilab.ch/solar/',
                }),
            );

            expect(webReference.articleTitle.doc.textContent).toBe('Solar System Live');
            expect(webReference.source.doc.textContent).toBe('The Washington Post');
            expect(webReference.id).toBe('unique_id');
        });
    });

    describe('toXml', () => {
        const xmlSerializer = new xmldom.XMLSerializer();
        it('should serialize a empty web reference', () => {
            const reference = new WebReference(emptyWebRefJSON);
            const xmlString = xmlSerializer.serializeToString(reference.toXml());
            expect(xmlString).toBe('<element-citation publication-type="web"/>');
        });

        it('should serialize a populated web reference', () => {
            const reference = new WebReference({
                ...populatedWebRefJSON,
                articleTitle: {
                    doc: {
                        content: [
                            {
                                text: 'I am articleTitle text',
                                type: 'text',
                            },
                        ],
                        type: 'annotatedReferenceInfoDoc',
                    },
                    selection: {
                        anchor: 0,
                        head: 0,
                        type: 'text',
                    },
                },
                source: {
                    doc: {
                        content: [
                            {
                                text: 'I am source text',
                                type: 'text',
                            },
                        ],
                        type: 'annotatedReferenceInfoDoc',
                    },
                    selection: {
                        anchor: 0,
                        head: 0,
                        type: 'text',
                    },
                },
            });

            const xmlString = xmlSerializer.serializeToString(reference.toXml());
            expect(xmlString).toBe(
                `<element-citation publication-type="web"><year iso-8601-date="year">year</year><ext-link ext-link-type="uri" xlink:href="extLink">extLink</ext-link><article-title>I am articleTitle text</article-title><source>I am source text</source><date-in-citation iso-8601-date="2011-10-10">October 10, 2011</date-in-citation></element-citation>`,
            );
        });

        it('should not include date-in-citation if the value is empty', () => {
            const reference = new WebReference({ ...populatedWebRefJSON, dateInCitation: '' });

            const xmlString = xmlSerializer.serializeToString(reference.toXml());
            expect(xmlString).toBe(
                '<element-citation publication-type="web"><year iso-8601-date="year">year</year><ext-link ext-link-type="uri" xlink:href="extLink">extLink</ext-link><article-title/><source/></element-citation>',
            );
        });
    });
});

import xmldom from 'xmldom';
import { PeriodicalReference } from '../../../../src/model/reference/PeriodicalReference';
import { parseXML } from '../../../../src/xml-exporter/xml-utils';
jest.mock('uuid', () => ({
    v4: () => 'unique_id',
}));

const emptyPeriodicalRefJSON = {
    date: '',
    firstPage: '',
    lastPage: '',
    volume: '',
    extLink: '',
};
const populatedPeriodicalRefJSON = {
    date: '2016-10-03',
    volume: 'someVolume',
    firstPage: 'someFirstPage',
    lastPage: 'someLastPage',
    extLink: 'someExternalLink',
};
describe('PeriodicalReference', () => {
    it('creates a blank PeriodicalReference when passed no constructor args', () => {
        const periodicalRef = new PeriodicalReference();
        expect(periodicalRef).toEqual(expect.objectContaining(emptyPeriodicalRefJSON));
        expect(periodicalRef.articleTitle.doc.textContent).toBe('');
        expect(periodicalRef.source.doc.textContent).toBe('');
        expect(periodicalRef.id).toBe('unique_id');
    });
    describe('fromJSON', () => {
        it('returns empty PeriodicalReference when called with empty data object', () => {
            const periodicalRef = new PeriodicalReference({});
            expect(periodicalRef).toEqual(expect.objectContaining(emptyPeriodicalRefJSON));
            expect(periodicalRef.articleTitle.doc.textContent).toBe('');
            expect(periodicalRef.source.doc.textContent).toBe('');
            expect(periodicalRef.id).toBe('unique_id');
        });
        it('returns PeriodicalReference when called with populated data object ', () => {
            const periodicalRef = new PeriodicalReference({
                ...populatedPeriodicalRefJSON,
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
            expect(periodicalRef).toEqual(expect.objectContaining(populatedPeriodicalRefJSON));
            expect(periodicalRef.articleTitle.doc.textContent).toBe('I am articleTitle text');
            expect(periodicalRef.source.doc.textContent).toBe('I am source text');
            expect(periodicalRef.id).toBe('unique_id');
        });

        it('creates an PeriodicalReference with specified data and ID', () => {
            const periodicalRef = new PeriodicalReference({ ...populatedPeriodicalRefJSON, _id: 'SOME_ID' });
            expect(periodicalRef.id).toBe('SOME_ID');
            expect(periodicalRef).toStrictEqual(expect.objectContaining(populatedPeriodicalRefJSON));
        });
    });
    describe('fromXml', () => {
        it('returns empty PeriodicalReference when called with empty XML fragment', () => {
            const xmlWrapper = parseXML(`<article><element-citation /></article>`);
            const periodicalRef = new PeriodicalReference(xmlWrapper.querySelector('element-citation') as Element);
            expect(periodicalRef).toEqual(expect.objectContaining(emptyPeriodicalRefJSON));
            expect(periodicalRef.articleTitle.doc.textContent).toBe('');
            expect(periodicalRef.source.doc.textContent).toBe('');
            expect(periodicalRef.id).toBe('unique_id');
        });
        it('returns PeriodicalReference when called with populated XML fragment', () => {
            const xmlWrapper = parseXML(`<article><element-citation>
      <string-date iso-8601-date="1993-09-09">
        <month>September</month> 
        <day>9</day>, 
        <year>1993</year>
      </string-date>
      <volume>2854</volume>
      <article-title>Obesity affects economic, social status</article-title>
      <source>The Washington Post</source>
      <fpage>1</fpage>
      <lpage>4</lpage>
      <ext-link>https://elifesciences.org</ext-link>
      </element-citation></article>`);

            const periodicalRef = new PeriodicalReference(xmlWrapper.querySelector('element-citation') as Element);
            expect(periodicalRef).toEqual(
                expect.objectContaining({
                    date: '1993-09-09',
                    volume: '2854',
                    firstPage: '1',
                    lastPage: '4',
                    extLink: 'https://elifesciences.org',
                }),
            );

            expect(periodicalRef.articleTitle.doc.textContent).toBe('Obesity affects economic, social status');
            expect(periodicalRef.source.doc.textContent).toBe('The Washington Post');
            expect(periodicalRef.id).toBe('unique_id');
        });
    });
    describe('toXml', () => {
        const xmlSerializer = new xmldom.XMLSerializer();

        it('should serialize an empty periodical reference', () => {
            const reference = new PeriodicalReference();
            const xmlString = xmlSerializer.serializeToString(reference.toXml());
            expect(xmlString).toBe(
                '<element-citation publication-type="periodical"><string-date iso-8601-date=""/><article-title/><source/><volume></volume><fpage></fpage><lpage></lpage><ext-link ext-link-type="uri" xlink:href=""></ext-link></element-citation>',
            );
        });

        it('should serialize a populated periodical reference', () => {
            const reference = new PeriodicalReference({
                ...populatedPeriodicalRefJSON,
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
                '<element-citation publication-type="periodical">' +
                    '<string-date iso-8601-date="2016-10-03"><month>October</month><day>3</day>, <year>2016</year></string-date>' +
                    '<article-title>I am articleTitle text</article-title>' +
                    '<source>I am source text</source>' +
                    '<volume>someVolume</volume>' +
                    '<fpage>someFirstPage</fpage>' +
                    '<lpage>someLastPage</lpage>' +
                    '<ext-link ext-link-type="uri" xlink:href="someExternalLink">someExternalLink</ext-link>' +
                    '</element-citation>',
            );
        });
    });
});

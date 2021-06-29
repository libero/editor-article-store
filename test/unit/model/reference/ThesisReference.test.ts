import xmldom from 'xmldom';
import { ThesisReference } from '../../../../src/model/reference/ThesisReference';
import { parseXML } from '../../../../src/xml-exporter/xml-utils';

jest.mock('uuid', () => ({
    v4: () => 'unique_id',
}));

const emptyThesisRefJSON = {
    year: '',
    publisherLocation: '',
    publisherName: '',
    doi: '',
    extLink: '',
    pmid: '',
};

const populatedThesisRefJSON = {
    year: 'year',
    publisherLocation: 'publisherLocation',
    publisherName: 'publisherName',
    doi: 'doi',
    extLink: 'extLink',
    pmid: 'pmid',
};

describe('ThesisReference', () => {
    it('creates a blank ThesisReference when passed no constructor args', () => {
        const thesisReference = new ThesisReference();
        expect(thesisReference).toEqual(expect.objectContaining(emptyThesisRefJSON));
        expect(thesisReference.articleTitle.doc.textContent).toBe('');
        expect(thesisReference.id).toBe('unique_id');
    });
    describe('fromJSON', () => {
        it('returns empty ThesisReference when called with empty data object', () => {
            const bookRef = new ThesisReference({});
            expect(bookRef).toEqual(expect.objectContaining(emptyThesisRefJSON));
            expect(bookRef.articleTitle.doc.textContent).toBe('');
            expect(bookRef.id).toBe('unique_id');
        });
        it('returns ThesisReference when called with populated data object ', () => {
            const bookRef = new ThesisReference({
                ...populatedThesisRefJSON,
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
            });
            expect(bookRef).toEqual(expect.objectContaining(populatedThesisRefJSON));
            expect(bookRef.articleTitle.doc.textContent).toBe('I am articleTitle text');
            expect(bookRef.id).toBe('unique_id');
        });

        it('creates an ThesisReference with specified data and ID', () => {
            const bookRef = new ThesisReference({ ...populatedThesisRefJSON, _id: 'SOME_ID' });
            expect(bookRef.id).toBe('SOME_ID');
            expect(bookRef).toStrictEqual(expect.objectContaining(populatedThesisRefJSON));
        });
    });
    describe('fromXml', () => {
        it('returns empty ThesisReference when called with empty XML fragment', () => {
            const xmlWrapper = parseXML(`<article><element-citation /></article>`);
            const bookRef = new ThesisReference(xmlWrapper.querySelector('element-citation') as Element);
            expect(bookRef).toEqual(expect.objectContaining(emptyThesisRefJSON));
            expect(bookRef.articleTitle.doc.textContent).toBe('');
            expect(bookRef.id).toBe('unique_id');
        });
        it('returns ThesisReference when called with populated XML fragment', () => {
            const xmlWrapper = parseXML(`<article><element-citation> 
        <year iso-8601-date="2014">2014</year>
        <article-title>Automated hypothesis generation based on mining scientific literature</article-title>
        <publisher-loc>Vienna, Austria</publisher-loc>
        <publisher-name>R Foundation for Statistical Computing</publisher-name>
        <ext-link ext-link-type="uri" xlink:href="http://www.R-project.org/">http://www.R-project.org/</ext-link>
        <pub-id pub-id-type="doi">10.7554/eLife.42697</pub-id>
        <pub-id pub-id-type="pmid">31038122</pub-id>
      </element-citation></article>`);

            const bookRef = new ThesisReference(xmlWrapper.querySelector('element-citation') as Element);
            expect(bookRef).toEqual(
                expect.objectContaining({
                    year: '2014',
                    publisherLocation: 'Vienna, Austria',
                    publisherName: 'R Foundation for Statistical Computing',
                    doi: '10.7554/eLife.42697',
                    extLink: 'http://www.R-project.org/',
                    pmid: '31038122',
                }),
            );

            expect(bookRef.articleTitle.doc.textContent).toBe(
                'Automated hypothesis generation based on mining scientific literature',
            );
            expect(bookRef.id).toBe('unique_id');
        });
    });
    describe('toXml', () => {
        const xmlSerializer = new xmldom.XMLSerializer();

        it('should serialize an empty thesis reference', () => {
            const reference = new ThesisReference();
            const xmlString = xmlSerializer.serializeToString(reference.toXml());
            expect(xmlString).toBe('<element-citation publication-type="thesis"/>');
        });

        it('should serialize a populated thesis reference', () => {
            const reference = new ThesisReference({
                ...populatedThesisRefJSON,
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
            });
            const xmlString = xmlSerializer.serializeToString(reference.toXml());
            expect(xmlString).toBe(
                '<element-citation publication-type="thesis">' +
                    '<year iso-8601-date="year">year</year>' +
                    '<article-title>I am articleTitle text</article-title>' +
                    '<publisher-name>publisherName</publisher-name>' +
                    '<ext-link ext-link-type="uri" xlink:href="extLink">extLink</ext-link>' +
                    '</element-citation>',
            );
        });
    });
});

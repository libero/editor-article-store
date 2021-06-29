import xmldom from 'xmldom';
import { PatentReference } from '../../../../src/model/reference/PatentReference';
import { parseXML } from '../../../../src/xml-exporter/xml-utils';

jest.mock('uuid', () => ({
    v4: () => 'unique_id',
}));

const emptyPatentRefJSON = {
    year: '',
    patent: '',
    extLink: '',
};

const populatedPatentRefJSON = {
    year: '2014',
    patent: 'NM_009324.2',
    extLink: 'http://www.ncbi.nlm.nih.gov/nuccore/120407038',
};

const populatedPatentRefXML =
    '<element-citation publication-type="patent">' +
    '<year iso-8601-date="2014">2014</year>' +
    '<article-title>Imidazopyridine Derivative</article-title>' +
    '<source>World Intellectual Property Organization</source>' +
    '<patent>NM_009324.2</patent>' +
    '<ext-link ext-link-type="uri" xlink:href="http://www.ncbi.nlm.nih.gov/nuccore/120407038">http://www.ncbi.nlm.nih.gov/nuccore/120407038</ext-link>' +
    '</element-citation>';

describe('PatentReference', () => {
    it('creates a blank PatentReference when passed no constructor args', () => {
        const patentReference = new PatentReference();
        expect(patentReference).toEqual(expect.objectContaining(emptyPatentRefJSON));
        expect(patentReference.articleTitle.doc.textContent).toBe('');
        expect(patentReference.source.doc.textContent).toBe('');
        expect(patentReference.id).toBe('unique_id');
    });
    describe('fromJSON', () => {
        it('returns empty PatentReference when called with empty data object', () => {
            const patentReference = new PatentReference({});
            expect(patentReference).toEqual(expect.objectContaining(emptyPatentRefJSON));
            expect(patentReference.articleTitle.doc.textContent).toBe('');
            expect(patentReference.source.doc.textContent).toBe('');
            expect(patentReference.id).toBe('unique_id');
        });

        it('returns PatentReference when called with populated data object ', () => {
            const patentReference = new PatentReference({
                ...populatedPatentRefJSON,
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
            expect(patentReference).toEqual(expect.objectContaining(populatedPatentRefJSON));
            expect(patentReference.articleTitle.doc.textContent).toBe('I am articleTitle text');
            expect(patentReference.source.doc.textContent).toBe('I am source text');
            expect(patentReference.id).toBe('unique_id');
        });

        it('creates an dataReference with specified data and ID', () => {
            const patentReference = new PatentReference({ ...populatedPatentRefJSON, _id: 'SOME_ID' });
            expect(patentReference.id).toBe('SOME_ID');
            expect(patentReference).toStrictEqual(expect.objectContaining(populatedPatentRefJSON));
        });
    });
    describe('fromXml', () => {
        it('returns empty dataReference when called with empty XML fragment', () => {
            const xmlWrapper = parseXML(`<article><element-citation /></article>`);
            const patentReference = new PatentReference(xmlWrapper.querySelector('element-citation') as Element);
            expect(patentReference).toEqual(expect.objectContaining(emptyPatentRefJSON));
            expect(patentReference.articleTitle.doc.textContent).toBe('');
            expect(patentReference.source.doc.textContent).toBe('');
            expect(patentReference.id).toBe('unique_id');
        });

        it('returns PatentReference when called with populated XML fragment', () => {
            const xmlWrapper = parseXML(populatedPatentRefXML);

            const patentReference = new PatentReference(xmlWrapper.querySelector('element-citation') as Element);
            expect(patentReference).toEqual(expect.objectContaining(populatedPatentRefJSON));
            expect(patentReference.articleTitle.doc.textContent).toBe('Imidazopyridine Derivative');
            expect(patentReference.source.doc.textContent).toBe('World Intellectual Property Organization');
            expect(patentReference.id).toBe('unique_id');
        });
    });
    describe('toXml', () => {
        const xmlSerializer = new xmldom.XMLSerializer();

        it('should serialize an empty Patent reference', () => {
            const reference = new PatentReference();
            const xmlString = xmlSerializer.serializeToString(reference.toXml());
            expect(xmlString).toBe('<element-citation publication-type="patent"/>');
        });

        it('should serialize a populated Patent reference', () => {
            const reference = new PatentReference({
                ...populatedPatentRefJSON,
                articleTitle: {
                    doc: {
                        content: [
                            {
                                text: 'Imidazopyridine Derivative',
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
                                text: 'World Intellectual Property Organization',
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
            expect(xmlString).toBe(populatedPatentRefXML);
        });
    });
});

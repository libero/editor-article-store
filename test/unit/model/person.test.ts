import { cloneDeep } from 'lodash';
import { EditorState } from 'prosemirror-state';

import { createAuthorsState, Person, serializeAuthors } from '../../../src/model/person';
import { JSONObject } from '../../../src/model/types';
import { clearNode, parseXML } from '../../../src/xml-exporter/xml-utils';
import { Manuscript } from '../../../src/model/manuscript';
import { Schema } from 'prosemirror-model';
import { cloneManuscript } from '../../../src/model/changes.utils';
import * as xmldom from 'xmldom';
import { ArticleInformation } from '../../../src/model/article-information';
import { Affiliation } from '../../../src/model/affiliation';

jest.mock('uuid', () => ({
    v5: () => 'unique_id',
    v4: () => 'unique_id',
}));

const textSchema = new Schema({
    nodes: {
        text: {},
        doc: { content: 'text*' },
    },
});

const mockManuscript: Manuscript = {
    articleInfo: new ArticleInformation(),
    authors: [],
    journalMeta: { publisherName: 'foo', issn: 'bar' },
    title: EditorState.create({ schema: textSchema }),
    abstract: EditorState.create({ schema: textSchema }),
    impactStatement: EditorState.create({ schema: textSchema }),
    body: EditorState.create({ schema: textSchema }),
    acknowledgements: EditorState.create({ schema: textSchema }),
    keywordGroups: {},
    relatedArticles: [],
    affiliations: [new Affiliation({ _id: 'aff2' }), new Affiliation({ _id: 'aff3' })],
    references: [],
};

const mockJsonData = {
    _id: 'author-3888',
    firstName: 'Joseph',
    lastName: 'Bloggs',
    suffix: 'Capt.',
    isAuthenticated: true,
    orcid: '0000-0001-5225-4203',
    email: 'example@example.com',
    bio: {
        doc: {
            type: 'doc',
            content: [
                {
                    type: 'paragraph',
                    content: [
                        { type: 'text', marks: [{ type: 'bold' }], text: 'Joseph Bloggs' },
                        {
                            type: 'text',
                            text: ' is in the Department of Molecular Biology and Genetics, Cornell University, Ithaca, United States',
                        },
                    ],
                },
            ],
        },
        selection: { type: 'text', anchor: 1, head: 1 },
    },
    isCorrespondingAuthor: true,
    affiliations: ['aff2'],
} as JSONObject;

const mockXmlData = `
  <contrib corresp="yes">
    <name><surname>Atherden</surname><given-names>Fred</given-names><suffix>Capt.</suffix></name>
    <contrib-id authenticated="true" contrib-id-type="orcid">https://orcid.org/0000-0002-6048-1470</contrib-id>
    <email>fatherden@elifesciences.org</email>
    <bio><p><bold>Jeanine Smith III</bold> is in the Department, University, City, Country</p></bio>
    <xref ref-type="aff" rid="aff2">2</xref>
    <xref ref-type="aff" rid="aff3">3</xref>
  </contrib>
`;

const authorNotesXml = `<author-notes>
    <fn fn-type="COI-statement" id="con1">
      <p>Is an employee of eLife. No other competing interests exist</p>
    </fn>
  </author-notes>`;

describe('Person class', () => {
    describe('constructor', function () {
        it('creates a blank Person instance', () => {
            const author = new Person();
            expect(author).toStrictEqual(
                expect.objectContaining({
                    _id: 'unique_id',
                    firstName: '',
                    lastName: '',
                    suffix: '',
                    isAuthenticated: false,
                    orcid: '',
                    email: '',
                    isCorrespondingAuthor: false,
                    affiliations: [],
                }),
            );

            expect(author.bio).toBeInstanceOf(EditorState);
            expect(author.bio!.doc.textContent).toBe('');
        });
        describe('fromJSON', () => {
            it('creates author from JSON', () => {
                const author = new Person(mockJsonData);
                expect(author).toStrictEqual(
                    expect.objectContaining({
                        _id: 'author-3888',
                        firstName: 'Joseph',
                        lastName: 'Bloggs',
                        isAuthenticated: true,
                        orcid: '0000-0001-5225-4203',
                        email: 'example@example.com',
                        isCorrespondingAuthor: true,
                        affiliations: ['aff2'],
                    }),
                );

                expect(author.bio!.doc.textContent).toBe(
                    'Joseph Bloggs is in the Department of Molecular Biology and Genetics, Cornell University, Ithaca, United States',
                );
            });

            it('creates author from JSON and assigns a unique ID if JSON does not have any', () => {
                const jsonData = cloneDeep(mockJsonData);
                jsonData._id = undefined;
                const author = new Person(jsonData);
                expect(author).toStrictEqual(
                    expect.objectContaining({
                        _id: 'unique_id',
                        firstName: 'Joseph',
                        lastName: 'Bloggs',
                        isAuthenticated: true,
                        orcid: '0000-0001-5225-4203',
                        email: 'example@example.com',
                        isCorrespondingAuthor: true,
                        affiliations: ['aff2'],
                    }),
                );

                expect(author.bio!.doc.textContent).toBe(
                    'Joseph Bloggs is in the Department of Molecular Biology and Genetics, Cornell University, Ithaca, United States',
                );
            });

            it('ignores non-array values of affiliations field ', () => {
                const author = new Person({ affiliations: { testKey: 'testValue' } });
                expect(author).toStrictEqual(
                    expect.objectContaining({
                        _id: 'unique_id',
                        firstName: '',
                        lastName: '',
                        isAuthenticated: false,
                        orcid: '',
                        email: '',
                        isCorrespondingAuthor: false,
                        affiliations: [],
                    }),
                );

                expect(author.bio!.doc.textContent).toBe('');
            });
        });

        describe('fromXML', () => {
            it('creates author from XML', () => {
                const authorXml = parseXML(mockXmlData);
                const author = new Person(authorXml.querySelector('contrib')!);
                expect(author).toStrictEqual(
                    expect.objectContaining({
                        _id: 'unique_id',
                        firstName: 'Fred',
                        lastName: 'Atherden',
                        isAuthenticated: true,
                        orcid: '0000-0002-6048-1470',
                        email: 'fatherden@elifesciences.org',
                        isCorrespondingAuthor: true,
                        affiliations: ['aff2', 'aff3'],
                    }),
                );
                expect(author.bio!.doc.textContent).toBe(
                    'Jeanine Smith III is in the Department, University, City, Country',
                );
            });

            it('correctly assigns the authenticated flag attribute from XML', () => {
                const authorXml = parseXML(mockXmlData).querySelector('contrib')!;

                expect(new Person(authorXml).isAuthenticated).toBe(true);

                authorXml.querySelector('contrib-id')!.setAttribute('authenticated', 'gibberish');
                expect(new Person(authorXml).isAuthenticated).toBe(false);

                authorXml.querySelector('contrib-id')!.removeAttribute('authenticated');
                expect(new Person(authorXml).isAuthenticated).toBe(false);

                const orcidEl = authorXml.querySelector('contrib-id');
                orcidEl!.parentNode!.removeChild(orcidEl!);
                expect(new Person(authorXml).isAuthenticated).toBe(false);
            });

            it('correctly assigns orcid from XML', () => {
                const authorXml = parseXML(mockXmlData).querySelector('contrib')!;
                expect(new Person(authorXml).orcid).toBe('0000-0002-6048-1470');
                setNodeTextContent(
                    authorXml.querySelector('contrib-id')!,
                    'https://www.google.com/search?q=codswallop',
                );
                expect(new Person(authorXml).orcid).toBe('');
                setNodeTextContent(authorXml.querySelector('contrib-id')!, '');
                expect(new Person(authorXml).orcid).toBe('');

                const orcidEl = authorXml.querySelector('contrib-id');
                orcidEl!.parentNode!.removeChild(orcidEl!);
                expect(new Person(authorXml).orcid).toBe('');
            });

            it('correctly assigns corresponding author flag from XML', () => {
                const authorXml = parseXML(mockXmlData).querySelector('contrib')!;

                expect(new Person(authorXml).isCorrespondingAuthor).toBe(true);

                authorXml.setAttribute('corresp', 'yas');
                expect(new Person(authorXml).isCorrespondingAuthor).toBe(false);

                authorXml.removeAttribute('corresp');
                expect(new Person(authorXml).isCorrespondingAuthor).toBe(false);
            });

            it('correctly parses bio from XML', () => {
                const authorXml = parseXML(mockXmlData).querySelector('contrib')!;

                expect(new Person(authorXml).bio!.doc.textContent).toBe(
                    'Jeanine Smith III is in the Department, University, City, Country',
                );

                const bioEl = authorXml.querySelector('bio');
                bioEl!.parentNode!.removeChild(bioEl!);
                expect(new Person(authorXml).bio!.doc.textContent).toBe('');
            });

            it('correctly parses linked affiliations from XML', () => {
                const authorXml = parseXML(mockXmlData).querySelector('contrib')!;

                const linkedAffiliations = authorXml.querySelectorAll('xref[ref-type="aff"]');
                expect(new Person(authorXml).affiliations).toEqual(['aff2', 'aff3']);

                authorXml.removeChild(linkedAffiliations[0]);
                expect(new Person(authorXml).affiliations).toEqual(['aff3']);

                authorXml.removeChild(linkedAffiliations[1]);
                expect(new Person(authorXml).affiliations).toEqual([]);
            });
            it('creates an author with competing interests', () => {
                const notesXml = parseXML(authorNotesXml).querySelector('author-notes')!;
                const authorXml = parseXML(mockXmlData).querySelector('contrib')!;

                const author1 = new Person(authorXml, notesXml);
                expect(author1.hasCompetingInterest).toBe(false);
                expect(author1.competingInterestStatement).toBe('');

                const competingInterestRef = authorXml.ownerDocument.createElement('xref');
                competingInterestRef.setAttribute('ref-type', 'author-notes');
                competingInterestRef.setAttribute('rid', 'con1');
                authorXml.appendChild(competingInterestRef);

                const author2 = new Person(authorXml, notesXml);
                expect(author2.hasCompetingInterest).toBe(true);
                expect(author2.competingInterestStatement).toBe(
                    'Is an employee of eLife. No other competing interests exist',
                );
            });
        });
        describe('toXml', () => {
            const xmlSerializer = new xmldom.XMLSerializer();
            it('serializes an empty Person to XML', () => {
                const person = new Person();
                const authorNotesXml = new xmldom.DOMImplementation()
                    .createDocument('', '', null)
                    .createElement('author-notes');

                expect(xmlSerializer.serializeToString(person.toXml(authorNotesXml))).toBe(
                    '<contrib contrib-type="author">' +
                        '<name/>' +
                        '<bio>' +
                        '<p/>' +
                        '</bio>' +
                        '<xref ref-type="author-notes" rid="con1"/>' +
                        '</contrib>',
                );
            });
            it('serializes a populated Person to XML', () => {
                const person = new Person(mockJsonData);

                const xmlDoc = parseXML(
                    `<article><article-meta> <author-notes></author-notes> </article-meta></article>`,
                );
                const authorNotesXml = xmlDoc.querySelector('author-notes')!;

                expect(xmlSerializer.serializeToString(person.toXml(authorNotesXml))).toBe(
                    '<contrib contrib-type="author" corresp="yes">' +
                        '<name><given-names>Joseph</given-names><surname>Bloggs</surname><suffix>Capt.</suffix></name>' +
                        '<contrib-id contrib-id-type="orcid" authenticated="true">https://orcid.org/0000-0001-5225-4203</contrib-id>' +
                        '<email>example@example.com</email>' +
                        '<bio><p><bold>Joseph Bloggs</bold> is in the Department of Molecular Biology and Genetics, Cornell University, Ithaca, United States</p></bio>' +
                        '<xref ref-type="author-notes" rid="con1"/>' +
                        '</contrib>',
                );
            });

            it('serializes a populated Person with competing interests to XML', () => {
                const person = new Person({
                    ...mockJsonData,
                    hasCompetingInterest: true,
                    competingInterestStatement: 'Eats too many biscuits',
                });

                const xmlDoc = parseXML(
                    `<article><article-meta> <author-notes></author-notes> </article-meta></article>`,
                );
                const authorNotesXml = xmlDoc.querySelector('author-notes')!;

                expect(xmlSerializer.serializeToString(person.toXml(authorNotesXml))).toBe(
                    '<contrib contrib-type="author" corresp="yes">' +
                        '<name><given-names>Joseph</given-names><surname>Bloggs</surname><suffix>Capt.</suffix></name>' +
                        '<contrib-id contrib-id-type="orcid" authenticated="true">https://orcid.org/0000-0001-5225-4203</contrib-id>' +
                        '<email>example@example.com</email>' +
                        '<bio><p><bold>Joseph Bloggs</bold> is in the Department of Molecular Biology and Genetics, Cornell University, Ithaca, United States</p></bio>' +
                        '<xref ref-type="author-notes" rid="con1"/>' +
                        '</contrib>',
                );

                expect(xmlSerializer.serializeToString(authorNotesXml)).toBe(
                    '<author-notes><fn fn-type="COI-statement" id="con1"><p>Eats too many biscuits</p></fn></author-notes>',
                );
            });

            it('serializes a populated Person to XML with affiliation label mapped', () => {
                const person = new Person(mockJsonData);
                const affiliations = [new Affiliation({ _id: 'aff2', label: 'Some Affiliation Label' })];
                const xmlDoc = parseXML(
                    `<article><article-meta> <author-notes></author-notes> </article-meta></article>`,
                );
                const authorNotesXml = xmlDoc.querySelector('author-notes')!;

                expect(xmlSerializer.serializeToString(person.toXml(authorNotesXml, affiliations))).toBe(
                    '<contrib contrib-type="author" corresp="yes">' +
                        '<name><given-names>Joseph</given-names><surname>Bloggs</surname><suffix>Capt.</suffix></name>' +
                        '<contrib-id contrib-id-type="orcid" authenticated="true">https://orcid.org/0000-0001-5225-4203</contrib-id>' +
                        '<email>example@example.com</email>' +
                        '<bio><p><bold>Joseph Bloggs</bold> is in the Department of Molecular Biology and Genetics, Cornell University, Ithaca, United States</p></bio>' +
                        '<xref rid="aff1" ref-type="aff">Some Affiliation Label</xref>' +
                        '<xref ref-type="author-notes" rid="con1"/>' +
                        '</contrib>',
                );

                expect(xmlSerializer.serializeToString(authorNotesXml)).toBe(
                    '<author-notes>' +
                        '<fn fn-type="COI-statement" id="con1"><p>No competing interests declared</p></fn>' +
                        '</author-notes>',
                );
            });
        });
    });

    describe('creates authors state', () => {
        it('creates an empty authors state', () => {
            expect(createAuthorsState([])).toEqual([]);
        });

        it('creates an empty authors state without notes', () => {
            const author1Xml = parseXML(mockXmlData).querySelector('contrib')!;

            const author2Xml = parseXML(`<contrib corresp="yes">
        <name><surname>Bloggs</surname><given-names>Joseph</given-names></name>
        <contrib-id authenticated="true" contrib-id-type="orcid">https://orcid.org/0000-0001-5225-4203</contrib-id>
        <email>example@example.com</email>
        <xref ref-type="aff" rid="aff2">2</xref>
      </contrib>`).querySelector('contrib')!;

            const state = createAuthorsState([author1Xml, author2Xml]);
            expect(state.length).toBe(2);
            expect(state[0]).toStrictEqual(
                expect.objectContaining({
                    _id: 'unique_id',
                    firstName: 'Fred',
                    lastName: 'Atherden',
                    isAuthenticated: true,
                    orcid: '0000-0002-6048-1470',
                    email: 'fatherden@elifesciences.org',
                    isCorrespondingAuthor: true,
                    affiliations: ['aff2', 'aff3'],
                }),
            );

            expect(state[1]).toStrictEqual(
                expect.objectContaining({
                    _id: 'unique_id',
                    firstName: 'Joseph',
                    lastName: 'Bloggs',
                    isAuthenticated: true,
                    orcid: '0000-0001-5225-4203',
                    email: 'example@example.com',
                    isCorrespondingAuthor: true,
                    affiliations: ['aff2'],
                }),
            );
        });

        it('creates an empty authors state with notes', () => {
            const author1Xml = parseXML(mockXmlData).querySelector('contrib')!;

            const competingInterestRef = author1Xml.ownerDocument.createElement('xref');
            competingInterestRef.setAttribute('ref-type', 'author-notes');
            competingInterestRef.setAttribute('rid', 'con1');
            author1Xml.appendChild(competingInterestRef);

            const author2Xml = parseXML(`<contrib corresp="yes">
        <name><surname>Bloggs</surname><given-names>Joseph</given-names></name>
        <contrib-id authenticated="true" contrib-id-type="orcid">https://orcid.org/0000-0001-5225-4203</contrib-id>
        <email>example@example.com</email>
        <xref ref-type="aff" rid="aff2">2</xref>
      </contrib>`).querySelector('contrib')!;
            author2Xml.setAttribute('id', 'author-3889');

            const notesXml = parseXML(authorNotesXml).querySelector('author-notes')!;

            const state = createAuthorsState([author1Xml, author2Xml], notesXml);
            expect(state.length).toBe(2);
            expect(state[0]).toStrictEqual(
                expect.objectContaining({
                    _id: 'unique_id',
                    firstName: 'Fred',
                    lastName: 'Atherden',
                    suffix: 'Capt.',
                    isAuthenticated: true,
                    hasCompetingInterest: true,
                    competingInterestStatement: 'Is an employee of eLife. No other competing interests exist',
                    orcid: '0000-0002-6048-1470',
                    email: 'fatherden@elifesciences.org',
                    isCorrespondingAuthor: true,
                    affiliations: ['aff2', 'aff3'],
                }),
            );

            expect(state[1]).toStrictEqual(
                expect.objectContaining({
                    _id: 'unique_id',
                    firstName: 'Joseph',
                    lastName: 'Bloggs',
                    isAuthenticated: true,
                    hasCompetingInterest: false,
                    competingInterestStatement: '',
                    orcid: '0000-0001-5225-4203',
                    email: 'example@example.com',
                    isCorrespondingAuthor: true,
                    affiliations: ['aff2'],
                }),
            );
        });
    });

    describe('Serialization to XML', () => {
        const xmlSerializer = new xmldom.XMLSerializer();

        it('serializes an empty Person object to XML', () => {
            const xmlDoc = parseXML('<article><article-meta></article-meta></article>');

            const manuscript = cloneManuscript(mockManuscript);
            manuscript.authors = [new Person()];
            serializeAuthors(xmlDoc, manuscript);
            expect(xmlSerializer.serializeToString(xmlDoc)).toBe(
                '<article>' +
                    '<article-meta>' +
                    '<contrib-group>' +
                    '<contrib contrib-type="author">' +
                    '<name/>' +
                    '<bio><p/></bio>' +
                    '<xref ref-type="author-notes" rid="con1"/>' +
                    '</contrib>' +
                    '</contrib-group>' +
                    '<author-notes>' +
                    '<fn fn-type="COI-statement" id="con1"><p>No competing interests declared</p></fn>' +
                    '</author-notes>' +
                    '</article-meta>' +
                    '</article>',
            );
        });

        it('serializes a Person object to XML', () => {
            const xmlDoc = parseXML('<article><article-meta><author-notes></author-notes></article-meta></article>');

            const manuscript = cloneManuscript(mockManuscript);
            manuscript.authors = [new Person(mockJsonData)];
            serializeAuthors(xmlDoc, manuscript);
            expect(xmlSerializer.serializeToString(xmlDoc)).toBe(
                '<article><article-meta>' +
                    '<author-notes><fn fn-type="COI-statement" id="con1"><p>No competing interests declared</p></fn></author-notes>' +
                    '<contrib-group>' +
                    '<contrib contrib-type="author" corresp="yes">' +
                    '<name><given-names>Joseph</given-names><surname>Bloggs</surname><suffix>Capt.</suffix></name>' +
                    '<contrib-id contrib-id-type="orcid" authenticated="true">https://orcid.org/0000-0001-5225-4203</contrib-id>' +
                    '<email>example@example.com</email>' +
                    '<bio><p><bold>Joseph Bloggs</bold> is in the Department of Molecular Biology and Genetics, Cornell University, Ithaca, United States</p></bio>' +
                    '<xref rid="aff1" ref-type="aff"/>' +
                    '<xref ref-type="author-notes" rid="con1"/>' +
                    '</contrib>' +
                    '</contrib-group></article-meta></article>',
            );
        });

        it('handles an empty authors list correctly', () => {
            const xmlDoc = parseXML('<article><article-meta></article-meta></article>');
            serializeAuthors(xmlDoc, mockManuscript);
            expect(xmlSerializer.serializeToString(xmlDoc)).toBe(
                '<article><article-meta><contrib-group/><author-notes/></article-meta></article>',
            );
        });
    });
});

function setNodeTextContent(xmlNode: Element, text: string) {
    clearNode(xmlNode);
    xmlNode.appendChild(xmlNode.ownerDocument.createTextNode(text));
}

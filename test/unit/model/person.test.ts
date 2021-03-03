import {cloneDeep} from "lodash";
import {EditorState} from "prosemirror-state";

import {createAuthorsState, Person} from "../../../src/model/person";
import {JSONObject} from "../../../src/model/types";
import {clearNode, parseXML} from "../../../src/xml-exporter/xml-utils";

jest.mock('uuid', () => ({
  v4: () => 'unique_id'
}));

const PERSON_JSON_DATA = {
  _id: 'author-3888',
  firstName: 'Siu Sylvia',
  lastName: 'Lee',
  isAuthenticated: true,
  orcid: '0000-0001-5225-4203',
  email: 'sylvia.lee@cornell.edu',
  bio: {
    doc: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {type: 'text', marks: [{type: 'bold'}], text: 'Siu Sylvia Lee'},
            {
              type: 'text',
              text:
                ' is in the Department of Molecular Biology and Genetics, Cornell University, Ithaca, United States'
            }
          ]
        }
      ]
    },
    selection: {type: 'text', anchor: 1, head: 1}
  },
  isCorrespondingAuthor: true,
  affiliations: ['aff2']
} as JSONObject;

const PERSON_XML_DATA = `
  <contrib corresp="yes">
    <name><surname>Atherden</surname><given-names>Fred</given-names><suffix>Capt.</suffix></name>
    <contrib-id authenticated="true" contrib-id-type="orcid">https://orcid.org/0000-0002-6048-1470</contrib-id>
    <email>fatherden@elifesciences.org</email>
    <bio><p><bold>Jeanine Smith III</bold> is in the Department, University, City, Country</p></bio>
    <xref ref-type="aff" rid="aff2">2</xref>
    <xref ref-type="aff" rid="aff3">3</xref>
  </contrib>
`;

const AUTHOR_NOTES_XML = `<author-notes>
    <fn fn-type="COI-statement" id="con1">
      <p>Is an employee of eLife. No other competing interests exist</p>
    </fn>
  </author-notes>`;

describe('Person class', () => {

  describe('constructor', function () {
    it('creates a blank Person instance', () => {
      const author = new Person();
      expect(author).toStrictEqual(expect.objectContaining({
        _id: 'unique_id',
        firstName: '',
        lastName: '',
        suffix: '',
        isAuthenticated: false,
        orcid: '',
        email: '',
        isCorrespondingAuthor: false,
        affiliations: [],
      }));

      expect(author.bio).toBeInstanceOf(EditorState);
      expect(author.bio!.doc.textContent).toBe('');
    });
    describe('Person instance from JSON', () => {
      it('creates author from JSON', () => {
        const author = new Person(PERSON_JSON_DATA);
        expect(author).toStrictEqual(expect.objectContaining({
          _id: 'author-3888',
          firstName: 'Siu Sylvia',
          lastName: 'Lee',
          isAuthenticated: true,
          orcid: '0000-0001-5225-4203',
          email: 'sylvia.lee@cornell.edu',
          isCorrespondingAuthor: true,
          affiliations: ['aff2']
        }));

        expect(author.bio!.doc.textContent).toBe('Siu Sylvia Lee is in the Department of Molecular Biology and Genetics, Cornell University, Ithaca, United States')
      });

      it('creates author from JSON and assigns a unique ID if JSON does not have any', () => {
        const jsonData = cloneDeep(PERSON_JSON_DATA);
        jsonData._id = undefined;
        const author = new Person(jsonData);
        expect(author).toStrictEqual(expect.objectContaining({
          _id: 'unique_id',
          firstName: 'Siu Sylvia',
          lastName: 'Lee',
          isAuthenticated: true,
          orcid: '0000-0001-5225-4203',
          email: 'sylvia.lee@cornell.edu',
          isCorrespondingAuthor: true,
          affiliations: ['aff2']
        }));

        expect(author.bio!.doc.textContent).toBe('Siu Sylvia Lee is in the Department of Molecular Biology and Genetics, Cornell University, Ithaca, United States')
      });

      it('ignores non-array values of affiliations field ', () => {
        const author = new Person({affiliations: {testKey: 'testValue'}});
        expect(author).toStrictEqual(expect.objectContaining({
          _id: 'unique_id',
          firstName: '',
          lastName: '',
          isAuthenticated: false,
          orcid: '',
          email: '',
          isCorrespondingAuthor: false,
          affiliations: []
        }));

        expect(author.bio!.doc.textContent).toBe('')
      });
    });

    describe('Person instance from XML', () => {
      it('creates author from XML', () => {

        const authorXml = parseXML(PERSON_XML_DATA);

        const author = new Person(authorXml.querySelector('contrib')!);
        expect(author).toStrictEqual(expect.objectContaining({
          _id: 'unique_id',
          firstName: 'Fred',
          lastName: 'Atherden',
          isAuthenticated: true,
          orcid: '0000-0002-6048-1470',
          email: 'fatherden@elifesciences.org',
          isCorrespondingAuthor: true,
          affiliations: ['aff2', 'aff3']
        }));

        expect(author.bio!.doc.textContent).toBe('Jeanine Smith III is in the Department, University, City, Country')
      });

      it('correctly assigns the authenticated flag attribute from XML', () => {
        const authorXml = parseXML(PERSON_XML_DATA).querySelector('contrib')!;

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
        const authorXml = parseXML(PERSON_XML_DATA).querySelector('contrib')!;

        expect(new Person(authorXml).orcid).toBe('0000-0002-6048-1470');

        setNodeTextContent(
          authorXml.querySelector('contrib-id')!,
          'https://www.google.com/search?q=codswallop'
        );
        expect(new Person(authorXml).orcid).toBe('');

        setNodeTextContent(authorXml.querySelector('contrib-id')!, '');
        expect(new Person(authorXml).orcid).toBe('');

        const orcidEl = authorXml.querySelector('contrib-id');
        orcidEl!.parentNode!.removeChild(orcidEl!);
        expect(new Person(authorXml).orcid).toBe('');
      });

      it('correctly assigns corresponding author flag from XML', () => {
        const authorXml = parseXML(PERSON_XML_DATA).querySelector('contrib')!;

        expect(new Person(authorXml).isCorrespondingAuthor).toBe(true);

        authorXml.setAttribute('corresp', 'yas');
        expect(new Person(authorXml).isCorrespondingAuthor).toBe(false);

        authorXml.removeAttribute('corresp');
        expect(new Person(authorXml).isCorrespondingAuthor).toBe(false);
      });

      it('correctly parses bio from XML', () => {
        const authorXml = parseXML(PERSON_XML_DATA).querySelector('contrib')!;

        expect(new Person(authorXml).bio!.doc.textContent)
          .toBe('Jeanine Smith III is in the Department, University, City, Country');

        const bioEl = authorXml.querySelector('bio');
        bioEl!.parentNode!.removeChild(bioEl!);
        expect(new Person(authorXml).bio!.doc.textContent).toBe('');
      });

      it('correctly parses linked affiliations from XML', () => {
        const authorXml = parseXML(PERSON_XML_DATA).querySelector('contrib')!;

        const linkedAffiliations = authorXml.querySelectorAll('xref[ref-type="aff"]');
        expect(new Person(authorXml).affiliations).toEqual(['aff2', 'aff3']);

        authorXml.removeChild(linkedAffiliations[0]);
        expect(new Person(authorXml).affiliations).toEqual(['aff3']);

        authorXml.removeChild(linkedAffiliations[1]);
        expect(new Person(authorXml).affiliations).toEqual([]);
      });
    });

    describe('creates author with competing interests', () => {
      it('creates an author with competing interests', () => {
        const notesXml = parseXML(AUTHOR_NOTES_XML).querySelector('author-notes')!;
        const authorXml = parseXML(PERSON_XML_DATA).querySelector('contrib')!;

        const author1 = new Person(authorXml, notesXml);
        expect(author1.hasCompetingInterest).toBe(false);
        expect(author1.competingInterestStatement).toBe('');

        const competingInterestRef = authorXml.ownerDocument.createElement('xref');
        competingInterestRef.setAttribute('ref-type', 'fn');
        competingInterestRef.setAttribute('rid', 'con1');
        authorXml.appendChild(competingInterestRef);

        const author2 = new Person(authorXml, notesXml);
        expect(author2.hasCompetingInterest).toBe(true);
        expect(author2.competingInterestStatement).toBe('Is an employee of eLife. No other competing interests exist');
      });
    });
  });

  describe('creates authors state', () => {
    it('creates an empty authors state', () => {
      expect(createAuthorsState([])).toEqual([]);
    });

    it('creates an empty authors state without notes', () => {
      const author1Xml = parseXML(PERSON_XML_DATA).querySelector('contrib')!;
      author1Xml.setAttribute('id', 'author-3888');

      const author2Xml = parseXML(`<contrib corresp="yes">
        <name><surname>Lee</surname><given-names>Siu Sylvia</given-names></name>
        <contrib-id authenticated="true" contrib-id-type="orcid">https://orcid.org0000-0001-5225-4203</contrib-id>
        <email>sylvia.lee@cornell.edu</email>
        <xref ref-type="aff" rid="aff2">2</xref>
      </contrib>`).querySelector('contrib')!;
      author2Xml.setAttribute('id', 'author-3889');

      const state = createAuthorsState([author1Xml, author2Xml]);
      expect(state.length).toBe(2);
      expect(state[0]).toStrictEqual(expect.objectContaining({
        _id: 'author-3888',
        firstName: 'Fred',
        lastName: 'Atherden',
        isAuthenticated: true,
        orcid: '0000-0002-6048-1470',
        email: 'fatherden@elifesciences.org',
        isCorrespondingAuthor: true,
        affiliations: ['aff2', 'aff3']
      }));

      expect(state[1]).toStrictEqual(expect.objectContaining({
        _id: 'author-3889',
        firstName: 'Siu Sylvia',
        lastName: 'Lee',
        isAuthenticated: true,
        orcid: '0000-0001-5225-4203',
        email: 'sylvia.lee@cornell.edu',
        isCorrespondingAuthor: true,
        affiliations: ['aff2']
      }));
    });

    it('creates an empty authors state with notes', () => {
      const author1Xml = parseXML(PERSON_XML_DATA).querySelector('contrib')!;
      author1Xml.setAttribute('id', 'author-3888');

      const competingInterestRef = author1Xml.ownerDocument.createElement('xref');
      competingInterestRef.setAttribute('ref-type', 'fn');
      competingInterestRef.setAttribute('rid', 'con1');
      author1Xml.appendChild(competingInterestRef);

      const author2Xml = parseXML(`<contrib corresp="yes">
        <name><surname>Lee</surname><given-names>Siu Sylvia</given-names></name>
        <contrib-id authenticated="true" contrib-id-type="orcid">https://orcid.org0000-0001-5225-4203</contrib-id>
        <email>sylvia.lee@cornell.edu</email>
        <xref ref-type="aff" rid="aff2">2</xref>
      </contrib>`).querySelector('contrib')!;
      author2Xml.setAttribute('id', 'author-3889');

      const notesXml = parseXML(AUTHOR_NOTES_XML).querySelector('author-notes')!;

      const state = createAuthorsState([author1Xml, author2Xml], notesXml);
      expect(state.length).toBe(2);
      expect(state[0]).toStrictEqual(expect.objectContaining({
        _id: 'author-3888',
        firstName: 'Fred',
        lastName: 'Atherden',
        suffix: "Capt.",
        isAuthenticated: true,
        hasCompetingInterest: true,
        competingInterestStatement: 'Is an employee of eLife. No other competing interests exist',
        orcid: '0000-0002-6048-1470',
        email: 'fatherden@elifesciences.org',
        isCorrespondingAuthor: true,
        affiliations: ['aff2', 'aff3']
      }));

      expect(state[1]).toStrictEqual(expect.objectContaining({
        _id: 'author-3889',
        firstName: 'Siu Sylvia',
        lastName: 'Lee',
        isAuthenticated: true,
        hasCompetingInterest: false,
        competingInterestStatement: '',
        orcid: '0000-0001-5225-4203',
        email: 'sylvia.lee@cornell.edu',
        isCorrespondingAuthor: true,
        affiliations: ['aff2']
      }));
    });
  });
});

function setNodeTextContent(xmlNode: Element, text: string) {
  clearNode(xmlNode);
  xmlNode.appendChild(xmlNode.ownerDocument.createTextNode(text));
}

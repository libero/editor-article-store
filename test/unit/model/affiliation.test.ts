/**
 * @jest-environment jsdom
 */
import {Affiliation, createAffiliationsState, serializeAffiliations} from '../../../src/model/affiliation';
import * as xmldom from "xmldom";
import {EditorState} from "prosemirror-state";
import {parseXML} from "../../../src/xml-exporter/xml-utils";
import {cloneManuscript} from "../../../src/model/changes.utils";
import {Manuscript} from "../../../src/model/manuscript";

jest.mock('uuid', () => ({
  v4: () => 'unique_id'
}));

const mockJSONData = {
  label: 'label',
  institution: {
    name: 'Tech Department, eLife Sciences'
  },
  address: {
    city: 'Cambridge'
  },
  country: 'United Kingdom'
};

const mockXMLData = document.createElement('aff');
mockXMLData.setAttribute("id", "aff1");
mockXMLData.innerHTML = `<label>label</label>
    <institution content-type="dept">Tech Department</institution>
    <institution>eLife Sciences</institution>
    <addr-line><named-content content-type="city">Cambridge</named-content></addr-line>
    <country>United Kingdom</country>`;

describe('Affiliation', () => {
  it('returns empty Affiliation when called with no data', () => {
    const affiliation = new Affiliation();
    expect(affiliation).toBeInstanceOf(Affiliation);
    expect(affiliation).toStrictEqual(expect.objectContaining({
      label: '',
      country: '',
      institution: { name: '' },
      address: { city: '' }
    }));
  });
  describe('fromJSON', () => {
    it('returns empty Affiliation when called with empty data object', () => {
      const affiliation = new Affiliation({});
      expect(affiliation).toBeInstanceOf(Affiliation);
      expect(affiliation).toStrictEqual(expect.objectContaining({
        label: '',
        country: '',
        institution: { name: '' },
        address: { city: '' }
      }));
    });
    it('creates an affiliation with specified data', () => {  
      const affiliation = new Affiliation(mockJSONData);
      expect(affiliation).toBeInstanceOf(Affiliation);
      expect(affiliation.id).toBeDefined();
      expect(affiliation).toStrictEqual(expect.objectContaining(mockJSONData));
    });
  
    it('creates an affiliation with specified data and ID', () => {
      const affiliation = new Affiliation({...mockJSONData, _id: 'SOME_ID' });
      expect(affiliation).toBeInstanceOf(Affiliation);
      expect(affiliation.id).toBe('SOME_ID');
      expect(affiliation).toStrictEqual(expect.objectContaining(mockJSONData));
    });
  });
  describe('fromXML', () => {
    it('returns empty Affiliation when called with empty aff xml fragment', () => {
      const affiliation = new Affiliation(document.createElement('aff'));
      expect(affiliation).toBeInstanceOf(Affiliation);
      expect(affiliation).toStrictEqual(expect.objectContaining({
        label: '',
        country: '',
        institution: { name: '' },
        address: { city: '' }
      }));
    });
    it('creates an affiliation from a complete xml fragment', () => {
      const affiliation = new Affiliation(mockXMLData);
      expect(affiliation).toBeInstanceOf(Affiliation);
      expect(affiliation.id).toBe('aff1');
      expect(affiliation).toStrictEqual(expect.objectContaining(mockJSONData));
    });
  });
});

describe('createAffiliationsState', () => {
  it('returns empty array when passed an empty array', () => {
    expect(createAffiliationsState([])).toStrictEqual([]);
  });
  it('returns an Affiliation instance for each affiliation xml element', () => {
    const xmlWrapper = document.createElement('div');
    xmlWrapper.innerHTML = `<aff id="aff1">
        <label>label</label>
        <institution content-type="dept">Tech Department</institution>
        <institution>eLife Sciences</institution>
        <addr-line><named-content content-type="city">Cambridge</named-content></addr-line>
        <country>United Kingdom</country>
      </aff>
      <aff id="aff2">
        <label>2</label>
        <institution content-type="dept">Department</institution>
        <institution>University</institution>
        <addr-line><named-content content-type="city">City</named-content></addr-line>
        <country>Country</country>
      </aff>`;

    const affiliations = createAffiliationsState(Array.from(xmlWrapper.querySelectorAll('aff')));
    expect(affiliations).toHaveLength(2);
    expect(affiliations[0]).toBeInstanceOf(Affiliation);
    expect(affiliations[1]).toBeInstanceOf(Affiliation);
    expect(affiliations).toContainEqual(expect.objectContaining({
      _id: 'aff1',
      label: 'label',
      institution: {
        name: 'Tech Department, eLife Sciences'
      },
      address: {
        city: 'Cambridge'
      },
      country: 'United Kingdom'
    }));
    expect(affiliations).toContainEqual(expect.objectContaining({
      _id: 'aff2',
      label: '2',
      institution: {
        name: 'Department, University'
      },
      address: {
        city: 'City'
      },
      country: 'Country'
    }));
  })
});

describe('Serialize to XML', () => {
  const xmlSerializer = new xmldom.XMLSerializer();

  const mockManuscript: Manuscript = {
    authors: [],
    journalMeta: { publisherName: 'foo', issn: 'bar'},
    title: new EditorState(),
    abstract: new EditorState(),
    impactStatement: new EditorState(),
    body: new EditorState(),
    acknowledgements: new EditorState(),
    relatedArticles: [],
    affiliations: []
  };

  it('serializes an empty Affiliation to XML', () => {
    const xmlDoc = parseXML('<article><article-meta><contrib-group/></article-meta></article>');
    const manuscript = cloneManuscript(mockManuscript);
    manuscript.affiliations = [new Affiliation()];

    serializeAffiliations(xmlDoc, manuscript);

    expect(xmlSerializer.serializeToString(xmlDoc)).toBe('<article><article-meta>' +
      '<contrib-group>' +
        '<aff id="unique_id">' +
        '<label></label>' +
        '<institution></institution>' +
        '<addr-line><named-content content-type="city"></named-content></addr-line>' +
        '<country></country>' +
      '</aff>' +
      '</contrib-group>' +
      '</article-meta>' +
      '</article>');
  });

  it('serializes an Affiliation to XML', () => {
    const xmlDoc = parseXML('<article><article-meta><contrib-group/></article-meta></article>');
    const manuscript = cloneManuscript(mockManuscript);
    manuscript.affiliations = [new Affiliation(mockJSONData)];

    serializeAffiliations(xmlDoc, manuscript);

    expect(xmlSerializer.serializeToString(xmlDoc)).toBe('<article><article-meta>' +
      '<contrib-group>' +
        '<aff id="unique_id">' +
        '<label>label</label>' +
        '<institution>Tech Department, eLife Sciences</institution>' +
        '<addr-line><named-content content-type="city">Cambridge</named-content></addr-line>' +
        '<country>United Kingdom</country>' +
      '</aff>' +
      '</contrib-group>' +
      '</article-meta>' +
      '</article>');
  });

  it('handles an empty affiliations list', () => {
    const xmlDoc = parseXML('<article><article-meta><contrib-group/></article-meta></article>');
    const manuscript = cloneManuscript(mockManuscript);

    serializeAffiliations(xmlDoc, manuscript);

    expect(xmlSerializer.serializeToString(xmlDoc)).toBe('<article><article-meta>' +
      '<contrib-group/>' +
      '</article-meta>' +
      '</article>');
  })
});

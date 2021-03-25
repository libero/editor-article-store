import { JournalReference } from '../../../../src/model/reference/JournalReference';
import { parseXML } from '../../../../src/xml-exporter/xml-utils';
import * as xmldom from "xmldom";

jest.mock('uuid', () => ({
  v4: () => 'unique_id'
}));

const emptyJournalRefJSON = {
  "doi": "",
  "elocationId": "",
  "firstPage": "",
  "inPress": false,
  "lastPage": "",
  "pmid": "",
  "volume": "",
  "year": "",
};

const populatedJournalRefJSON = {
  "doi": "DOI",
  "elocationId": "elocationId",
  "firstPage": "firstPage",
  "inPress": true,
  "lastPage": "lastPage",
  "pmid": "pmid",
  "volume": "volume",
  "year": "year",
};

describe('JournalReference', () => {
  it('creates a blank JournalReference when passed no constructor args', () => {
    const journalReference = new JournalReference();
    expect(journalReference).toEqual(expect.objectContaining(emptyJournalRefJSON));
    expect(journalReference.articleTitle.doc.textContent).toBe("");
    expect(journalReference.source.doc.textContent).toBe("");
    expect(journalReference.id).toBe("unique_id");
  });
  describe('fromJSON', () => {
    it('returns empty JournalReference when called with empty data object', () => {
      const journalReference = new JournalReference({});
      expect(journalReference).toEqual(expect.objectContaining(emptyJournalRefJSON));
      expect(journalReference.articleTitle.doc.textContent).toBe("");
      expect(journalReference.source.doc.textContent).toBe("");
      expect(journalReference.id).toBe("unique_id");
    });
    it('returns JournalReference when called with populated data object ', () => {
      const journalReference = new JournalReference({ ...populatedJournalRefJSON,
      "articleTitle": {
        "doc": {
          "content": [
            {
              "text": "I am articleTitle text",
              "type": "text",
            },
          ],
          "type": "annotatedReferenceInfoDoc",
        },
        "selection": {
          "anchor": 0,
          "head": 0,
          "type": "text",
        },
      },
      "source": {
        "doc": {
          "content": [
            {
              "text": "I am source text",
              "type": "text",
            },
          ],
          "type": "annotatedReferenceInfoDoc",
        },
        "selection": {
          "anchor": 0,
          "head": 0,
          "type": "text",
        },
      }});
      expect(journalReference).toEqual(expect.objectContaining(populatedJournalRefJSON));
      expect(journalReference.articleTitle.doc.textContent).toBe("I am articleTitle text");
      expect(journalReference.source.doc.textContent).toBe("I am source text");
      expect(journalReference.id).toBe("unique_id");
    });

    it('creates an JournalReference with specified data and ID', () => {
      const affiliation = new JournalReference({...populatedJournalRefJSON, _id: 'SOME_ID' });
      expect(affiliation.id).toBe('SOME_ID');
      expect(affiliation).toStrictEqual(expect.objectContaining(populatedJournalRefJSON));
    });
  });
  describe('fromXml', () => {
    it('returns empty JournalReference when called with empty XML fragment', () => {
      const xmlWrapper = parseXML(`<article><element-citation /></article>`);
      const journalReference = new JournalReference(xmlWrapper.querySelector('element-citation') as Element);
      expect(journalReference).toEqual(expect.objectContaining(emptyJournalRefJSON));
      expect(journalReference.articleTitle.doc.textContent).toBe("");
      expect(journalReference.source.doc.textContent).toBe("");
      expect(journalReference.id).toBe("unique_id");
    });
    it('returns JournalReference when called with populated XML fragment', () => {
      const xmlWrapper = parseXML(`<article><element-citation><year iso-8601-date="2010">2010</year>
      <article-title>An article Title</article-title>
      <source>A source Title</source>
      <publisher-loc>London</publisher-loc>
      <publisher-name>Verso</publisher-name>
      <pub-id pub-id-type="isbn">978-1844674428</pub-id>
      <pub-id pub-id-type="doi">000001</pub-id>
      <elocation-id>elocation-id1111</elocation-id>
      <volume>354</volume>
      <fpage>59</fpage>
      <lpage>63</lpage>
      <pub-id pub-id-type="pmid">27846492</pub-id>
      <comment>In press</comment>
      </element-citation></article>`);

      const journalReference = new JournalReference(xmlWrapper.querySelector('element-citation') as Element);
      expect(journalReference).toEqual(expect.objectContaining({
        "doi": "000001",
        "elocationId": "elocation-id1111",
        "firstPage": "59",
        "inPress": true,
        "lastPage": "63",
        "pmid": "27846492",
        "volume": "354",
        "year": "2010",
      }));

      expect(journalReference.articleTitle.doc.textContent).toBe("An article Title");
      expect(journalReference.source.doc.textContent).toBe("A source Title");
      expect(journalReference.id).toBe("unique_id");
    });
  });

  describe('toXml', () => {
    const xmlSerializer = new xmldom.XMLSerializer();

    it('should serialize an empty journal reference', () => {
      const reference = new JournalReference(emptyJournalRefJSON);
      const xmlString = xmlSerializer.serializeToString(reference.toXml());
      expect(xmlString)
        .toBe('<element-citation publication-type="journal"><elocation-id></elocation-id><fpage></fpage><lpage></lpage><year iso-8601-date=""></year><article-title/><source/><pub-id pub-id-type="doi"></pub-id><pub-id pub-id-type="pmid"></pub-id><volume></volume></element-citation>');
    });
    
    it('should serialize a populated journal reference', () => {
      const reference = new JournalReference({ ...populatedJournalRefJSON,
        "articleTitle": {
          "doc": {
            "content": [
              {
                "text": "I am articleTitle text",
                "type": "text",
              },
            ],
            "type": "annotatedReferenceInfoDoc",
          },
          "selection": {
            "anchor": 0,
            "head": 0,
            "type": "text",
          },
        },
        "source": {
          "doc": {
            "content": [
              {
                "text": "I am source text",
                "type": "text",
              },
            ],
            "type": "annotatedReferenceInfoDoc",
          },
          "selection": {
            "anchor": 0,
            "head": 0,
            "type": "text",
          },
        }});
      const xmlString = xmlSerializer.serializeToString(reference.toXml());
      expect(xmlString)
        .toBe('<element-citation publication-type="journal"><elocation-id>elocationId</elocation-id><fpage>firstPage</fpage><lpage>lastPage</lpage><year iso-8601-date="year">year</year><article-title>I am articleTitle text</article-title><source>I am source text</source><pub-id pub-id-type="doi">DOI</pub-id><pub-id pub-id-type="pmid">pmid</pub-id><volume>volume</volume><comment>In press</comment></element-citation>');
    });

    it('should exclude In press if flat is false' , () => {
      const reference = new JournalReference({ ...populatedJournalRefJSON, inPress: false });
      const xmlString = xmlSerializer.serializeToString(reference.toXml());
      expect(xmlString)
        .toBe('<element-citation publication-type="journal"><elocation-id>elocationId</elocation-id><fpage>firstPage</fpage><lpage>lastPage</lpage><year iso-8601-date="year">year</year><article-title/><source/><pub-id pub-id-type="doi">DOI</pub-id><pub-id pub-id-type="pmid">pmid</pub-id><volume>volume</volume></element-citation>');
    });
  });
});

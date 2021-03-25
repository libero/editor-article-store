import { BookReference } from '../../../../src/model/reference/BookReference';
import { parseXML } from '../../../../src/xml-exporter/xml-utils';
import * as xmldom from "xmldom";

jest.mock('uuid', () => ({
  v4: () => 'unique_id'
}));

const emptyBookRefJSON = {
  "doi": "",
  "edition": "",
  "editors": [],
  "elocationId": "",
  "firstPage": "",
  "inPress": false,
  "lastPage": "",
  "pmid": "",
  "publisherLocation": "",
  "publisherName": "",
  "volume": "",
  "year": "",
};

const populatedBookRefJSON = {
  "doi": "DOI",
  "edition": "edition",
  "editors": [{
    "firstName": 'DJ',
    "lastName": 'Katz'
  }],
  "elocationId": "elocationId",
  "firstPage": "firstPage",
  "inPress": true,
  "lastPage": "lastPage",
  "pmid": "pmid",
  "publisherLocation": "publisherLocation",
  "publisherName": "publisherName",
  "volume": "volume",
  "year": "year",
};

describe('BookReference', () => {
  it('creates a blank BookReference when passed no constructor args', () => {
    const bookRef = new BookReference();
    expect(bookRef).toEqual(expect.objectContaining(emptyBookRefJSON));
    expect(bookRef.chapterTitle.doc.textContent).toBe("");
    expect(bookRef.source.doc.textContent).toBe("");
    expect(bookRef.id).toBe("unique_id");
  });
  describe('fromJSON', () => {
    it('returns empty BookReference when called with empty data object', () => {
      const bookRef = new BookReference({});
      expect(bookRef).toEqual(expect.objectContaining(emptyBookRefJSON));
      expect(bookRef.chapterTitle.doc.textContent).toBe("");
      expect(bookRef.source.doc.textContent).toBe("");
      expect(bookRef.id).toBe("unique_id");
    });
    it('returns BookReference when called with populated data object ', () => {
      const bookRef = new BookReference({ ...populatedBookRefJSON,   
      "chapterTitle": {
        "doc": {
          "content": [
            {
              "text": "I am chapterTitle text",
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
      expect(bookRef).toEqual(expect.objectContaining(populatedBookRefJSON));
      expect(bookRef.chapterTitle.doc.textContent).toBe("I am chapterTitle text");
      expect(bookRef.source.doc.textContent).toBe("I am source text");
      expect(bookRef.id).toBe("unique_id");
    });

    it('creates an BookReference with specified data and ID', () => {
      const bookRef = new BookReference({...populatedBookRefJSON, _id: 'SOME_ID' });
      expect(bookRef.id).toBe('SOME_ID');
      expect(bookRef).toStrictEqual(expect.objectContaining(populatedBookRefJSON));
    });
  });
  describe('fromXml', () => {
    it('returns empty BookReference when called with empty XML fragment', () => {
      const xmlWrapper = parseXML(`<article><element-citation /></article>`);
      const bookRef = new BookReference(xmlWrapper.querySelector('element-citation') as Element);
      expect(bookRef).toEqual(expect.objectContaining(emptyBookRefJSON));
      expect(bookRef.chapterTitle.doc.textContent).toBe("");
      expect(bookRef.source.doc.textContent).toBe("");
      expect(bookRef.id).toBe("unique_id");
    });
    it('returns BookReference when called with populated XML fragment', () => {
      const xmlWrapper = parseXML(`<article><element-citation><year iso-8601-date="2010">2010</year>
      <chapter-title>A chapter Title</chapter-title>
      <source>A source Title</source>
      <edition>4th Edition</edition>
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
      <person-group person-group-type="editor">
        <name>
          <surname>Miska</surname>
          <given-names>EA</given-names>
        </name>
        <name>
          <surname>Ferguson-Smith</surname>
          <given-names>AC</given-names>
        </name>
      </person-group></element-citation></article>`);

      const bookRef = new BookReference(xmlWrapper.querySelector('element-citation') as Element);
      expect(bookRef).toEqual(expect.objectContaining({
        "doi": "000001",
        "edition": "4th Edition",
        "editors": [{"firstName": "EA", "lastName": "Miska"}, {"firstName": "AC", "lastName": "Ferguson-Smith"}],
        "elocationId": "elocation-id1111",
        "firstPage": "59",
        "inPress": true,
        "lastPage": "63",
        "pmid": "27846492",
        "publisherLocation": "London",
        "publisherName": "Verso",
        "volume": "354",
        "year": "2010",
      }));

      expect(bookRef.chapterTitle.doc.textContent).toBe("A chapter Title");
      expect(bookRef.source.doc.textContent).toBe("A source Title");
      expect(bookRef.id).toBe("unique_id");
    });
  });

  describe('toXml', () => {
    const xmlSerializer = new xmldom.XMLSerializer();

    it('should serialize an empty data reference', () => {
      const reference = new BookReference(emptyBookRefJSON);
      const xmlString = xmlSerializer.serializeToString(reference.toXml());
      expect(xmlString)
        .toBe('<element-citation publication-type="book"><edition></edition><person-group person-group-type="editor"/><elocation-id></elocation-id><fpage></fpage><lpage></lpage><year iso-8601-date=""></year><chapter-title/><source/><pub-id pub-id-type="doi"></pub-id><pub-id pub-id-type="pmid"></pub-id><publisher-name></publisher-name><publisher-loc></publisher-loc><volume></volume></element-citation>');
    });

    it('should serialize a populated data reference', () => {
      const reference = new BookReference({ ...populatedBookRefJSON,
        "chapterTitle": {
          "doc": {
            "content": [
              {
                "text": "I am chapterTitle text",
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
        .toBe('<element-citation publication-type="book"><edition>edition</edition><person-group person-group-type="editor"><name><given-names>DJ</given-names><surname>Katz</surname></name></person-group><elocation-id>elocationId</elocation-id><fpage>firstPage</fpage><lpage>lastPage</lpage><year iso-8601-date="year">year</year><chapter-title>I am chapterTitle text</chapter-title><source>I am source text</source><pub-id pub-id-type="doi">DOI</pub-id><pub-id pub-id-type="pmid">pmid</pub-id><publisher-name>publisherName</publisher-name><publisher-loc>publisherLocation</publisher-loc><volume>volume</volume></element-citation>');
    });
  });
});

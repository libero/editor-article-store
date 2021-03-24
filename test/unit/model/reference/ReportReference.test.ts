import {ReportReference} from '../../../../src/model/reference/ReportReference';
import {parseXML} from '../../../../src/xml-exporter/xml-utils';
import * as xmldom from "xmldom";

jest.mock('uuid', () => ({
  v4: () => 'unique_id'
}));

const emptyReportRefJSON = {
  "year": "",
  "publisherLocation": "",
  "publisherName": "",
  "pmid": "",
  "volume": "",
  "isbn": "",
  "doi": "",
  "extLink": "",
};

const populatedReportRefJSON = {
  "year": "year",
  "publisherLocation": "publisherLocation",
  "publisherName": "publisherName",
  "pmid": "pmid",
  "volume": "volume",
  "isbn": "isbn",
  "doi": "DOI",
  "extLink": "extLink"
};

describe('ReportReference', () => {
  it('creates a blank ReportReference when passed no constructor args', () => {
    const reportReference = new ReportReference();
    expect(reportReference).toEqual(expect.objectContaining(emptyReportRefJSON));
    expect(reportReference.source.doc.textContent).toBe("");
    expect(reportReference.id).toBe("unique_id");
  });
  describe('fromJSON', () => {
    it('returns empty ReportReference when called with empty data object', () => {
      const reportReference = new ReportReference({});
      expect(reportReference).toEqual(expect.objectContaining(emptyReportRefJSON));
      expect(reportReference.source.doc.textContent).toBe("");
      expect(reportReference.id).toBe("unique_id");
    });
    it('returns ReportReference when called with populated data object ', () => {
      const reportReference = new ReportReference({ ...populatedReportRefJSON,
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
      expect(reportReference).toEqual(expect.objectContaining(populatedReportRefJSON));
      expect(reportReference.source.doc.textContent).toBe("I am source text");
      expect(reportReference.id).toBe("unique_id");
    });

    it('creates an ReportReference with specified data and ID', () => {
      const affiliation = new ReportReference({...populatedReportRefJSON, _id: 'SOME_ID' });
      expect(affiliation.id).toBe('SOME_ID');
      expect(affiliation).toStrictEqual(expect.objectContaining(populatedReportRefJSON));
    });
  });
  describe('fromXml', () => {
    it('returns empty ReportReference when called with empty XML fragment', () => {
      const xmlWrapper = parseXML(`<article><element-citation /></article>`);
      const reportReference = new ReportReference(xmlWrapper.querySelector('element-citation') as Element);
      expect(reportReference).toEqual(expect.objectContaining(emptyReportRefJSON));
      expect(reportReference.source.doc.textContent).toBe("");
      expect(reportReference.id).toBe("unique_id");
    });
    it('returns ReportReference when called with populated XML fragment', () => {
      const xmlWrapper = parseXML(`<article><element-citation>
        <year iso-8601-date="2010">2010</year>
        <source>A source Title</source>
        <publisher-loc>London</publisher-loc>
        <publisher-name>Verso</publisher-name>
        <ext-link>ExtLink</ext-link>
        <pub-id pub-id-type="isbn">978-1844674428</pub-id>
        <pub-id pub-id-type="pmid">27846492</pub-id>
        <pub-id pub-id-type="doi">000001</pub-id>
        <volume>354</volume>
      </element-citation></article>`);

      const reportReference = new ReportReference(xmlWrapper.querySelector('element-citation') as Element);
      expect(reportReference).toEqual(expect.objectContaining({
        "year": "2010",
        "doi": "000001",
        "publisherLocation": "London",
        "publisherName": "Verso",
        "pmid": "27846492",
        "isbn": "978-1844674428",
        "extLink": "ExtLink",
        "volume": "354",
      }));
      expect(reportReference.source.doc.textContent).toBe("A source Title");
      expect(reportReference.id).toBe("unique_id");
    });
  });

  describe('toXml', () => {
    const xmlSerializer = new xmldom.XMLSerializer();

    it('should serialize an empty report reference', () => {
      const reference = new ReportReference(emptyReportRefJSON);
      const xmlString = xmlSerializer.serializeToString(reference.toXml());
      expect(xmlString)
        .toBe('<element-citation publication-type="report"><year iso-8601-date=""></year><ext-link ext-link-type="uri" xlink:href=""></ext-link><source/><publisher-name></publisher-name><publisher-loc></publisher-loc><volume></volume><pub-id pub-id-type="doi"></pub-id><pub-id pub-id-type="pmid"></pub-id><pub-id pub-id-type="isbn"></pub-id></element-citation>');
    });

    it('should serialize a populated report reference', () => {
      const reference = new ReportReference({ ...populatedReportRefJSON,
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
        .toBe('<element-citation publication-type="report"><year iso-8601-date="year">year</year><ext-link ext-link-type="uri" xlink:href="extLink">extLink</ext-link><source>I am source text</source><publisher-name>publisherName</publisher-name><publisher-loc>publisherLocation</publisher-loc><volume>volume</volume><pub-id pub-id-type="doi">DOI</pub-id><pub-id pub-id-type="pmid">pmid</pub-id><pub-id pub-id-type="isbn">isbn</pub-id></element-citation>');
    });
  })
});

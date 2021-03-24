import {SoftwareReference} from '../../../../src/model/reference/SoftwareReference';
import {parseXML} from '../../../../src/xml-exporter/xml-utils';
import * as xmldom from "xmldom";

jest.mock('uuid', () => ({
  v4: () => 'unique_id'
}));

const emptySoftwareRefJSON = {
  "doi": "",
  "publisherLocation": "",
  "publisherName": "",
  "version": "",
  "extLink": "",
  "year": "",
};

const populatedSoftwareRefJSON = {
  "doi": "doi",
  "publisherLocation": "publisherLocation",
  "publisherName": "publisherName",
  "version": "version",
  "extLink": "extLink",
  "year": "year"
};

describe('SoftwareReference', () => {
  it('creates a blank SoftwareReference when passed no constructor args', () => {
    const softwareReference = new SoftwareReference();
    expect(softwareReference).toEqual(expect.objectContaining(emptySoftwareRefJSON));
    expect(softwareReference.articleTitle.doc.textContent).toBe("");
    expect(softwareReference.source.doc.textContent).toBe("");
    expect(softwareReference.id).toBe("unique_id");
  });
  describe('fromJSON', () => {
    it('returns empty SoftwareReference when called with empty data object', () => {
      const softwareReference = new SoftwareReference({});
      expect(softwareReference).toEqual(expect.objectContaining(emptySoftwareRefJSON));
      expect(softwareReference.articleTitle.doc.textContent).toBe("");
      expect(softwareReference.source.doc.textContent).toBe("");
      expect(softwareReference.id).toBe("unique_id");
    });
    it('returns SoftwareReference when called with populated data object ', () => {
      const softwareReference = new SoftwareReference({
        ...populatedSoftwareRefJSON,
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
        }
      });
      expect(softwareReference).toEqual(expect.objectContaining(populatedSoftwareRefJSON));
      expect(softwareReference.articleTitle.doc.textContent).toBe("I am articleTitle text");
      expect(softwareReference.source.doc.textContent).toBe("I am source text");
      expect(softwareReference.id).toBe("unique_id");
    });

    it('creates an SoftwareReference with specified data and ID', () => {
      const softwareReference = new SoftwareReference({...populatedSoftwareRefJSON, _id: 'SOME_ID'});
      expect(softwareReference.id).toBe('SOME_ID');
      expect(softwareReference).toStrictEqual(expect.objectContaining(populatedSoftwareRefJSON));
    });
  });
  describe('fromXml', () => {
    it('returns empty SoftwareReference when called with empty XML fragment', () => {
      const xmlWrapper = parseXML(`<article><element-citation /></article>`);
      const softwareReference = new SoftwareReference(xmlWrapper.querySelector('element-citation') as Element);
      expect(softwareReference).toEqual(expect.objectContaining(emptySoftwareRefJSON));
      expect(softwareReference.articleTitle.doc.textContent).toBe("");
      expect(softwareReference.source.doc.textContent).toBe("");
      expect(softwareReference.id).toBe("unique_id");
    });
    it('returns SoftwareReference when called with populated XML fragment', () => {
      const xmlWrapper = parseXML(`<article><element-citation>
          <year iso-8601-date="2019">2019</year>
          <article-title>An articleTitle</article-title>
          <source>A source Title</source>
          <version designator="3e48e64">3e48e64</version>
          <pub-id pub-id-type="doi">10.7554/eLife.00067</pub-id>
          <publisher-name>GitHub</publisher-name>
          <publisher-loc>Github Land</publisher-loc>
          <ext-link ext-link-type="uri">https://github.com/danilinares/2018LinaresAguilarLopezmoliner</ext-link>
        </element-citation></article>`);

      const softwareReference = new SoftwareReference(xmlWrapper.querySelector('element-citation') as Element);
      expect(softwareReference).toEqual(expect.objectContaining({
        "doi": "10.7554/eLife.00067",
        "year": "2019",
        "publisherLocation": "Github Land",
        "publisherName": "GitHub",
        "version": "3e48e64",
        "extLink": "https://github.com/danilinares/2018LinaresAguilarLopezmoliner"
      }));
      expect(softwareReference.articleTitle.doc.textContent).toBe("An articleTitle" +
        "");
      expect(softwareReference.source.doc.textContent).toBe("A source Title");
      expect(softwareReference.id).toBe("unique_id");
    });
  });

  describe('toXml', () => {
    const xmlSerializer = new xmldom.XMLSerializer();

    it('should serialize an empty software reference', () => {
      const reference = new SoftwareReference(emptySoftwareRefJSON);
      const xmlString = xmlSerializer.serializeToString(reference.toXml());
      expect(xmlString)
        .toBe('<element-citation publication-type="software"><year iso-8601-date=""></year><ext-link ext-link-type="uri" xlink:href=""></ext-link><article-title/><source/><pub-id pub-id-type="doi"></pub-id><version></version><publisher-name></publisher-name><publisher-loc></publisher-loc></element-citation>');
    });

    it('should serialize a populated software reference', () => {
      const reference = new SoftwareReference({ ...populatedSoftwareRefJSON,
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
        }
      });
      const xmlString = xmlSerializer.serializeToString(reference.toXml());
      expect(xmlString)
        .toBe('<element-citation publication-type="software"><year iso-8601-date="year">year</year><ext-link ext-link-type="uri" xlink:href="extLink">extLink</ext-link><article-title>I am articleTitle text</article-title><source>I am source text</source><pub-id pub-id-type="doi">doi</pub-id><version>version</version><publisher-name>publisherName</publisher-name><publisher-loc>publisherLocation</publisher-loc></element-citation>');
    });

  });
});

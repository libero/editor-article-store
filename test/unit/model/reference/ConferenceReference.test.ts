import { ConferenceReference } from '../../../../src/model/reference/ConferenceReference';
import { parseXML } from '../../../../src/xml-exporter/xml-utils';

jest.mock('uuid', () => ({
  v4: () => 'unique_id'
}));

const emptyConferenceRefJSON = {
  "year": "",
  "conferenceLocation": "",
  "conferenceDate": "",
  "volume": "",
  "extLink": "",
  "doi": "",
  "elocationId": "",
  "firstPage": "",
  "lastPage": "",
};

const populatedConferenceRefJSON = {
  "year": "year",
  "conferenceLocation": "conferenceLocation",
  "conferenceDate": "conferenceDate",
  "volume": "volume",
  "extLink": "extLink",
  "doi": "doi",
  "elocationId": "elocationId",
  "firstPage": "firstPage",
  "lastPage": "lastPage",
};

describe('ConferenceReference', () => {
  it('creates a blank ConferenceReference when passed no constructor args', () => {
    const conferenceReference = new ConferenceReference();
    expect(conferenceReference).toEqual(expect.objectContaining(emptyConferenceRefJSON));
    expect(conferenceReference.articleTitle.doc.textContent).toBe("");
    expect(conferenceReference.conferenceName.doc.textContent).toBe("");
    expect(conferenceReference.id).toBe("unique_id");
  });
  describe('fromJSON', () => {
    it('returns empty ConferenceReference when called with empty data object', () => {
      const conferenceReference = new ConferenceReference({});
      expect(conferenceReference).toEqual(expect.objectContaining(emptyConferenceRefJSON));
      expect(conferenceReference.articleTitle.doc.textContent).toBe("");
      expect(conferenceReference.conferenceName.doc.textContent).toBe("");
      expect(conferenceReference.id).toBe("unique_id");
    });
    it('returns ConferenceReference when called with populated data object ', () => {
      const conferenceReference = new ConferenceReference({ ...populatedConferenceRefJSON,
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
      "conferenceName": {
        "doc": {
          "content": [
            {
              "text": "I am conferenceName text",
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
      expect(conferenceReference).toEqual(expect.objectContaining(populatedConferenceRefJSON));
      expect(conferenceReference.articleTitle.doc.textContent).toBe("I am articleTitle text");
      expect(conferenceReference.conferenceName.doc.textContent).toBe("I am conferenceName text");
      expect(conferenceReference.id).toBe("unique_id");
    });

    it('creates an ConferenceReference with specified data and ID', () => {
      const conferenceReference = new ConferenceReference({...populatedConferenceRefJSON, _id: 'SOME_ID' });
      expect(conferenceReference.id).toBe('SOME_ID');
      expect(conferenceReference).toStrictEqual(expect.objectContaining(populatedConferenceRefJSON));
    });
  });
  describe('fromXml', () => {
    it('returns empty ConferenceReference when called with empty XML fragment', () => {
      const xmlWrapper = parseXML(`<article><element-citation /></article>`);
      const conferenceReference = new ConferenceReference(xmlWrapper.querySelector('element-citation') as Element);
      expect(conferenceReference).toEqual(expect.objectContaining(emptyConferenceRefJSON));
      expect(conferenceReference.articleTitle.doc.textContent).toBe("");
      expect(conferenceReference.conferenceName.doc.textContent).toBe("");
      expect(conferenceReference.id).toBe("unique_id");
    });
    it('returns ConferenceReference when called with populated XML fragment', () => {
      const xmlWrapper = parseXML(`<article><element-citation>
        <year iso-8601-date="2014">2014</year>
        <article-title>Automated hypothesis generation based on mining scientific literature</article-title>
        <conf-name>Proceedings of the 20th ACM SIGKDD International Conference on Knowledge Discovery and Data Mining</conf-name>
        <conf-loc>Salt Lake City, Utah</conf-loc>
        <conf-date>2020-10-10</conf-date>
        <ext-link ext-link-type="uri">https://dl.acm.org/citation.cfm?doid=2016741.2016785</ext-link>
        <fpage>1877</fpage>
        <elocation-id>e42697</elocation-id>
        <lpage>1886</lpage>
        <volume>3</volume>
        <pub-id pub-id-type="doi">10.1145/2623330.2623667</pub-id>
      </person-group></element-citation></article>`);

      const conferenceReference = new ConferenceReference(xmlWrapper.querySelector('element-citation') as Element);
      expect(conferenceReference).toEqual(expect.objectContaining({
        "year": "2014",
        "conferenceLocation": "Salt Lake City, Utah",
        "conferenceDate": "2020-10-10",
        "volume": "3",
        "extLink": "https://dl.acm.org/citation.cfm?doid=2016741.2016785",
        "doi": "10.1145/2623330.2623667",
        "elocationId": "e42697",
        "firstPage": "1877",
        "lastPage": "1886",
      }));

      expect(conferenceReference.articleTitle.doc.textContent).toBe("Automated hypothesis generation based on mining scientific literature");
      expect(conferenceReference.conferenceName.doc.textContent).toBe("Proceedings of the 20th ACM SIGKDD International Conference on Knowledge Discovery and Data Mining");
      expect(conferenceReference.id).toBe("unique_id");
    });
  });
});

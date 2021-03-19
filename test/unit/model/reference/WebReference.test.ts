import { WebReference } from '../../../../src/model/reference/WebReference';
import { parseXML } from '../../../../src/xml-exporter/xml-utils';
jest.mock('uuid', () => ({
  v4: () => 'unique_id'
}));

const emptyWebRefJSON = {
  year: '',
  dateInCitation: '',
  extLink: ''
};

const populatedWebRefJSON = {
  year: 'year',
  dateInCitation: 'dateInCitation',
  extLink: 'extLink'
};

describe('WebReference', () => {
  it('creates a blank WebReference when passed no constructor args', () => {
    const webReference = new WebReference();
    expect(webReference).toEqual(expect.objectContaining(emptyWebRefJSON));
    expect(webReference.articleTitle.doc.textContent).toBe("");
    expect(webReference.source.doc.textContent).toBe("");
    expect(webReference.id).toBe("unique_id");
  });
  describe('fromJSON', () => {
    it('returns empty WebReference when called with empty data object', () => {
      const webReference = new WebReference({});
      expect(webReference).toEqual(expect.objectContaining(emptyWebRefJSON));
      expect(webReference.articleTitle.doc.textContent).toBe("");
      expect(webReference.source.doc.textContent).toBe("");
      expect(webReference.id).toBe("unique_id");
    });
    it('returns WebReference when called with populated data object ', () => {
      const webReference = new WebReference({ ...populatedWebRefJSON,
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
      expect(webReference).toEqual(expect.objectContaining(populatedWebRefJSON));
      expect(webReference.articleTitle.doc.textContent).toBe("I am articleTitle text");
      expect(webReference.source.doc.textContent).toBe("I am source text");
      expect(webReference.id).toBe("unique_id");
    });

    it('creates an WebReference with specified data and ID', () => {
      const webReference = new WebReference({...populatedWebRefJSON, _id: 'SOME_ID' });
      expect(webReference.id).toBe('SOME_ID');
      expect(webReference).toStrictEqual(expect.objectContaining(populatedWebRefJSON));
    });
  });
  describe('fromXml', () => {
    it('returns empty WebReference when called with empty XML fragment', () => {
      const xmlWrapper = parseXML(`<article><element-citation /></article>`);
      const webReference = new WebReference(xmlWrapper.querySelector('element-citation') as Element);
      expect(webReference).toEqual(expect.objectContaining(emptyWebRefJSON));
      expect(webReference.articleTitle.doc.textContent).toBe("");
      expect(webReference.source.doc.textContent).toBe("");
      expect(webReference.id).toBe("unique_id");
    });
    it('returns WebReference when called with populated XML fragment', () => {
      const xmlWrapper = parseXML(`<article><element-citation>
        <year iso-8601-date="1994">1994</year>
        <article-title>Solar System Live</article-title>
        <source>The Washington Post</source>
        <ext-link ext-link-type="uri" xlink:href="https://www.fourmilab.ch/solar/">https://www.fourmilab.ch/solar/</ext-link>
        <date-in-citation iso-8601-date="1995-09-10">September 10, 1995</date-in-citation>
      </element-citation></article>`);

      const webReference = new WebReference(xmlWrapper.querySelector('element-citation') as Element);
      expect(webReference).toEqual(expect.objectContaining({
        year: '1994',
        dateInCitation: '1995-09-10',
        extLink: 'https://www.fourmilab.ch/solar/'
      }));

      expect(webReference.articleTitle.doc.textContent).toBe("Solar System Live");
      expect(webReference.source.doc.textContent).toBe("The Washington Post");
      expect(webReference.id).toBe("unique_id");
    });
  });
});

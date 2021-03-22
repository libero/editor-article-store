import {PatentReference} from '../../../../src/model/reference/PatentReference';
import {parseXML} from '../../../../src/xml-exporter/xml-utils';

jest.mock('uuid', () => ({
  v4: () => 'unique_id'
}));

const emptyPatentRefJSON = {
  year: '',
  doi: '',
  patent: '',
  extLink: '',
  publisherName: '',
};

const populatedPatentRefJSON = {
  year: '2014',
  doi: '00000',
  patent: 'NM_009324.2',
  extLink: 'http://www.ncbi.nlm.nih.gov/nuccore/120407038',
  publisherName: 'Publisher name'
};

const populatedPatentRefXML = `<article><element-citation specific-use="analyzed">
  <year iso-8601-date="2014">2014</year>
  <article-title>Imidazopyridine Derivative</article-title>
  <source>World Intellectual Property Organization</source>
  <publisher-name>Publisher name</publisher-name>
  <patent country="Japan">NM_009324.2</patent>
  <pub-id pub-id-type="doi">00000</pub-id>
  <ext-link ext-link-type="uri">http://www.ncbi.nlm.nih.gov/nuccore/120407038</ext-link>
</element-citation></article>`;

describe('PatentReference', () => {
  it('creates a blank PatentReference when passed no constructor args', () => {
    const patentReference = new PatentReference();
    expect(patentReference).toEqual(expect.objectContaining(emptyPatentRefJSON));
    expect(patentReference.articleTitle.doc.textContent).toBe("");
    expect(patentReference.source.doc.textContent).toBe("");
    expect(patentReference.id).toBe("unique_id");
  });
  describe('fromJSON', () => {
    it('returns empty PatentReference when called with empty data object', () => {
      const patentReference = new PatentReference({});
      expect(patentReference).toEqual(expect.objectContaining(emptyPatentRefJSON));
      expect(patentReference.articleTitle.doc.textContent).toBe("");
      expect(patentReference.source.doc.textContent).toBe("");
      expect(patentReference.id).toBe("unique_id");
    });

    it('returns PatentReference when called with populated data object ', () => {
      const patentReference = new PatentReference({ ...populatedPatentRefJSON,
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
      expect(patentReference).toEqual(expect.objectContaining(populatedPatentRefJSON));
      expect(patentReference.articleTitle.doc.textContent).toBe("I am articleTitle text");
      expect(patentReference.source.doc.textContent).toBe("I am source text");
      expect(patentReference.id).toBe("unique_id");
    });

    it('creates an dataReference with specified data and ID', () => {
      const patentReference = new PatentReference({...populatedPatentRefJSON, _id: 'SOME_ID' });
      expect(patentReference.id).toBe('SOME_ID');
      expect(patentReference).toStrictEqual(expect.objectContaining(populatedPatentRefJSON));
    });
  });
  describe('fromXml', () => {
    it('returns empty dataReference when called with empty XML fragment', () => {
      const xmlWrapper = parseXML(`<article><element-citation /></article>`);
      const patentReference = new PatentReference(xmlWrapper.querySelector('element-citation') as Element);
      expect(patentReference).toEqual(expect.objectContaining(emptyPatentRefJSON));
      expect(patentReference.articleTitle.doc.textContent).toBe("");
      expect(patentReference.source.doc.textContent).toBe("");
      expect(patentReference.id).toBe("unique_id");
    });

    it('returns PatentReference when called with populated XML fragment', () => {
      const xmlWrapper = parseXML(populatedPatentRefXML);

      const patentReference = new PatentReference(xmlWrapper.querySelector('element-citation') as Element);
      expect(patentReference).toEqual(expect.objectContaining(populatedPatentRefJSON));
      expect(patentReference.articleTitle.doc.textContent).toBe("Imidazopyridine Derivative");
      expect(patentReference.source.doc.textContent).toBe("World Intellectual Property Organization");
      expect(patentReference.id).toBe("unique_id");
    });
  });
});

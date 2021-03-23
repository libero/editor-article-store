import { PreprintReference } from '../../../../src/model/reference/PreprintReference';
import { parseXML } from '../../../../src/xml-exporter/xml-utils';

jest.mock('uuid', () => ({
  v4: () => 'unique_id'
}));

const emptyPrepringRefJSON = {
  year: '',
  doi: '',
  extLink: '',
  pmid: '',
};

const populatedPreprintRefJSON = {
  year: '2014',
  doi: '00000',
  extLink: 'http://www.ncbi.nlm.nih.gov/nuccore/120407038',
  pmid: 'NM_009324'
};

const populatedDataRefXML = `<article><element-citation>
  <year iso-8601-date="2014">2014</year>
  <article-title>Mus musculus T-box 2 (Tbx2), mRNA</article-title>
  <source>NCBI Nucleotide</source>
  <pub-id pub-id-type="doi">00000</pub-id>
  <pub-id pub-id-type="pmid">NM_009324</pub-id>
  <ext-link ext-link-type="uri" xlink:href="http://www.ncbi.nlm.nih.gov/nuccore/120407038">http://www.ncbi.nlm.nih.gov/nuccore/120407038</ext-link>
</element-citation></article>`;

describe('PreprintReference', () => {
  it('creates a blank PreprintReference when passed no constructor args', () => {
    const preprintReference = new PreprintReference();
    expect(preprintReference).toEqual(expect.objectContaining(emptyPrepringRefJSON));
    expect(preprintReference.articleTitle.doc.textContent).toBe("");
    expect(preprintReference.source.doc.textContent).toBe("");
    expect(preprintReference.id).toBe("unique_id");
  });
  describe('fromJSON', () => {
    it('returns empty PreprintReference when called with empty data object', () => {
      const dataRef = new PreprintReference({});
      expect(dataRef).toEqual(expect.objectContaining(emptyPrepringRefJSON));
      expect(dataRef.articleTitle.doc.textContent).toBe("");
      expect(dataRef.source.doc.textContent).toBe("");
      expect(dataRef.id).toBe("unique_id");
    });
    it('returns PreprintReference when called with populated data object ', () => {
      const dataRef = new PreprintReference({ ...populatedPreprintRefJSON,
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
      expect(dataRef).toEqual(expect.objectContaining(populatedPreprintRefJSON));
      expect(dataRef.articleTitle.doc.textContent).toBe("I am articleTitle text");
      expect(dataRef.source.doc.textContent).toBe("I am source text");
      expect(dataRef.id).toBe("unique_id");
    });

    it('creates an dataReference with specified data and ID', () => {
      const affiliation = new PreprintReference({...populatedPreprintRefJSON, _id: 'SOME_ID' });
      expect(affiliation.id).toBe('SOME_ID');
      expect(affiliation).toStrictEqual(expect.objectContaining(populatedPreprintRefJSON));
    });
  });
  describe('fromXml', () => {
    it('returns empty dataReference when called with empty XML fragment', () => {
      const xmlWrapper = parseXML(`<article><element-citation /></article>`);
      const dataRef = new PreprintReference(xmlWrapper.querySelector('element-citation') as Element);
      expect(dataRef).toEqual(expect.objectContaining(emptyPrepringRefJSON));
      expect(dataRef.articleTitle.doc.textContent).toBe("");
      expect(dataRef.source.doc.textContent).toBe("");
      expect(dataRef.id).toBe("unique_id");
    });

    it('returns PreprintReference when called with populated XML fragment', () => {
      const xmlWrapper = parseXML(populatedDataRefXML);

      const dataRef = new PreprintReference(xmlWrapper.querySelector('element-citation') as Element);
      expect(dataRef).toEqual(expect.objectContaining(populatedPreprintRefJSON));
      expect(dataRef.articleTitle.doc.textContent).toBe("Mus musculus T-box 2 (Tbx2), mRNA");
      expect(dataRef.source.doc.textContent).toBe("NCBI Nucleotide");
      expect(dataRef.id).toBe("unique_id");
    });
  });
})

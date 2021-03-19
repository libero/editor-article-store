import { DataReference } from '../../../../src/model/reference/DataReference';
import { parseXML } from '../../../../src/xml-exporter/xml-utils';

jest.mock('uuid', () => ({
  v4: () => 'unique_id'
}));

const emptyDataRefJSON = {
  year: '',
  doi: '',
  version: '',
  extLink: '',
  accessionId: '',
};

const populatedDataRefJSON = {
  year: '2014',
  doi: '00000',
  version: 'NM_009324.2',
  extLink: 'http://www.ncbi.nlm.nih.gov/nuccore/120407038',
  accessionId: 'NM_009324',
  specificUse: 'analyzed'
};

const populatedDataRefXML = `<article><element-citation specific-use="analyzed">
  <year iso-8601-date="2014">2014</year>
  <data-title>Mus musculus T-box 2 (Tbx2), mRNA</data-title>
  <source>NCBI Nucleotide</source>
  <pub-id pub-id-type="doi">00000</pub-id>
  <pub-id pub-id-type="accession" assigning-authority="NCBI" xlink:href="http://www.ncbi.nlm.nih.gov/nuccore/120407038">NM_009324</pub-id>
  <version designator="NM_009324.2">NM_009324.2</version>
</element-citation></article>`;
describe('DataReference', () => {
  it('creates a blank DataReference when passed no constructor args', () => {
    const bookRef = new DataReference();
    expect(bookRef).toEqual(expect.objectContaining(emptyDataRefJSON));
    expect(bookRef.dataTitle.doc.textContent).toBe("");
    expect(bookRef.source.doc.textContent).toBe("");
    expect(bookRef.id).toBe("unique_id");
  });
  describe('fromJSON', () => {
    it('returns empty DataReference when called with empty data object', () => {
      const bookRef = new DataReference({});
      expect(bookRef).toEqual(expect.objectContaining(emptyDataRefJSON));
      expect(bookRef.dataTitle.doc.textContent).toBe("");
      expect(bookRef.source.doc.textContent).toBe("");
      expect(bookRef.id).toBe("unique_id");
    });
    it('returns DataReference when called with populated data object ', () => {
      const bookRef = new DataReference({ ...populatedDataRefJSON,   
      "dataTitle": {
        "doc": {
          "content": [
            {
              "text": "I am dataTitle text",
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
      expect(bookRef).toEqual(expect.objectContaining(populatedDataRefJSON));
      expect(bookRef.dataTitle.doc.textContent).toBe("I am dataTitle text");
      expect(bookRef.source.doc.textContent).toBe("I am source text");
      expect(bookRef.id).toBe("unique_id");
    });

    it('creates an BookReference with specified data and ID', () => {
      const affiliation = new DataReference({...populatedDataRefJSON, _id: 'SOME_ID' });
      expect(affiliation.id).toBe('SOME_ID');
      expect(affiliation).toStrictEqual(expect.objectContaining(populatedDataRefJSON));
    });
  });
  describe('fromXml', () => {
    it('returns empty BookReference when called with empty XML fragment', () => {
      const xmlWrapper = parseXML(`<article><element-citation /></article>`);
      const bookRef = new DataReference(xmlWrapper.querySelector('element-citation') as Element);
      expect(bookRef).toEqual(expect.objectContaining(emptyDataRefJSON));
      expect(bookRef.dataTitle.doc.textContent).toBe("");
      expect(bookRef.source.doc.textContent).toBe("");
      expect(bookRef.id).toBe("unique_id");
    });
    it('returns DataReference when called with populated XML fragment', () => {
      const xmlWrapper = parseXML(populatedDataRefXML);

      const bookRef = new DataReference(xmlWrapper.querySelector('element-citation') as Element);
      expect(bookRef).toEqual(expect.objectContaining(populatedDataRefJSON));
      expect(bookRef.dataTitle.doc.textContent).toBe("Mus musculus T-box 2 (Tbx2), mRNA");
      expect(bookRef.source.doc.textContent).toBe("NCBI Nucleotide");
      expect(bookRef.id).toBe("unique_id");
    });
    it('has specificUse property only with given specific-use attrib values', () => {
      const xmlWrapper = parseXML(`<article><element-citation specific-use="analyzed"/></article>`);
      expect(new DataReference(xmlWrapper.querySelector('element-citation') as Element).specificUse).toBe('analyzed');
      const xmlWrapper2 = parseXML(`<article><element-citation specific-use="generated"/></article>`);
      expect(new DataReference(xmlWrapper2.querySelector('element-citation') as Element).specificUse).toBe('generated');
      const xmlWrapper3 = parseXML(`<article><element-citation specific-use="foo"/></article>`);
      expect(new DataReference(xmlWrapper3.querySelector('element-citation') as Element).specificUse).toBeUndefined();
    });

    it('sets extLink to ext-link content if defined', () => {
      const xmlWrapper = parseXML(`<article><element-citation>
        <ext-link>correctURL</ext-link>
        <pub-id pub-id-type="accession" xlink:href="wrongURL">00000</pub-id></element-citation>
      </article>`);
      expect(new DataReference(xmlWrapper.querySelector('element-citation') as Element).extLink).toBe('correctURL');
    });
    it('sets extLink to pub-id[pub-id-type="accession"] xlink:href content if ext-link not defined ', () => {
      const xmlWrapper = parseXML(`<article><element-citation><pub-id pub-id-type="accession" xlink:href="someURL">00000</pub-id></element-citation></article>`);
      expect(new DataReference(xmlWrapper.querySelector('element-citation') as Element).extLink).toBe('someURL');
    });
    it('leaves extLink empty if ext-link and pub-id[pub-id-type="accession"] xlink:href are not defined', () => {
      const xmlWrapper = parseXML(`<article><element-citation><pub-id pub-id-type="accession">00000</pub-id></element-citation></article>`);
      expect(new DataReference(xmlWrapper.querySelector('element-citation') as Element).extLink).toBe('');
    });
  });
})
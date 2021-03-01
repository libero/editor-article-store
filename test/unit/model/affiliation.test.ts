/**
 * @jest-environment jsdom
 */
import { Affiliation } from '../../../src/model/affiliation';

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
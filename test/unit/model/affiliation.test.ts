import { Affiliation } from '../../../src/model/affiliation';

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
    const mockData = {
      label: 'label',
      institution: {
        name: 'eLife'
      },
      address: {
        city: 'Cambridge'
      },
      country: 'UK'
    };
    it('creates an affiliation with specified data', () => {  
      const affiliation = new Affiliation(mockData);
      expect(affiliation).toBeInstanceOf(Affiliation);
      expect(affiliation.id).toBeDefined();
      expect(affiliation).toStrictEqual(expect.objectContaining(mockData));
    });
  
    it('creates an affiliation with specified data and ID', () => {
      const affiliation = new Affiliation({...mockData, _id: 'SOME_ID' });
      expect(affiliation).toBeInstanceOf(Affiliation);
      expect(affiliation.id).toBe('SOME_ID');
      expect(affiliation).toStrictEqual(expect.objectContaining(mockData));
    });
  });
});
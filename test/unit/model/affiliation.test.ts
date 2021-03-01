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
});
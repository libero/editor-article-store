/**
 * @jest-environment jsdom
 */
import { Keyword } from '../../../src/model/keyword';

jest.mock('uuid', () => ({
  v4: () => 'unique_id'
}));

describe('Keyword', () => {
  it('returns empty Keyword when called with no data', () => {
    const keyword = new Keyword();
    expect(JSON.stringify(keyword)).toMatch("{\"_id\":\"unique_id\",\"content\":{\"doc\":{\"type\":\"keyword\"},\"selection\":{\"type\":\"text\",\"anchor\":0,\"head\":0}}}");
  });
  describe('fromXml', () => {
    it('returns empty Keyword when called with empty aff xml fragment', () => {
      const keyword = new Keyword(document.createElement('kwd-group'));
      expect(keyword).toBeInstanceOf(Keyword);
      expect(JSON.stringify(keyword)).toMatch("{\"_id\":\"unique_id\",\"content\":{\"doc\":{\"type\":\"keyword\"},\"selection\":{\"type\":\"text\",\"anchor\":0,\"head\":0}}}");
    });
    it('creates a Keyword from a complete xml fragment', () => {
      const element = document.createElement('kwd')
      element.innerHTML = `A<sub>Poodle</sub><italic>Puppy</italic><sup>Dog</sup>`;
      const keyword = new Keyword(element);
      expect(keyword).toBeInstanceOf(Keyword);
      expect(JSON.stringify(keyword)).toMatch("{\"_id\":\"unique_id\",\"content\":{\"doc\":{\"type\":\"keyword\",\"content\":[{\"type\":\"text\",\"text\":\"A\"},{\"type\":\"text\",\"marks\":[{\"type\":\"subscript\"}],\"text\":\"Poodle\"},{\"type\":\"text\",\"marks\":[{\"type\":\"italic\"}],\"text\":\"Puppy\"},{\"type\":\"text\",\"marks\":[{\"type\":\"superscript\"}],\"text\":\"Dog\"}]},\"selection\":{\"type\":\"text\",\"anchor\":0,\"head\":0}}}");
    });
  });
});
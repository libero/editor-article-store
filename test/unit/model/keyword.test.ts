import { Keyword } from '../../../src/model/keyword';

jest.mock('uuid', () => ({
  v4: () => 'unique_id'
}));

describe('Keyword', () => {
  it('returns empty Keyword when called with no data', () => {
    const keyword = new Keyword();
    expect(JSON.stringify(keyword)).toMatch("{\"_id\":\"unique_id\",\"content\":{\"doc\":{\"type\":\"keyword\"},\"selection\":{\"type\":\"text\",\"anchor\":0,\"head\":0}}}");
  });
});
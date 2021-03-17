import {Reference} from "../../../src/model/reference";

jest.mock("uuid", () => ({
  v4: () => "unique_id",
}));

describe('Reference class', () => {
  it('should create a blank reference', () => {
    const ref = new Reference();

    expect(ref.authors).toEqual([]);
    expect(ref.type).toEqual('journal');
    expect(ref.id).toEqual('unique_id');
  });
});

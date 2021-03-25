import {Reference} from "../../../../src/model/reference";
import {JournalReference} from "../../../../src/model/reference/JournalReference";

jest.mock("uuid", () => ({
  v4: () => "unique_id",
}));

jest.mock('../../../../src/model/reference/JournalReference');

describe('Reference class', () => {
  it('should create a blank reference', () => {
    const ref = new Reference();

    expect(ref.authors).toEqual([]);
    expect(ref.type).toEqual('journal');
    expect(ref.id).toEqual('unique_id');
    expect(ref.referenceInfo).toBeInstanceOf(JournalReference);
    expect(JournalReference).toBeCalledWith(undefined);
  });
});

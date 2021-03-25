import {Reference} from "../../../../src/model/reference";
import {JournalReference} from "../../../../src/model/reference/JournalReference";

jest.mock("uuid", () => ({
  v4: () => "unique_id",
}));

describe('Reference class', () => {
  it('should create a blank reference', () => {
    const ref = new Reference();

    expect(ref.authors).toEqual([]);
    expect(ref.type).toEqual('journal');
    expect(ref.id).toEqual('unique_id');
    expect(ref.referenceInfo).toBeInstanceOf(JournalReference);
    expect((ref.referenceInfo as JournalReference).articleTitle.doc.textContent).toBe("");
    expect((ref.referenceInfo as JournalReference).source.doc.textContent).toBe("");
    expect((ref.referenceInfo as JournalReference).id).toBe("unique_id");
    expect((ref.referenceInfo as JournalReference)).toEqual(expect.objectContaining({
      "doi": "",
      "elocationId": "",
      "firstPage": "",
      "inPress": false,
      "lastPage": "",
      "pmid": "",
      "volume": "",
      "year": "",
    }));
  });
});

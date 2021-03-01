import {EditorState} from "prosemirror-state";
import {Person} from "../../../src/model/person";

jest.mock('uuid', () => ({
  v4: () => 'unique_id'
}));

describe('Person class', () => {

  describe('constructor', function () {
    it('creates a blank Person instance', () => {
      const author = new Person();
      expect(author).toStrictEqual(expect.objectContaining({
        _id: 'unique_id',
        firstName: '',
        lastName: '',
        suffix: '',
        isAuthenticated: false,
        orcid: '',
        email: '',
        isCorrespondingAuthor: false,
        affiliations: [],
      }));

      expect(author.bio).toBeInstanceOf(EditorState);
      expect(author.bio!.doc.textContent).toBe('');
    });
  });

});

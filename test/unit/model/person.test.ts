import {EditorState} from "prosemirror-state";
import {Person} from "../../../src/model/person";

describe('Person class', () => {

  describe('constructor', function () {
    it('creates a blank Person instance', () => {
      const author = new Person();
      expect(author).toEqual(expect.objectContaining({
        firstName: '',
        lastName: '',
        suffix: '',
        isAuthenticated: false,
        orcid: '',
        email: '',
        isCorrespondingAuthor: false,
        hasCompetingInterest: false,
        competingInterestStatement: true,
        affiliations: [],
      }));

      expect(author.bio).toBeInstanceOf(EditorState);
      expect(author.bio!.doc.textContent).toBe('');
    });
  });

});

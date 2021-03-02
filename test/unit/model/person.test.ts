import { cloneDeep } from "lodash";
import {EditorState} from "prosemirror-state";

import {Person} from "../../../src/model/person";
import {JSONObject} from "../../../src/model/types";

jest.mock('uuid', () => ({
  v4: () => 'unique_id'
}));

const PERSON_JSON_DATA = {
  _id: 'author-3888',
  firstName: 'Siu Sylvia',
  lastName: 'Lee',
  isAuthenticated: true,
  orcid: '0000-0001-5225-4203',
  email: 'sylvia.lee@cornell.edu',
  bio: {
    doc: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', marks: [{ type: 'bold' }], text: 'Siu Sylvia Lee' },
            {
              type: 'text',
              text:
                ' is in the Department of Molecular Biology and Genetics, Cornell University, Ithaca, United States'
            }
          ]
        }
      ]
    },
    selection: { type: 'text', anchor: 1, head: 1 }
  },
  isCorrespondingAuthor: true,
  affiliations: ['aff2']
} as JSONObject;

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

    it('creates author from JSON', () => {
      const author = new Person(PERSON_JSON_DATA);
      expect(author).toStrictEqual(expect.objectContaining({
        _id: 'author-3888',
        firstName: 'Siu Sylvia',
        lastName: 'Lee',
        isAuthenticated: true,
        orcid: '0000-0001-5225-4203',
        email: 'sylvia.lee@cornell.edu',
        isCorrespondingAuthor: true,
        affiliations: ['aff2']
      }));

      expect(author.bio!.doc.textContent).toBe('Siu Sylvia Lee is in the Department of Molecular Biology and Genetics, Cornell University, Ithaca, United States')
    });

    it('creates author from JSON and assigns a unique ID if JSON does not have any' , () => {
      const jsonData = cloneDeep(PERSON_JSON_DATA);
      jsonData._id = undefined;
      const author = new Person(jsonData);
      expect(author).toStrictEqual(expect.objectContaining({
        _id: 'unique_id',
        firstName: 'Siu Sylvia',
        lastName: 'Lee',
        isAuthenticated: true,
        orcid: '0000-0001-5225-4203',
        email: 'sylvia.lee@cornell.edu',
        isCorrespondingAuthor: true,
        affiliations: ['aff2']
      }));

      expect(author.bio!.doc.textContent).toBe('Siu Sylvia Lee is in the Department of Molecular Biology and Genetics, Cornell University, Ithaca, United States')
    });

    it('ignores non-array values of affiliations field ' , () => {
      const author = new Person({affiliations: {testKey: 'testValue'}});
      expect(author).toStrictEqual(expect.objectContaining({
        _id: 'unique_id',
        firstName: '',
        lastName: '',
        isAuthenticated: false,
        orcid: '',
        email: '',
        isCorrespondingAuthor: false,
        affiliations: []
      }));

      expect(author.bio!.doc.textContent).toBe('')
    });
  });
});

import { AddObjectChange } from '../../../../src/model/history/add-object-change'
import { BackmatterEntity } from '../../../../src/model/backmatter-entity';
import { Manuscript } from '../../../../src/model/manuscript';
import { get } from 'lodash';

class ExampleBackmatterClass extends BackmatterEntity {
  constructor() {
    super();
  }
  createBlank() {}
  fromJSON() {}
  fromXML() {}
}

describe('AddObjectChange', () => {
  describe('constructor', () => {
    it('does not throw when constructor is passed expected params', () => {
      expect(() => new AddObjectChange('somepath', new ExampleBackmatterClass(), 'someId')).not.toThrow();
    });
  });
  describe('fromJSON', () => {
    it('Returns AddObjectChange obj from passed JSON - relatedArticles', () => {
      const mockChangeJSON = {
          "type": "add-object",
          "timestamp": 1614097785693,
          "path": "relatedArticles",
          "idField": "id",
          "object": {
            "_id": "ad319b14-c312-4627-a5a1-d07a548a6e7e",
            "articleType": "article-reference",
            "href": "111111"
          } 
      };
      expect(() => AddObjectChange.fromJSON(mockChangeJSON)).not.toThrow()
      const addObjChange = AddObjectChange.fromJSON(mockChangeJSON);
      expect(addObjChange).toBeInstanceOf(AddObjectChange);
      expect(addObjChange.toJSON()).toEqual(mockChangeJSON);
    });
  });
  describe('toJSON', () => {
    it('returns expected JSON', () => {
      const addObjChange = new AddObjectChange('somepath', new ExampleBackmatterClass(), 'someId')
      const addObjJSON = addObjChange.toJSON();
      expect(addObjJSON).toEqual(expect.objectContaining({
        "idField": "someId",
        "path": "somepath",
        "type": "add-object"
      }));
      expect(addObjJSON.timestamp).toBeDefined();
      expect(addObjJSON.object).toBeDefined();
      expect(addObjJSON.object).toBeInstanceOf(ExampleBackmatterClass);
    });
  });
  describe('applyChange', () => {
    it('inserts a new object into Manuscript', () => {
      const insertedObject = new ExampleBackmatterClass()
      const addObjChange = new AddObjectChange('somepath', insertedObject, 'someId')
      const manuscript = {'somepath': [new ExampleBackmatterClass()]} as unknown as Manuscript;
      const newManuscript = addObjChange.applyChange(manuscript);
      expect(get(newManuscript, 'somepath.1')).toBe(insertedObject);
      expect(get(newManuscript, 'somepath.length')).toBe(2);
    });

    it('throws if path is not array', () => {
      const addObjChange = new AddObjectChange('somepath', new ExampleBackmatterClass(), 'someId')
      const manuscript = {'somepath': {}} as unknown as Manuscript;
      expect(() => addObjChange.applyChange(manuscript)).toThrow(new TypeError('Trying to make AddObject change on a non-array section'));
    });
  });
  describe('rollbackChange', () => {
    // TODO: update this when / if implimented
    it('returns Manuscript', () => {
      const addObjChange = new AddObjectChange('somepath', new ExampleBackmatterClass(), 'someId')
      const manuscript = {} as unknown as Manuscript;
      expect(addObjChange.rollbackChange(manuscript)).toEqual(manuscript);
    })
  });
  describe('isEmpty', () => {
    it('returns false', () => {
      const addObjChange = new AddObjectChange('somepath', new ExampleBackmatterClass(), 'someId')
      expect(addObjChange.isEmpty).toBe(false);
    });
  });
});

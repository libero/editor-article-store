import { DeleteObjectChange } from '../../../../src/model/history/delete-object-change'
import { BackmatterEntity } from '../../../../src/model/backmatter-entity';
import { Manuscript } from '../../../../src/model/manuscript';

class ExampleBackmatterClass extends BackmatterEntity {
  constructor() {
    super();
  }
  createBlank() {}
  fromJSON() {}
  fromXML() {}
}

describe('DeleteObjectChange', () => {
  describe('constructor', () => {
    it('does not throw when constructor is passed expected params', () => {
      expect(() => new DeleteObjectChange('somepath', new ExampleBackmatterClass(), 'someId')).not.toThrow();
    });
  });
  describe('fromJSON', () => {
    it('Returns DeleteObjectChange obj from passed JSON - relatedArticles', () => {
      const mockChangeJSON = {
          "type": "delete-object",
          "timestamp": 1614097785693,
          "path": "relatedArticles",
          "idField": "id",
          "object": {
            "_id": "ad319b14-c312-4627-a5a1-d07a548a6e7e",
            "articleType": "article-reference",
            "href": "111111"
          } 
      };
      expect(() => DeleteObjectChange.fromJSON(mockChangeJSON)).not.toThrow()
      const deleteObjChange = DeleteObjectChange.fromJSON(mockChangeJSON);
      expect(deleteObjChange).toBeInstanceOf(DeleteObjectChange);
      expect(deleteObjChange.toJSON()).toEqual(mockChangeJSON);
    });
  });
  describe('toJSON', () => {
    it('returns expected JSON', () => {
      const deleteObjChange = new DeleteObjectChange('somepath', new ExampleBackmatterClass(), 'someId')
      const deleteObjJSON = deleteObjChange.toJSON();
      expect(deleteObjJSON).toEqual(expect.objectContaining({
        "idField": "someId",
        "path": "somepath",
        "type": "delete-object"
      }));
      expect(deleteObjJSON.timestamp).toBeDefined();
      expect(deleteObjJSON.object).toBeDefined();
      expect(deleteObjJSON.object).toBeInstanceOf(ExampleBackmatterClass);
    });
  });
  describe('applyChange', () => {
    // TODO: update this when / if implimented
    it('returns Manuscript', () => {
      const deleteObjChange = new DeleteObjectChange('somepath', new ExampleBackmatterClass(), 'someId')
      const manuscript = {} as unknown as Manuscript;
      expect(deleteObjChange.applyChange(manuscript)).toEqual(manuscript);
    })
  });
  describe('rollbackChange', () => {
    // TODO: update this when / if implimented
    it('returns Manuscript', () => {
      const deleteObjChange = new DeleteObjectChange('somepath', new ExampleBackmatterClass(), 'someId')
      const manuscript = {} as unknown as Manuscript;
      expect(deleteObjChange.rollbackChange(manuscript)).toEqual(manuscript);
    })
  });
  describe('isEmpty', () => {
    // TODO: update this when / if implimented
    it('returns false', () => {
      const deleteObjChange = new DeleteObjectChange('somepath', new ExampleBackmatterClass(), 'someId')
      expect(deleteObjChange.isEmpty).toBe(false);
    });
  });
});
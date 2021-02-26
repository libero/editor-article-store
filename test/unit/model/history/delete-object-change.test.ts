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
    class SomeObjectClass extends ExampleBackmatterClass {
      public value1: string = '';
      public value2: string = '';
      constructor(val1: string, val2: string) {
        super();
        this.value1 = val1;
        this.value2 = val2;
      }
    }
    const aChange = new SomeObjectClass('foo', 'bar');
    it('can remove object from manuscript array value to make empty', () => {
      const deleteObjChange = new DeleteObjectChange('relatedArticles', aChange, 'value1')
      const manuscript = {
        relatedArticles: [aChange]
      } as unknown as Manuscript;
      expect(manuscript.relatedArticles).toHaveLength(1);
      const changedManuscript = deleteObjChange.applyChange(manuscript)
      expect(changedManuscript.relatedArticles).toHaveLength(0);
    });
    it('can remove object from a populated manuscript array value', () => {
      const bChange = new SomeObjectClass('x', 'y');
      const deleteObjChange = new DeleteObjectChange('relatedArticles', aChange, 'value1')
      const manuscript = {
        relatedArticles: [aChange, bChange]
      } as unknown as Manuscript;
      expect(manuscript.relatedArticles).toHaveLength(2);
      const changedManuscript = deleteObjChange.applyChange(manuscript)
      expect(changedManuscript.relatedArticles).toHaveLength(1);
      expect(changedManuscript.relatedArticles[0]).toEqual(bChange);
    });
    it('it returns manuscript in same state if delete object is not on manuscript property', () => {
      const bChange = new SomeObjectClass('x', 'y');
      const cChange = new SomeObjectClass('a', 'b');
      const deleteObjChange = new DeleteObjectChange('relatedArticles', aChange, 'value1')
      const manuscript = {
        relatedArticles: [bChange, cChange]
      } as unknown as Manuscript;
      expect(manuscript.relatedArticles).toHaveLength(2);
      const changedManuscript = deleteObjChange.applyChange(manuscript)
      expect(changedManuscript.relatedArticles).toHaveLength(2);
      expect(changedManuscript.relatedArticles).toContain(bChange);
      expect(changedManuscript.relatedArticles).toContain(cChange);
    });
    it('throws error if delete object is applied to a non-array manuscript property', () => {
      const deleteObjChange = new DeleteObjectChange('relatedArticles', aChange, 'value1')
      const manuscript = {
        relatedArticles: 'im a string'
      } as unknown as Manuscript;
      expect(() => deleteObjChange.applyChange(manuscript)).toThrow('Trying to make DeleteObject change on a non-array section');
    });
    it('throws error if delete object is applied to a non existant manuscript property', () => {
      const addObjChange = new DeleteObjectChange('relatedArticles', aChange, 'value1')
      const manuscript = {
      } as unknown as Manuscript;
      expect(() => addObjChange.applyChange(manuscript)).toThrow('Trying to make DeleteObject change on a non-array section');
    });
  });

  describe('isEmpty', () => {
    // TODO: update this when / if implimented
    it('returns false', () => {
      const deleteObjChange = new DeleteObjectChange('somepath', new ExampleBackmatterClass(), 'someId')
      expect(deleteObjChange.isEmpty).toBe(false);
    });
  });
});

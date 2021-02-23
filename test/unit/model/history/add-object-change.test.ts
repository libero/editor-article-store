import { AddObjectChange } from '../../../../src/model/history/add-object-change'
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

describe('AddObjectChange', () => {
  describe('constructor', () => {
    it('does not throw when constructor is passed expected params', () => {
      expect(() => new AddObjectChange('somepath', new ExampleBackmatterClass(), 'someId')).not.toThrow();
    });
  });
  describe('applyChange', () => {
    // TODO: update this when implimented
    it('returns Manuscript', () => {
      const addObjChange = new AddObjectChange('somepath', new ExampleBackmatterClass(), 'someId')
      const manuscript = {} as unknown as Manuscript;
      expect(addObjChange.applyChange(manuscript)).toEqual(manuscript);
    })
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
    // TODO: update this when / if implimented
    it('returns false', () => {
      const addObjChange = new AddObjectChange('somepath', new ExampleBackmatterClass(), 'someId')
      expect(addObjChange.isEmpty).toBe(false);
    });
  });
  describe('toJSON', () => {
    // TODO: update this when / if implimented
    it('returns empty object', () => {
      const addObjChange = new AddObjectChange('somepath', new ExampleBackmatterClass(), 'someId')
      expect(addObjChange.toJSON()).toStrictEqual({});
    });
  });
});
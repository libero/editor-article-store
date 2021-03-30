import {DOMImplementation} from "xmldom";
import { BackmatterEntity } from '../../../src/model/backmatter-entity';
class ExtendedBackmatterClass extends BackmatterEntity {
  constructor() {
    super();
  }
  createBlank = jest.fn();
  fromJSON = jest.fn();
  fromXML= jest.fn();
}

describe('BackmatterEntity', () => {
  it('can be extended from with expected functions implimented', () => {
    expect(() => new ExtendedBackmatterClass()).not.toThrow();
  });
  describe('id', () => {
    it('has an id property generated when instantiated', () => {
      const backmatterObj = new ExtendedBackmatterClass();
      expect(backmatterObj.id).toBeDefined();
      expect(typeof backmatterObj.id).toBe('string');
      expect(backmatterObj.id.length).toBeGreaterThan(0);
    });
  });
  describe('createEntity', () => {
    class ExposedCreateEntity extends ExtendedBackmatterClass {
      public exposedCreateEntity = this.createEntity;
    }
    it('doesn\'t throw if passed no params', () => {
      const backmatterObj = new ExposedCreateEntity();
      expect(() => backmatterObj.exposedCreateEntity()).not.toThrow();
    })

    it('calls internal createBlank if no data is passed', () => {
      const backmatterObj = new ExposedCreateEntity();
      expect(backmatterObj.createBlank).not.toHaveBeenCalled();
      backmatterObj.exposedCreateEntity()
      expect(backmatterObj.createBlank).toHaveBeenCalled();
    })
    it('calls internal fromXML if data passed is type Element', () => {
      const backmatterObj = new ExposedCreateEntity();
      expect(backmatterObj.fromXML).not.toHaveBeenCalled();
      const xmlDoc = new DOMImplementation().createDocument(null, null);
      const mockElement = xmlDoc.createElement("p");
      backmatterObj.exposedCreateEntity(mockElement);
      expect(backmatterObj.fromXML).toHaveBeenCalled();
      expect(backmatterObj.fromXML).toBeCalledWith(mockElement);
    });
    it('calls internal fromJSON if data passed is defined but not Element', () => {
      const backmatterObj = new ExposedCreateEntity();
      expect(backmatterObj.fromJSON).not.toHaveBeenCalled();
      const mockJSON = { foo: 'bar' };
      backmatterObj.exposedCreateEntity(mockJSON);
      expect(backmatterObj.fromJSON).toHaveBeenCalled();
      expect(backmatterObj.fromJSON).toBeCalledWith(mockJSON);
    });
  });
});

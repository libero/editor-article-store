import { Change } from './change';
import { Manuscript } from "../manuscript";
import { BackmatterEntity } from '../backmatter-entity';

export class AddObjectChange extends Change {

  constructor(private path: string, private object: BackmatterEntity, private idField: string) {
    super();
  }
  public applyChange(manuscript: Manuscript) {
    console.log('applyChange not implimented for AddObjectChange')
    return manuscript;
  }
  public rollbackChange(manuscript: Manuscript) {
    console.log('rollbackChange not implimented for AddObjectChange')
    return manuscript;
  }
  public get isEmpty() { 
    console.log('isEmpty not implimented for AddObjectChange')
    return false; 
  };
  public toJSON(){ 
    console.log('toJSON not implimented for AddObjectChange')
    return {} 
  };
}
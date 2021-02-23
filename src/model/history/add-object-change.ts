import { Change } from './change';
import { Manuscript } from "../manuscript";
import { JSONObject } from '../types';
import { BackmatterEntity } from '../backmatter-entity';
import { deserializeBackmatter } from '../changes.utils';

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
  static fromJSON(data: JSONObject): AddObjectChange {
    const change = new AddObjectChange(
      data.path as string,
      deserializeBackmatter(data.path as string, data.object as JSONObject),
      data.idField as string
    );
    change._timestamp = data.timestamp as number;
    return change;
  }
}
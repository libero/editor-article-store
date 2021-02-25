import { Change } from './change';
import { BackmatterEntity } from '../backmatter-entity';
import { Manuscript } from "../manuscript";
import { manuscriptEntityToJson, deserializeBackmatter } from '../changes.utils';
import { JSONObject } from '../types';

export class DeleteObjectChange extends Change {
  constructor(private path: string, private object: BackmatterEntity, private idField: string) {
    super();
  }
  public static fromJSON(data: JSONObject): DeleteObjectChange {
    const change = new DeleteObjectChange(
      data.path as string,
      deserializeBackmatter(data.path as string, data.object as JSONObject),
      data.idField as string
    );
    change._timestamp = data.timestamp as number;
    return change;
  }
  public toJSON(): JSONObject {
    return {
      type: 'delete-object',
      timestamp: this.timestamp,
      path: this.path,
      idField: this.idField,
      object: manuscriptEntityToJson(this.object)
    };
  }
  public applyChange(manuscript: Manuscript) {
    console.log('applyChange not implimented for AddObjectChange')
    return manuscript;
  }

  public get isEmpty() { 
    console.log('isEmpty not implimented for AddObjectChange')
    return false; 
  };
}

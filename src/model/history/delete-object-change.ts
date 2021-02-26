import { Change } from './change';
import { BackmatterEntity } from '../backmatter-entity';
import { Manuscript } from "../manuscript";
import { manuscriptEntityToJson, deserializeBackmatter, cloneManuscript } from '../changes.utils';
import { JSONObject } from '../types';
import { get, set } from 'lodash';

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
    const originalSection = get(manuscript, this.path);

    if (!Array.isArray(originalSection)) {
      throw new TypeError('Trying to make DeleteObject change on a non-array section');
    }
    const removedIndex = originalSection.findIndex((item) => item[this.idField] === get(this.object, this.idField));
    const updatedSection = [...originalSection];
    if (removedIndex > -1){
      updatedSection.splice(removedIndex, 1);
    }
    return set(cloneManuscript(manuscript), this.path, updatedSection);
  }

  public get isEmpty() { 
    console.log('isEmpty not implimented for AddObjectChange')
    return false; 
  };
}

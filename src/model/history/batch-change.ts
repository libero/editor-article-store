import { deserializeChanges } from "../changes.utils";
import {JSONObject, Manuscript} from "../manuscript";
import { Change } from "./change";

export class BatchChange extends Change {
  static fromJSON(data: JSONObject): BatchChange {
    const change = new BatchChange(deserializeChanges(data.changes as JSONObject[]).filter(Boolean) as Change[]);
    change._timestamp = data.timestamp as number;
    return change;
  }

  private changes: Change[];
  constructor(changes: Change[] = []) {
    super();
    this.changes = changes.filter((change) => !change.isEmpty);
  }

  get isEmpty(): boolean {
    return !Array.isArray(this.changes) || this.changes.length === 0;
  }

  applyChange(manuscript: Manuscript): Manuscript {
    return this.changes.reduce((acc: Manuscript, change: Change) => {
      return change.applyChange(acc);
    }, manuscript);
  }

  rollbackChange(manuscript: Manuscript): Manuscript {
    return this.changes.reduceRight((acc: Manuscript, change: Change) => {
      return change.rollbackChange(acc);
    }, manuscript);
  }

  toJSON(): JSONObject {
    return {
      type: 'batch',
      changes: this.changes.map((change) => change.toJSON()),
      timestamp: this.timestamp
    };
  }
}

import { EditorState, Transaction } from 'prosemirror-state';
import { Step } from 'prosemirror-transform';
import { get, set } from 'lodash';
import { Change } from './change';
import { Manuscript } from '../manuscript';
import {cloneManuscript} from "../changes.utils";
import {JSONObject} from "../types";

export class ProsemirrorChange extends Change {
  public static fromJSON(data: JSONObject): ProsemirrorChange {
    const change = new ProsemirrorChange(data.path as string, null);
    change.unserializedSteps = (data.transactionSteps as JSONObject[]) || [];
    change._timestamp = data.timestamp as number;
    return change;
  }

  private unserializedSteps: JSONObject[] = [];

  constructor(private path: string, private transaction: Transaction | null) {
    super();
  }

  get isEmpty(): boolean {
    return this.transaction ? !this.transaction.docChanged : this.unserializedSteps.length === 0;
  }

  applyChange(manuscript: Manuscript): Manuscript {
    const editorState = get(manuscript, this.path);
    if (!this.transaction) {
      // deserialized steps can only be turned into a transaction before applying to avoid applying mismatched
      // transactions. If we try to convert a chained series of transactions upon creating a Change all transactions
      // will refer to the same document and thus applying them one after another will cause an error because
      // transactions will be applied to mismatched documents. Each transaction produces a new document. Chained
      // transactions need to be created from corresponding documents.
      this.deserializeSteps(editorState);
    }
    return set(cloneManuscript(manuscript), this.path, editorState.apply(this.transaction));
  }

  toJSON(): JSONObject {
    return {
      type: 'prosemirror',
      timestamp: this.timestamp,
      path: this.path,
      transactionSteps: this.transaction ? this.transaction.steps.map((step) => step.toJSON()) : this.unserializedSteps
    };
  }

  private deserializeSteps(editorState: EditorState): void {
    this.transaction = editorState.tr;
    this.unserializedSteps.forEach((stepJson) => {
      this.transaction!.maybeStep(Step.fromJSON(editorState.schema, stepJson));
    });
  }
}

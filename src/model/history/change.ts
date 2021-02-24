import { Manuscript } from "../manuscript";
import {JSONObject} from "../types";

export abstract class Change {
  abstract applyChange(manuscript: Manuscript): Manuscript;
  abstract rollbackChange(manuscript: Manuscript): Manuscript;
  abstract get isEmpty(): boolean;
  abstract toJSON(): JSONObject;

  protected _timestamp: number;
  constructor() {
    this._timestamp = Date.now();
  }

  get timestamp(): number {
    return this._timestamp;
  }
}

import {BackmatterEntity} from "./backmatter-entity";
import {JSONObject} from "./types";

export type ReferenceType =
  | 'journal'
  | 'periodical'
  | 'book'
  | 'report'
  | 'data'
  | 'web'
  | 'preprint'
  | 'software'
  | 'confproc'
  | 'thesis'
  | 'patent';

export type ReferenceContributor =
  | {
  firstName: string;
  lastName: string;
}
  | {
  groupName: string;
};

export class Reference extends BackmatterEntity {

  authors: Array<ReferenceContributor> = [];
  // referenceInfo: ReferenceInfoType;

  public get type(): ReferenceType {
    return this._type;
  }
  private _type: ReferenceType = "journal";

  protected createBlank(): void {
    this._type = "journal";
    this.authors = [];
  }

  protected fromJSON(json: JSONObject): void {
    console.log('fromJSON is not implemented');
  }

  protected fromXML(xmlNode: Element): void {
    console.log('fromXML is not implemented');
  }

}

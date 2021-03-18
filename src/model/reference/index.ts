import {BackmatterEntity} from "../backmatter-entity";
import {JSONObject} from "../types";
import { ReferenceContributor, ReferenceType } from "./types";

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

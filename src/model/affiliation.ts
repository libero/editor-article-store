import { BackmatterEntity } from "./backmatter-entity";
import { JSONObject } from "./types";

export class Affiliation extends BackmatterEntity {
  label: string | undefined;
  institution: { name: string; } | undefined;
  address: { city: string; } | undefined;
  country: string | undefined;

  constructor(data?: JSONObject | Element) {
    super();
    this.createEntity(data);
  }

  protected createBlank(): void {
    this.label = '';
    this.country = '';
    this.institution = { name: '' };
    this.address = { city: '' };
  }

  protected fromXML(_xml: Element): void {}

  protected fromJSON(json: JSONObject): void {
    this._id = (json._id as string) || this.id;
    this.label = json.label as string;
    this.country = json.country as string;
    this.institution = json.institution as { name: string };
    this.address = json.address as { city: string };
  }
}
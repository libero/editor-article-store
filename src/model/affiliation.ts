import { BackmatterEntity } from "./backmatter-entity";
import { JSONObject } from "./types";
import { getTextContentFromPath } from "./utils";

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

  protected fromXML(xml: Element): void {
    this._id = xml.getAttribute('id') as string || this.id;
    this.label = getTextContentFromPath(xml, 'label') || '';
    this.institution = {
      name: [
        getTextContentFromPath(xml, 'institution[content-type="dept"]'),
        getTextContentFromPath(xml, 'institution:not([content-type])')
      ]
        .filter(Boolean)
        .join(', ')
    };

    this.address = {
      city: getTextContentFromPath(xml, 'addr-line named-content[content-type="city"]') || ''
    };
    this.country = getTextContentFromPath(xml, 'country') || '';
  }

  protected fromJSON(json: JSONObject): void {
    this._id = (json._id as string) || this.id;
    this.label = json.label as string || '';
    this.country = json.country as string || '';
    this.institution = json.institution as { name: string } || { name: '' };
    this.address = json.address as { city: string } || { city: '' };
  }
}
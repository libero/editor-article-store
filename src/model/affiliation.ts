import {BackmatterEntity} from "./backmatter-entity";
import {JSONObject} from "./types";
import {getTextContentFromPath} from "./utils";
import {Manuscript} from "./manuscript";
import {get} from "lodash";
import { DOMImplementation } from "xmldom";

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
    this.institution = {name: ''};
    this.address = {city: ''};
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
    this.institution = json.institution as { name: string } || {name: ''};
    this.address = json.address as { city: string } || {city: ''};
  }

  public toXml(): Element {
    const xmlDoc = new DOMImplementation().createDocument(null, null); 
    const affEl = xmlDoc.createElement('aff');
    affEl.setAttribute('id', this.id);
  
    const label = xmlDoc.createElement('label');
    label.appendChild(xmlDoc.createTextNode(this.label || ''));
    affEl.appendChild(label);
  
    const department = xmlDoc.createElement('institution');
    department.appendChild(xmlDoc.createTextNode(get(this, 'institution.name', '')));
    affEl.appendChild(department);
  
    const addressLine = xmlDoc.createElement('addr-line');
    const city = xmlDoc.createElement('named-content');
    city.setAttribute('content-type', 'city');
    city.appendChild(xmlDoc.createTextNode(this.address?.city || ''));
    addressLine.appendChild(city);
    affEl.appendChild(addressLine);
  
    const country = xmlDoc.createElement('country');
    country.appendChild(xmlDoc.createTextNode(this.country || ''));
    affEl.appendChild(country);
  
    return affEl;
  }
}

export function createAffiliationsState(affiliationsXml: Element[]): Affiliation[] {
  return affiliationsXml.map((xml) => new Affiliation(xml));
}

export function serializeAffiliations(xmlDoc: Document, manuscript: Manuscript) {
  let authorsGroup = xmlDoc.querySelector('article-meta > contrib-group');
  if (!authorsGroup) {
    authorsGroup = xmlDoc.createElement('contrib-group');
    xmlDoc.querySelector('article-meta')!.appendChild(authorsGroup);
  }

  manuscript.affiliations.forEach((affiliation) => {
    authorsGroup!.appendChild(affiliation.toXml());
  });
}

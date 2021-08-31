import { BackmatterEntity } from './backmatter-entity';
import { JSONObject } from './types';
import { getTextContentFromPath, removeEmptyNodes } from './utils';
import { Manuscript } from './manuscript';
import { get } from 'lodash';
import { DOMImplementation } from '@xmldom/xmldom';

export class Affiliation extends BackmatterEntity {
    label: string | undefined;
    institution: { name: string } | undefined;
    address: { city: string } | undefined;
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
        this._id = (xml.getAttribute('id') as string) || this.id;
        this.label = getTextContentFromPath(xml, 'label') || '';
        this.institution = {
            name: [
                getTextContentFromPath(xml, 'institution[content-type="dept"]'),
                getTextContentFromPath(xml, 'institution:not([content-type])'),
            ]
                .filter(Boolean)
                .join(', '),
        };

        this.address = {
            city: getTextContentFromPath(xml, 'city') || '',
        };
        this.country = getTextContentFromPath(xml, 'country') || '';
    }

    protected fromJSON(json: JSONObject): void {
        this._id = (json._id as string) || this.id;
        this.label = (json.label as string) || '';
        this.country = (json.country as string) || '';
        this.institution = (json.institution as { name: string }) || { name: '' };
        this.address = (json.address as { city: string }) || { city: '' };
    }

    public toXml(listIndex: number): Element {
        const xmlDoc = new DOMImplementation().createDocument(null, null);
        const affEl = xmlDoc.createElement('aff');
        affEl.setAttribute('id', `aff${listIndex}`);

        const label = xmlDoc.createElement('label');
        label.appendChild(xmlDoc.createTextNode(this.label || ''));
        affEl.appendChild(label);

        const department = xmlDoc.createElement('institution');
        department.appendChild(xmlDoc.createTextNode(get(this, 'institution.name', '')));
        affEl.appendChild(department);

        const city = xmlDoc.createElement('city');
        city.appendChild(xmlDoc.createTextNode(this.address?.city || ''));
        affEl.appendChild(city);

        const country = xmlDoc.createElement('country');
        country.appendChild(xmlDoc.createTextNode(this.country || ''));
        affEl.appendChild(country);

        return removeEmptyNodes(affEl);
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

    manuscript.affiliations.forEach((affiliation, index) => {
        authorsGroup!.appendChild(affiliation.toXml(index + 1));
    });
}

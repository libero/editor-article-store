import { EditorState } from 'prosemirror-state';
import { BackmatterEntity } from '../backmatter-entity';
import { JSONObject } from '../types';
import { getTextContentFromPath } from '../utils';
import { createReferenceAnnotatedValue, deserializeReferenceAnnotatedValue } from './reference.utils';
import { DOMImplementation } from 'xmldom';
import { serializeManuscriptSection } from '../../xml-exporter/manuscript-serializer';

export class DataReference extends BackmatterEntity {
    year!: string;
    dataTitle!: EditorState;
    source!: EditorState;
    doi!: string;
    version!: string;
    extLink!: string;
    accessionId!: string;
    specificUse?: string;

    constructor(data?: JSONObject | Element) {
        super();
        this.createEntity(data);
    }

    toXml(): Element {
        const xmlDoc = new DOMImplementation().createDocument(null, null);
        const xml = xmlDoc.createElement('element-citation');
        xml.setAttribute('publication-type', 'data');

        const year = xmlDoc.createElement('year');
        year.setAttribute('iso-8601-date', this.year);
        year.appendChild(xmlDoc.createTextNode(this.year));
        xml.appendChild(year);

        const extLink = xmlDoc.createElement('ext-link');
        extLink.setAttribute('ext-link-type', 'uri');
        extLink.setAttribute('xlink:href', this.extLink);
        extLink.appendChild(xmlDoc.createTextNode(this.extLink));
        xml.appendChild(extLink);

        const articleTitle = xmlDoc.createElement('data-title');
        articleTitle.appendChild(serializeManuscriptSection(this.dataTitle, xmlDoc));
        xml.appendChild(articleTitle);

        const source = xmlDoc.createElement('source');
        source.appendChild(serializeManuscriptSection(this.source, xmlDoc));
        xml.appendChild(source);

        const doi = xmlDoc.createElement('pub-id');
        doi.setAttribute('pub-id-type', 'doi');
        doi.setAttribute('xlink:href', this.doi);
        doi.appendChild(xmlDoc.createTextNode(this.doi));
        xml.appendChild(doi);

        const version = xmlDoc.createElement('version');
        version.appendChild(xmlDoc.createTextNode(this.version));
        xml.appendChild(version);

        if (this.accessionId) {
            const accession = xmlDoc.createElement('pub-id');
            accession.setAttribute('pub-id-type', 'accession');
            accession.appendChild(xmlDoc.createTextNode(this.accessionId));
            xml.appendChild(accession);
        }

        if (this.specificUse) {
            xml.setAttribute('specific-use', this.specificUse);
        }

        return xml;
    }

    protected fromJSON(json: JSONObject) {
        this._id = (json._id as string) || this._id;
        this.dataTitle = json.dataTitle
            ? deserializeReferenceAnnotatedValue(json.dataTitle as JSONObject)
            : createReferenceAnnotatedValue();
        this.year = (json.year as string) || '';
        this.doi = (json.doi as string) || '';
        this.extLink = (json.extLink as string) || '';
        this.accessionId = (json.accessionId as string) || '';
        this.specificUse = json.specificUse as string;
        this.version = (json.version as string) || '';
        this.source = json.source
            ? deserializeReferenceAnnotatedValue(json.source as JSONObject)
            : createReferenceAnnotatedValue();
    }

    protected fromXML(referenceXml: Element) {
        const accessionEl = referenceXml.querySelector('pub-id[pub-id-type="accession"]');
        const specificUse = referenceXml.getAttribute('specific-use');
        this.year = getTextContentFromPath(referenceXml, 'year') || '';
        this.source = createReferenceAnnotatedValue(referenceXml.querySelector('source'));
        this.dataTitle = createReferenceAnnotatedValue(referenceXml.querySelector('data-title'));
        this.doi = getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="doi"]') || '';
        this.accessionId = accessionEl?.textContent ? accessionEl.textContent : '';
        this.extLink =
            getTextContentFromPath(referenceXml, 'ext-link') ||
            (accessionEl?.getAttribute('xlink:href') ? (accessionEl?.getAttribute('xlink:href') as string) : '');
        this.version = getTextContentFromPath(referenceXml, 'version') || '';
        this.specificUse = ['generated', 'analyzed'].includes(specificUse as string)
            ? (specificUse as string)
            : undefined;
    }

    protected createBlank() {
        this.dataTitle = createReferenceAnnotatedValue();
        this.year = '';
        this.doi = '';
        this.extLink = '';
        this.accessionId = '';
        this.specificUse = undefined;
        this.version = '';
        this.source = createReferenceAnnotatedValue();
    }
}

import { EditorState } from 'prosemirror-state';
import { BackmatterEntity } from '../backmatter-entity';
import { JSONObject } from '../types';
import { getTextContentFromPath, removeEmptyNodes } from '../utils';
import { createReferenceAnnotatedValue, deserializeReferenceAnnotatedValue } from './reference.utils';
import { DOMImplementation } from 'xmldom';
import { serializeManuscriptSection } from '../../xml-exporter/manuscript-serializer';

export class SoftwareReference extends BackmatterEntity {
    year!: string;
    source!: EditorState;
    articleTitle!: EditorState;
    version!: string;
    publisherName!: string;
    publisherLocation!: string;
    extLink!: string;
    doi!: string;
    pmid!: string;

    constructor(data?: Element | JSONObject) {
        super();
        this.createEntity(data);
    }

    toXml(): Element {
        const xmlDoc = new DOMImplementation().createDocument(null, null);
        const xml = xmlDoc.createElement('element-citation');
        xml.setAttribute('publication-type', 'software');

        const year = xmlDoc.createElement('year');
        year.setAttribute('iso-8601-date', this.year);
        year.appendChild(xmlDoc.createTextNode(this.year));
        xml.appendChild(year);

        const extLink = xmlDoc.createElement('ext-link');
        extLink.setAttribute('ext-link-type', 'uri');
        extLink.setAttribute('xlink:href', this.extLink);
        extLink.appendChild(xmlDoc.createTextNode(this.extLink));
        xml.appendChild(extLink);

        const articleTitle = xmlDoc.createElement('article-title');
        articleTitle.appendChild(serializeManuscriptSection(this.articleTitle, xmlDoc));
        xml.appendChild(articleTitle);

        const source = xmlDoc.createElement('source');
        source.appendChild(serializeManuscriptSection(this.source, xmlDoc));
        xml.appendChild(source);

        const doi = xmlDoc.createElement('pub-id');
        doi.setAttribute('pub-id-type', 'doi');
        doi.appendChild(xmlDoc.createTextNode(this.doi));
        xml.appendChild(doi);

        const version = xmlDoc.createElement('version');
        version.appendChild(xmlDoc.createTextNode(this.version));
        xml.appendChild(version);

        const publisherName = xmlDoc.createElement('publisher-name');
        publisherName.appendChild(xmlDoc.createTextNode(this.publisherName));
        xml.appendChild(publisherName);

        const publisherLoc = xmlDoc.createElement('publisher-loc');
        publisherLoc.appendChild(xmlDoc.createTextNode(this.publisherLocation));
        xml.appendChild(publisherLoc);

        const pmid = xmlDoc.createElement('pub-id');
        pmid.setAttribute('pub-id-type', 'pmid');
        pmid.appendChild(xmlDoc.createTextNode(this.pmid));
        xml.appendChild(pmid);

        return removeEmptyNodes(xml);
    }

    protected fromJSON(json: JSONObject): void {
        this._id = (json._id as string) || this._id;
        this.year = (json.year as string) || '';
        this.doi = (json.doi as string) || '';
        this.pmid = (json.pmid as string) || '';
        this.version = (json.version as string) || '';
        this.publisherLocation = (json.publisherLocation as string) || '';
        this.publisherName = (json.publisherName as string) || '';
        this.articleTitle = json.articleTitle
            ? deserializeReferenceAnnotatedValue(json.articleTitle as JSONObject)
            : createReferenceAnnotatedValue();
        this.extLink = (json.extLink as string) || '';
        this.source = json.source
            ? deserializeReferenceAnnotatedValue(json.source as JSONObject)
            : createReferenceAnnotatedValue();
    }

    protected fromXML(referenceXml: Element): void {
        this.year = getTextContentFromPath(referenceXml, 'year');
        this.articleTitle = createReferenceAnnotatedValue(referenceXml.querySelector('article-title'));
        this.source = createReferenceAnnotatedValue(referenceXml.querySelector('source'));
        this.version = getTextContentFromPath(referenceXml, 'version') || '';
        this.publisherLocation = getTextContentFromPath(referenceXml, 'publisher-loc') || '';
        this.publisherName = getTextContentFromPath(referenceXml, 'publisher-name') || '';
        this.doi = getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="doi"]') || '';
        this.pmid = getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="pmid"]') || '';
        this.extLink = getTextContentFromPath(referenceXml, 'ext-link') || '';
    }

    protected createBlank(): void {
        this.year = '';
        this.doi = '';
        this.pmid = '';
        this.version = '';
        this.publisherLocation = '';
        this.publisherName = '';
        this.articleTitle = createReferenceAnnotatedValue();
        this.extLink = '';
        this.source = createReferenceAnnotatedValue();
    }
}

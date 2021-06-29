import { EditorState } from 'prosemirror-state';
import { DOMImplementation } from 'xmldom';
import { serializeManuscriptSection } from '../../xml-exporter/manuscript-serializer';
import { BackmatterEntity } from '../backmatter-entity';
import { JSONObject } from '../types';
import { getTextContentFromPath, removeEmptyNodes } from '../utils';
import { createReferenceAnnotatedValue, deserializeReferenceAnnotatedValue } from './reference.utils';

export class ThesisReference extends BackmatterEntity {
    year!: string;
    articleTitle!: EditorState;
    publisherLocation!: string;
    publisherName!: string;
    doi!: string;
    extLink!: string;
    pmid!: string;

    constructor(data?: JSONObject | Element) {
        super();
        this.createEntity(data);
    }

    public toXml(): Element {
        const xmlDoc = new DOMImplementation().createDocument(null, null);
        const xml = xmlDoc.createElement('element-citation');
        xml.setAttribute('publication-type', 'thesis');

        const year = xmlDoc.createElement('year');
        year.setAttribute('iso-8601-date', this.year);
        year.appendChild(xmlDoc.createTextNode(this.year));
        xml.appendChild(year);

        const articleTitle = xmlDoc.createElement('article-title');
        articleTitle.appendChild(serializeManuscriptSection(this.articleTitle, xmlDoc));
        xml.appendChild(articleTitle);

        const publisherName = xmlDoc.createElement('publisher-name');
        publisherName.appendChild(xmlDoc.createTextNode(this.publisherName));
        xml.appendChild(publisherName);

        const extLink = xmlDoc.createElement('ext-link');
        extLink.setAttribute('ext-link-type', 'uri');
        extLink.setAttribute('xlink:href', this.extLink);
        extLink.appendChild(xmlDoc.createTextNode(this.extLink));
        xml.appendChild(extLink);

        return removeEmptyNodes(xml);
    }

    protected fromJSON(json: JSONObject): void {
        this._id = (json._id as string) || this.id;
        this.articleTitle = json.articleTitle
            ? deserializeReferenceAnnotatedValue(json.articleTitle as JSONObject)
            : createReferenceAnnotatedValue();
        this.extLink = (json.extLink as string) || '';
        this.pmid = (json.pmid as string) || '';
        this.publisherLocation = (json.publisherLocation as string) || '';
        this.publisherName = (json.publisherName as string) || '';
        this.year = (json.year as string) || '';
        this.doi = (json.doi as string) || '';
    }

    protected fromXML(referenceXml: Element): void {
        this.year = getTextContentFromPath(referenceXml, 'year') || '';
        this.articleTitle = createReferenceAnnotatedValue(referenceXml.querySelector('article-title'));
        this.publisherLocation = getTextContentFromPath(referenceXml, 'publisher-loc') || '';
        this.publisherName = getTextContentFromPath(referenceXml, 'publisher-name') || '';
        this.doi = getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="doi"]') || '';
        this.pmid = getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="pmid"]') || '';
        this.extLink = getTextContentFromPath(referenceXml, 'ext-link') || '';
    }

    protected createBlank(): void {
        this.articleTitle = createReferenceAnnotatedValue();
        this.extLink = '';
        this.pmid = '';
        this.publisherLocation = '';
        this.publisherName = '';
        this.year = '';
        this.doi = '';
    }
}

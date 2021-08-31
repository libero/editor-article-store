import { EditorState } from 'prosemirror-state';
import { DOMImplementation } from '@xmldom/xmldom';
import { serializeManuscriptSection } from '../../xml-exporter/manuscript-serializer';
import { BackmatterEntity } from '../backmatter-entity';
import { JSONObject } from '../types';
import { getTextContentFromPath, removeEmptyNodes } from '../utils';
import { createReferenceAnnotatedValue, deserializeReferenceAnnotatedValue } from './reference.utils';

export class PatentReference extends BackmatterEntity {
    year!: string;
    articleTitle!: EditorState;
    source!: EditorState;
    patent!: string;
    extLink!: string;

    constructor(data?: JSONObject | Element) {
        super();
        this.createEntity(data);
    }

    public toXml(): Element {
        const xmlDoc = new DOMImplementation().createDocument(null, null);
        const xml = xmlDoc.createElement('element-citation');
        xml.setAttribute('publication-type', 'patent');

        const year = xmlDoc.createElement('year');
        year.setAttribute('iso-8601-date', this.year);
        year.appendChild(xmlDoc.createTextNode(this.year));
        xml.appendChild(year);

        const articleTitle = xmlDoc.createElement('article-title');
        articleTitle.appendChild(serializeManuscriptSection(this.articleTitle, xmlDoc));
        xml.appendChild(articleTitle);

        const source = xmlDoc.createElement('source');
        source.appendChild(serializeManuscriptSection(this.source, xmlDoc));
        xml.appendChild(source);

        const patent = xmlDoc.createElement('patent');
        patent.appendChild(xmlDoc.createTextNode(this.patent));
        xml.appendChild(patent);

        const extLink = xmlDoc.createElement('ext-link');
        extLink.setAttribute('ext-link-type', 'uri');
        extLink.setAttribute('xlink:href', this.extLink);
        extLink.appendChild(xmlDoc.createTextNode(this.extLink));
        xml.appendChild(extLink);

        return removeEmptyNodes(xml);
    }

    fromJSON(json: JSONObject): void {
        this._id = (json._id as string) || this._id;
        this.year = (json.year as string) || '';
        this.articleTitle = json.articleTitle
            ? deserializeReferenceAnnotatedValue(json.articleTitle as JSONObject)
            : createReferenceAnnotatedValue();
        this.source = json.source
            ? deserializeReferenceAnnotatedValue(json.source as JSONObject)
            : createReferenceAnnotatedValue();
        this.extLink = (json.extLink as string) || '';
        this.patent = (json.patent as string) || '';
    }

    fromXML(referenceXml: Element): void {
        this.year = getTextContentFromPath(referenceXml, 'year') || '';
        this.source = createReferenceAnnotatedValue(referenceXml.querySelector('source'));
        this.articleTitle = createReferenceAnnotatedValue(referenceXml.querySelector('article-title'));
        this.patent = getTextContentFromPath(referenceXml, 'patent') || '';
        this.extLink = getTextContentFromPath(referenceXml, 'ext-link') || '';
    }

    createBlank(): void {
        this.year = '';
        this.articleTitle = createReferenceAnnotatedValue();
        this.source = createReferenceAnnotatedValue();
        this.extLink = '';
        this.patent = '';
        this.extLink = '';
    }
}

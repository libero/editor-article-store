import { EditorState } from 'prosemirror-state';
import { BackmatterEntity } from '../backmatter-entity';
import { JSONObject } from '../types';
import { getTextContentFromPath, removeEmptyNodes } from '../utils';
import { createReferenceAnnotatedValue, deserializeReferenceAnnotatedValue } from './reference.utils';
import { serializeManuscriptSection } from '../../xml-exporter/manuscript-serializer';
import { DOMImplementation } from 'xmldom';

export class JournalReference extends BackmatterEntity {
    year!: string;
    source!: EditorState;
    articleTitle!: EditorState;
    volume!: string;
    firstPage!: string;
    lastPage!: string;
    elocationId!: string;
    inPress!: boolean;
    doi!: string;
    pmid!: string;
    pmcid!: string;

    constructor(data?: JSONObject | Element) {
        super();
        this.createEntity(data);
    }

    toXml(): Element {
        const xmlDoc = new DOMImplementation().createDocument(null, null);
        const xml = xmlDoc.createElement('element-citation');
        xml.setAttribute('publication-type', 'journal');

        const elocation = xmlDoc.createElement('elocation-id');
        elocation.appendChild(xmlDoc.createTextNode(this.elocationId));
        xml.appendChild(elocation);

        const firstPage = xmlDoc.createElement('fpage');
        firstPage.appendChild(xmlDoc.createTextNode(this.firstPage));
        xml.appendChild(firstPage);

        const lastPage = xmlDoc.createElement('lpage');
        lastPage.appendChild(xmlDoc.createTextNode(this.lastPage));
        xml.appendChild(lastPage);

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

        const doi = xmlDoc.createElement('pub-id');
        doi.setAttribute('pub-id-type', 'doi');
        doi.appendChild(xmlDoc.createTextNode(this.doi));
        xml.appendChild(doi);

        const pmid = xmlDoc.createElement('pub-id');
        pmid.setAttribute('pub-id-type', 'pmid');
        pmid.appendChild(xmlDoc.createTextNode(this.pmid));
        xml.appendChild(pmid);

        const pmcid = xmlDoc.createElement('pub-id');
        pmcid.setAttribute('pub-id-type', 'pmcid');
        pmcid.appendChild(xmlDoc.createTextNode(this.pmcid));
        xml.appendChild(pmcid);

        const volume = xmlDoc.createElement('volume');
        volume.appendChild(xmlDoc.createTextNode(this.volume));
        xml.appendChild(volume);

        if (this.inPress) {
            const comment = xmlDoc.createElement('comment');
            comment.appendChild(xmlDoc.createTextNode('In press'));
            xml.appendChild(comment);
        }

        return removeEmptyNodes(xml);
    }

    fromJSON(json: JSONObject): void {
        this._id = (json._id as string) || this.id;
        this.articleTitle = json.articleTitle
            ? deserializeReferenceAnnotatedValue(json.articleTitle as JSONObject)
            : createReferenceAnnotatedValue();
        this.elocationId = (json.elocationId as string) || '';
        this.firstPage = (json.firstPage as string) || '';
        this.inPress = (json.inPress as boolean) || false;
        this.lastPage = (json.lastPage as string) || '';
        this.pmid = (json.pmid as string) || '';
        this.pmcid = (json.pmcid as string) || '';
        this.volume = (json.volume as string) || '';
        this.year = (json.year as string) || '';
        this.doi = (json.doi as string) || '';
        this.source = json.source
            ? deserializeReferenceAnnotatedValue(json.source as JSONObject)
            : createReferenceAnnotatedValue();
    }

    fromXML(referenceXml: Element): void {
        this.year = getTextContentFromPath(referenceXml, 'year') || '';
        this.articleTitle = createReferenceAnnotatedValue(referenceXml.querySelector('article-title'));
        this.source = createReferenceAnnotatedValue(referenceXml.querySelector('source'));
        this.doi = getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="doi"]') || '';
        this.pmid = getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="pmid"]') || '';
        this.pmcid = getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="pmcid"]') || '';
        this.elocationId = getTextContentFromPath(referenceXml, 'elocation-id') || '';
        this.firstPage = getTextContentFromPath(referenceXml, 'fpage') || '';
        this.lastPage = getTextContentFromPath(referenceXml, 'lpage') || '';
        this.inPress = getTextContentFromPath(referenceXml, 'comment') === 'In press';
        this.volume = getTextContentFromPath(referenceXml, 'volume') || '';
    }

    createBlank(): void {
        this.articleTitle = createReferenceAnnotatedValue();
        this.elocationId = '';
        this.firstPage = '';
        this.inPress = false;
        this.lastPage = '';
        this.pmid = '';
        this.pmcid = '';
        this.volume = '';
        this.year = '';
        this.doi = '';
        this.source = createReferenceAnnotatedValue();
    }
}

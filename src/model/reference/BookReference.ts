import { EditorState } from 'prosemirror-state';
import { BackmatterEntity } from '../backmatter-entity';
import { JSONObject } from '../types';
import { removeEmptyNodes, getTextContentFromPath } from '../utils';
import {
    createReferenceAnnotatedValue,
    createReferencePersonList,
    deserializeReferenceAnnotatedValue,
    serializeReferenceContributorsList,
} from './reference.utils';
import { ReferenceContributor } from './types';
import { DOMImplementation } from '@xmldom/xmldom';
import { serializeManuscriptSection } from '../../xml-exporter/manuscript-serializer';

export class BookReference extends BackmatterEntity {
    chapterTitle!: EditorState;
    edition!: string;
    editors!: ReferenceContributor[];
    elocationId!: string;
    firstPage!: string;
    inPress!: boolean;
    lastPage!: string;
    pmid!: string;
    publisherLocation!: string;
    publisherName!: string;
    volume!: string;
    year!: string;
    doi!: string;
    isbn!: string;
    pmcid!: string;
    source!: EditorState;

    constructor(data?: JSONObject | Element) {
        super();
        this.createEntity(data);
    }

    toXml(): Element {
        const xmlDoc = new DOMImplementation().createDocument(null, null);
        const xml = xmlDoc.createElement('element-citation');
        xml.setAttribute('publication-type', 'book');

        const edition = xmlDoc.createElement('edition');
        edition.appendChild(xmlDoc.createTextNode(this.edition));
        xml.appendChild(edition);

        xml.appendChild(serializeReferenceContributorsList('editor', this.editors));

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

        const articleTitle = xmlDoc.createElement('chapter-title');
        articleTitle.appendChild(serializeManuscriptSection(this.chapterTitle, xmlDoc));
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

        const publisherName = xmlDoc.createElement('publisher-name');
        publisherName.appendChild(xmlDoc.createTextNode(this.publisherName));
        xml.appendChild(publisherName);

        const publisherLoc = xmlDoc.createElement('publisher-loc');
        publisherLoc.appendChild(xmlDoc.createTextNode(this.publisherLocation));
        xml.appendChild(publisherLoc);

        const volume = xmlDoc.createElement('volume');
        volume.appendChild(xmlDoc.createTextNode(this.volume));
        xml.appendChild(volume);

        const isbn = xmlDoc.createElement('pub-id');
        isbn.setAttribute('pub-id-type', 'isbn');
        isbn.appendChild(xmlDoc.createTextNode(this.isbn));
        xml.appendChild(isbn);

        const pmcid = xmlDoc.createElement('pub-id');
        pmcid.setAttribute('pub-id-type', 'pmcid');
        pmcid.appendChild(xmlDoc.createTextNode(this.pmcid));
        xml.appendChild(pmcid);

        return removeEmptyNodes(xml);
    }

    protected fromJSON(json: JSONObject): void {
        this._id = (json._id as string) || this.id;
        this.chapterTitle = json.chapterTitle
            ? deserializeReferenceAnnotatedValue(json.chapterTitle as JSONObject)
            : createReferenceAnnotatedValue();
        this.edition = (json.edition as string) || '';
        this.editors = (json.editors as ReferenceContributor[]) || [];
        this.elocationId = (json.elocationId as string) || '';
        this.firstPage = (json.firstPage as string) || '';
        this.inPress = (json.inPress as boolean) || false;
        this.lastPage = (json.lastPage as string) || '';
        this.pmid = (json.pmid as string) || '';
        this.pmcid = (json.pmcid as string) || '';
        this.publisherLocation = (json.publisherLocation as string) || '';
        this.publisherName = (json.publisherName as string) || '';
        this.volume = (json.volume as string) || '';
        this.year = (json.year as string) || '';
        this.doi = (json.doi as string) || '';
        this.isbn = (json.isbn as string) || '';
        this.source = json.source
            ? deserializeReferenceAnnotatedValue(json.source as JSONObject)
            : createReferenceAnnotatedValue();
    }

    protected fromXML(referenceXml: Element): void {
        const editors: ReferenceContributor[] = createReferencePersonList(referenceXml, 'editor');
        this.year = getTextContentFromPath(referenceXml, 'year') || '';
        this.chapterTitle = createReferenceAnnotatedValue(referenceXml.querySelector('chapter-title'));
        this.source = createReferenceAnnotatedValue(referenceXml.querySelector('source'));
        this.publisherLocation = getTextContentFromPath(referenceXml, 'publisher-loc') || '';
        this.editors = editors;
        this.publisherName = getTextContentFromPath(referenceXml, 'publisher-name') || '';
        this.edition = getTextContentFromPath(referenceXml, 'edition') || '';
        this.doi = getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="doi"]') || '';
        this.isbn = getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="isbn"]') || '';
        this.pmcid = getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="pmcid"]') || '';
        this.pmid = getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="pmid"]') || '';
        this.elocationId = getTextContentFromPath(referenceXml, 'elocation-id') || '';
        this.firstPage = getTextContentFromPath(referenceXml, 'fpage') || '';
        this.lastPage = getTextContentFromPath(referenceXml, 'lpage') || '';
        this.inPress = getTextContentFromPath(referenceXml, 'comment') === 'In press';
        this.volume = getTextContentFromPath(referenceXml, 'volume') || '';
    }

    protected createBlank(): void {
        this.chapterTitle = createReferenceAnnotatedValue();
        this.edition = '';
        this.editors = [];
        this.elocationId = '';
        this.firstPage = '';
        this.inPress = false;
        this.lastPage = '';
        this.pmid = '';
        this.isbn = '';
        this.pmcid = '';
        this.publisherLocation = '';
        this.publisherName = '';
        this.volume = '';
        this.year = '';
        this.doi = '';
        this.source = createReferenceAnnotatedValue();
    }
}

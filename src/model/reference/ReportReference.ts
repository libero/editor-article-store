import {EditorState} from "prosemirror-state";
import {BackmatterEntity} from "../backmatter-entity";
import {JSONObject} from "../types";
import {getTextContentFromPath} from "../utils";
import {
  createReferenceAnnotatedValue,
  deserializeReferenceAnnotatedValue
} from "./reference.utils";
import {DOMImplementation} from "xmldom";
import {serializeManuscriptSection} from "../..//xml-exporter/manuscript-serializer";

export class ReportReference extends BackmatterEntity {
  year!: string;
  source!: EditorState;
  publisherName!: string;
  publisherLocation!: string;
  pmid!: string;
  volume!: string;
  isbn!: string;
  doi!: string;
  extLink!: string;

  constructor(data?: JSONObject | Element) {
    super();
    this.createEntity(data);
  }

  toXml(): Element {
    const xmlDoc = new DOMImplementation().createDocument(null, null);
    const xml = xmlDoc.createElement('element-citation');

    const year = xmlDoc.createElement('year');
    year.setAttribute('iso-8601-date', this.year);
    year.appendChild(xmlDoc.createTextNode(this.year));
    xml.appendChild(year);

    const extLink = xmlDoc.createElement('ext-link');
    extLink.setAttribute('ext-link-type', 'uri');
    extLink.setAttribute('xlink:href', this.extLink);
    extLink.appendChild(xmlDoc.createTextNode(this.extLink));
    xml.appendChild(extLink);

    const source = xmlDoc.createElement('source');
    source.appendChild(serializeManuscriptSection(this.source, xmlDoc));
    xml.appendChild(source);

    const pubName = xmlDoc.createElement('publisher-name');
    pubName.appendChild(xmlDoc.createTextNode(this.publisherName));
    xml.appendChild(pubName);

    const pubLocation = xmlDoc.createElement('publisher-loc');
    pubLocation.appendChild(xmlDoc.createTextNode(this.publisherLocation));
    xml.appendChild(pubLocation);

    const volume = xmlDoc.createElement('volume');
    volume.appendChild(xmlDoc.createTextNode(this.volume));
    xml.appendChild(volume);

    const doi = xmlDoc.createElement('pub-id');
    doi.setAttribute('pub-id-type', 'doi');
    doi.appendChild(xmlDoc.createTextNode(this.doi));
    xml.appendChild(doi);

    const pmid = xmlDoc.createElement('pub-id');
    pmid.setAttribute('pub-id-type', 'pmid');
    pmid.appendChild(xmlDoc.createTextNode(this.pmid));
    xml.appendChild(pmid);

    const isbn = xmlDoc.createElement('pub-id');
    isbn.setAttribute('pub-id-type', 'isbn');
    isbn.appendChild(xmlDoc.createTextNode(this.isbn));
    xml.appendChild(isbn);

    return xml;
  }

  protected fromJSON(json: JSONObject) {
    this._id = (json._id as string) || this.id;
    this.isbn = json.isbn as string || '';
    this.publisherLocation = json.publisherLocation as string || '';
    this.publisherName = json.publisherName as string || '';
    this.pmid = json.pmid as string || '';
    this.extLink = json.extLink as string || '';
    this.volume = json.volume as string || '';
    this.year = json.year as string || '';
    this.doi = json.doi as string || '';
    this.source = json.source ? deserializeReferenceAnnotatedValue(json.source as JSONObject) : createReferenceAnnotatedValue();
  }

  protected fromXML(referenceXml: Element) {
    this.year = getTextContentFromPath(referenceXml, 'year') || '';
    this.source = createReferenceAnnotatedValue(referenceXml.querySelector('source'));
    this.publisherLocation = getTextContentFromPath(referenceXml, 'publisher-loc') || '';
    this.publisherName = getTextContentFromPath(referenceXml, 'publisher-name') || '';
    this.extLink = getTextContentFromPath(referenceXml, 'ext-link') || '';
    this.doi = getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="doi"]') || '';
    this.pmid = getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="pmid"]') || '';
    this.isbn = getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="isbn"]') || '';
    this.volume = getTextContentFromPath(referenceXml, 'volume') || '';
  }

  protected createBlank() {
    this.isbn = '';
    this.publisherLocation = '';
    this.publisherName = '';
    this.pmid = '';
    this.extLink = '';
    this.volume = '';
    this.year = '';
    this.doi = '';
    this.source = createReferenceAnnotatedValue();
  }
}

import { EditorState } from "prosemirror-state";
import { BackmatterEntity } from "../backmatter-entity";
import { JSONObject } from "../types";
import { getTextContentFromPath } from "../utils";
import { createReferenceAnnotatedValue, deserializeReferenceAnnotatedValue } from "./reference.utils";
import {DOMImplementation} from "xmldom";
import {serializeManuscriptSection} from "../../xml-exporter/manuscript-serializer";

export class PreprintReference extends BackmatterEntity {
  year!: string;
  articleTitle!: EditorState;
  source!: EditorState;
  extLink!: string;
  doi!: string;
  pmid!: string;

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

    return xml;
  }

  protected fromJSON(json: JSONObject) {
    this._id = json._id as string || this._id;
    this.articleTitle = json.articleTitle  ? deserializeReferenceAnnotatedValue(json.articleTitle as JSONObject) : createReferenceAnnotatedValue();
    this.year = json.year as string || '';
    this.doi = json.doi as string || '';
    this.extLink = json.extLink as string || '';
    this.pmid = json.pmid as string || '';
    this.source = json.source ? deserializeReferenceAnnotatedValue(json.source as JSONObject) : createReferenceAnnotatedValue();
  }

  protected fromXML(referenceXml: Element) {
    this.year = getTextContentFromPath(referenceXml, 'year') || '';
    this.source = createReferenceAnnotatedValue(referenceXml.querySelector('source'));
    this.articleTitle = createReferenceAnnotatedValue(referenceXml.querySelector('article-title'));
    this.doi = getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="doi"]') || '';
    this.pmid = getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="pmid"]') || '';
    this.extLink = getTextContentFromPath(referenceXml, 'ext-link') || '';
  }

  protected createBlank() {
    this.articleTitle = createReferenceAnnotatedValue();
    this.year = '';
    this.doi = '';
    this.extLink = '';
    this.pmid = '';
    this.source = createReferenceAnnotatedValue();
  }
}

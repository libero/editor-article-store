import { EditorState } from "prosemirror-state";
import { BackmatterEntity } from "../backmatter-entity";
import { JSONObject } from "../types";
import { getTextContentFromPath } from "../utils";
import { createReferenceAnnotatedValue, deserializeReferenceAnnotatedValue } from "./reference.utils";
import {DOMImplementation} from "xmldom";
import {serializeManuscriptSection} from "../../xml-exporter/manuscript-serializer";

export class ConferenceReference extends BackmatterEntity {
  year!: string;
  articleTitle!: EditorState;
  conferenceName!: EditorState;
  conferenceLocation!: string;
  conferenceDate!: string;
  volume!: string;
  extLink!: string;
  elocationId!: string;
  doi!: string;
  firstPage!: string;
  lastPage!: string;

  constructor(data?: JSONObject | Element) {
    super();
    this.createEntity(data);
  }

  toXml(): Element {
    const xmlDoc = new DOMImplementation().createDocument(null, null);
    const xml = xmlDoc.createElement('element-citation');
    xml.setAttribute('publication-type', 'confproc');

    const elocation = xmlDoc.createElement('elocation-id');
    elocation.appendChild(xmlDoc.createTextNode(this.elocationId));
    xml.appendChild(elocation);

    const confName = xmlDoc.createElement('conf-name');
    confName.appendChild(serializeManuscriptSection(this.conferenceName, xmlDoc));
    xml.appendChild(confName);

    const confLocation = xmlDoc.createElement('conf-loc');
    confLocation.appendChild(xmlDoc.createTextNode(this.conferenceLocation));
    xml.appendChild(confLocation);

    const confDate = xmlDoc.createElement('conf-date');
    confDate.appendChild(xmlDoc.createTextNode(this.conferenceDate));
    xml.appendChild(confDate);

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

    const doi = xmlDoc.createElement('pub-id');
    doi.setAttribute('pub-id-type', 'doi');
    doi.appendChild(xmlDoc.createTextNode(this.doi));
    xml.appendChild(doi);

    const extLink = xmlDoc.createElement('ext-link');
    extLink.setAttribute('ext-link-type', 'uri');
    extLink.setAttribute('xlink:href', this.extLink);
    extLink.appendChild(xmlDoc.createTextNode(this.extLink));
    xml.appendChild(extLink);

    const volume = xmlDoc.createElement('volume');
    volume.appendChild(xmlDoc.createTextNode(this.volume));
    xml.appendChild(volume);

    return xml;
  }
  
  protected fromJSON(json: JSONObject) {
    this._id = (json._id as string) || this.id;
    this.articleTitle = json.articleTitle ? deserializeReferenceAnnotatedValue(json.articleTitle as JSONObject) : createReferenceAnnotatedValue();
    this.elocationId = json.elocationId as string || '';
    this.extLink = json.extLink as string || '';
    this.conferenceDate = json.conferenceDate as string || '';
    this.firstPage = json.firstPage as string || '';
    this.lastPage = json.lastPage as string || '';
    this.volume = json.volume as string || '';
    this.year = json.year as string || '';
    this.doi = json.doi as string || '';
    this.conferenceName = json.conferenceName ? deserializeReferenceAnnotatedValue(json.conferenceName as JSONObject) : createReferenceAnnotatedValue();
    this.conferenceLocation = json.conferenceLocation as string || '';
  }

  protected fromXML(referenceXml: Element) {
    this.year = getTextContentFromPath(referenceXml, 'year') || '';
    this.articleTitle = createReferenceAnnotatedValue(referenceXml.querySelector('article-title'));
    this.conferenceName = createReferenceAnnotatedValue(referenceXml.querySelector('conf-name'));
    this.doi = getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="doi"]') || '';
    this.elocationId = getTextContentFromPath(referenceXml, 'elocation-id') || '';
    this.conferenceDate = getTextContentFromPath(referenceXml, 'conf-date') || '';
    this.conferenceLocation = getTextContentFromPath(referenceXml, 'conf-loc') || '';
    this.extLink = getTextContentFromPath(referenceXml, 'ext-link') || '';
    this.firstPage = getTextContentFromPath(referenceXml, 'fpage')|| '';
    this.lastPage = getTextContentFromPath(referenceXml, 'lpage')|| '';
    this.volume = getTextContentFromPath(referenceXml, 'volume') || '';
  }

  protected createBlank() {
    this.articleTitle = createReferenceAnnotatedValue();
    this.elocationId = '';
    this.extLink = '';
    this.conferenceDate = '';
    this.firstPage = '';
    this.lastPage = '';
    this.volume = '';
    this.year = '';
    this.doi = '';
    this.conferenceName = createReferenceAnnotatedValue();
    this.conferenceLocation = '';
  }
}

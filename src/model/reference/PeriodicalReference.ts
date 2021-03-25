import moment from "moment";
import {DOMImplementation} from "xmldom";
import { EditorState } from "prosemirror-state";
import { serializeManuscriptSection } from "../../xml-exporter/manuscript-serializer";
import { BackmatterEntity } from "../backmatter-entity";
import { JSONObject } from "../types";
import { getTextContentFromPath } from "../utils";
import { createReferenceAnnotatedValue, deserializeReferenceAnnotatedValue } from "./reference.utils";

export class PeriodicalReference extends BackmatterEntity {
  date!: string;
  source!: EditorState;
  articleTitle!: EditorState;
  volume!: string;
  firstPage!: string;
  lastPage!: string;
  extLink!: string;
  
  constructor(data?: Element | JSONObject) {
    super();
    this.createEntity(data)
  }

  public toXml(): Element {
    const xmlDoc = new DOMImplementation().createDocument(null, null);
    const xml = xmlDoc.createElement('element-citation');
    xml.setAttribute('publication-type', 'periodical');

    const stringDate = xmlDoc.createElement('string-date');
    stringDate.setAttribute('iso-8601-date', this.date);

    if (this.date) {
      const date = moment(this.date);
      const month = xmlDoc.createElement('month');
      month.appendChild(xmlDoc.createTextNode(date.format('MMMM')))
      const day = xmlDoc.createElement('day');
      day.appendChild(xmlDoc.createTextNode(date.format('D')));
      const year = xmlDoc.createElement('year');
      year.appendChild(xmlDoc.createTextNode(date.format('YYYY')));
      stringDate.appendChild(month);
      stringDate.appendChild(day);
      stringDate.appendChild(xmlDoc.createTextNode(', '));
      stringDate.appendChild(year);
    }

    xml.appendChild(stringDate);

    const articleTitle = xmlDoc.createElement('article-title');
    articleTitle.appendChild(serializeManuscriptSection(this.articleTitle, xmlDoc));
    xml.appendChild(articleTitle);

    const source = xmlDoc.createElement('source');
    source.appendChild(serializeManuscriptSection(this.source, xmlDoc));
    xml.appendChild(source);

    const volume = xmlDoc.createElement('volume');
    volume.appendChild(xmlDoc.createTextNode(this.volume));
    xml.appendChild(volume);
    
    const firstPage = xmlDoc.createElement('fpage');
    firstPage.appendChild(xmlDoc.createTextNode(this.firstPage));
    xml.appendChild(firstPage);
    
    const lastPage = xmlDoc.createElement('lpage');
    lastPage.appendChild(xmlDoc.createTextNode(this.lastPage));
    xml.appendChild(lastPage);

    const extLink = xmlDoc.createElement('ext-link');
    extLink.setAttribute('ext-link-type', 'uri');
    extLink.setAttribute('xlink:href', this.extLink);
    extLink.appendChild(xmlDoc.createTextNode(this.extLink));
    xml.appendChild(extLink);
    
    return xml;
  }

  protected fromJSON(json: JSONObject) {
    this._id = json._id as string || this._id;
    this.articleTitle = json.articleTitle ? deserializeReferenceAnnotatedValue(json.articleTitle as JSONObject) : createReferenceAnnotatedValue();
    this.date = json.date as string || '';
    this.firstPage = json.firstPage as string || '';
    this.lastPage = json.lastPage as string || '';
    this.volume = json.volume as string || '';
    this.extLink = json.extLink as string || '';
    this.source = json.source ? deserializeReferenceAnnotatedValue(json.source as JSONObject) : createReferenceAnnotatedValue();
  }
  protected fromXML(referenceXml: Element) {
    this.date = referenceXml.querySelector('string-date')?.getAttribute('iso-8601-date') || '';
    this.source = createReferenceAnnotatedValue(referenceXml.querySelector('source'));
    this.articleTitle = createReferenceAnnotatedValue(referenceXml.querySelector('article-title'));
    this.firstPage = getTextContentFromPath(referenceXml, 'fpage') || '';
    this.lastPage = getTextContentFromPath(referenceXml, 'lpage') || '';
    this.extLink = getTextContentFromPath(referenceXml, 'ext-link') || '';
    this.volume = getTextContentFromPath(referenceXml, 'volume') || '';
  }
  protected createBlank() {
    this.articleTitle = createReferenceAnnotatedValue();
    this.date = '';
    this.firstPage = '';
    this.lastPage = '';
    this.volume = '';
    this.extLink = '';
    this.source = createReferenceAnnotatedValue();
  }
}

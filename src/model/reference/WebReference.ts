import {EditorState} from "prosemirror-state";
import {BackmatterEntity} from "../backmatter-entity";
import {JSONObject} from "../types";
import {getTextContentFromPath} from "../utils";
import {createReferenceAnnotatedValue, deserializeReferenceAnnotatedValue} from "./reference.utils";
import {DOMImplementation} from "xmldom";
import {serializeManuscriptSection} from "../../xml-exporter/manuscript-serializer";
import moment from "moment";

export class WebReference extends BackmatterEntity {
  year!: string;
  source!: EditorState;
  articleTitle!: EditorState;
  dateInCitation!: string;
  extLink!: string;

  constructor(data?: Element | JSONObject) {
    super();
    this.createEntity(data)
  }

  toXml(): DocumentFragment {
    const xmlDoc = new DOMImplementation().createDocument(null, null);
    const xml = xmlDoc.createDocumentFragment();

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

    if (this.dateInCitation) {
      const dateInCitation = xmlDoc.createElement('date-in-citation');
      dateInCitation.setAttribute('iso-8601-date', this.dateInCitation);
      const date = moment(this.dateInCitation);
      dateInCitation.appendChild(xmlDoc.createTextNode(date.format('MMMM D, YYYY')));
      xml.appendChild(dateInCitation)
    }

    return xml;
  }

  protected fromJSON(json: JSONObject) {
    this._id = json._id as string || this._id;
    this.articleTitle = json.articleTitle ? deserializeReferenceAnnotatedValue(json.articleTitle as JSONObject) : createReferenceAnnotatedValue();
    this.year = json.year as string || '';
    this.dateInCitation = json.dateInCitation as string || '';
    this.extLink = json.extLink as string || '';
    this.source = json.source ? deserializeReferenceAnnotatedValue(json.source as JSONObject) : createReferenceAnnotatedValue();
  }

  protected fromXML(referenceXml: Element) {
    this.year = getTextContentFromPath(referenceXml, 'year') || '';
    this.source = createReferenceAnnotatedValue(referenceXml.querySelector('source'));
    this.articleTitle = createReferenceAnnotatedValue(referenceXml.querySelector('article-title'));
    this.extLink = getTextContentFromPath(referenceXml, 'ext-link') || '';
    const dateInCitationEl = referenceXml.querySelector('date-in-citation');
    this.dateInCitation = dateInCitationEl ? dateInCitationEl.getAttribute('iso-8601-date') || '' : '';
  }

  protected createBlank() {
    this.articleTitle = createReferenceAnnotatedValue();
    this.source = createReferenceAnnotatedValue();
    this.year = '';
    this.dateInCitation = '';
    this.extLink = '';
  }
}

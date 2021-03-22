import { EditorState } from "prosemirror-state";
import { BackmatterEntity } from "../backmatter-entity";
import { JSONObject } from "../types";
import { getTextContentFromPath } from "../utils";
import { createReferenceAnnotatedValue, deserializeReferenceAnnotatedValue } from "./reference.utils";

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

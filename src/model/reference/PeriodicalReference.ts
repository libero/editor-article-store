import { EditorState } from "prosemirror-state";
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
    this.date = referenceXml.querySelector('string-date > year')?.getAttribute('iso-8601-date') || '';
    this.source = createReferenceAnnotatedValue(referenceXml.querySelector('source'));
    this.articleTitle = createReferenceAnnotatedValue(referenceXml.querySelector('article-title'));
    this.firstPage = getTextContentFromPath(referenceXml, 'fpage') || '',
    this.lastPage = getTextContentFromPath(referenceXml, 'lpage') || '',
    this.extLink = getTextContentFromPath(referenceXml, 'ext-link') || '',
    this.volume = getTextContentFromPath(referenceXml, 'volume') || ''
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
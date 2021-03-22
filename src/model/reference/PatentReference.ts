import { EditorState } from "prosemirror-state";
import { BackmatterEntity } from "../backmatter-entity";
import { JSONObject } from "../types";
import { getTextContentFromPath } from "../utils";
import { createReferenceAnnotatedValue, deserializeReferenceAnnotatedValue } from "./reference.utils";

export class PatentReference extends BackmatterEntity {
  year!: string;
  articleTitle!: EditorState;
  source!: EditorState;
  doi!: string;
  patent!: string;
  extLink!: string;
  publisherName!: string;

  constructor(data?: JSONObject | Element) {
    super();
    this.createEntity(data);
  }
  
  fromJSON(json: JSONObject) {
    this._id = json._id as string || this._id;
    this.year = json.year as string || '';
    this.articleTitle = json.articleTitle  ? deserializeReferenceAnnotatedValue(json.articleTitle as JSONObject) : createReferenceAnnotatedValue();
    this.source = json.source ? deserializeReferenceAnnotatedValue(json.source as JSONObject) : createReferenceAnnotatedValue();
    this.doi = json.doi as string || '';
    this.extLink = json.extLink as string || '';
    this.patent = json.patent as string || '';
    this.publisherName = json.publisherName as string || '';
  }

  fromXML(referenceXml: Element) {
    this.year = getTextContentFromPath(referenceXml, 'year') || '';
    this.source = createReferenceAnnotatedValue(referenceXml.querySelector('source'));
    this.articleTitle = createReferenceAnnotatedValue(referenceXml.querySelector('article-title'));
    this.doi = getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="doi"]') || '';
    this.patent = getTextContentFromPath(referenceXml, 'patent') || '';
    this.extLink = getTextContentFromPath(referenceXml, 'ext-link') || '';
    this.publisherName = getTextContentFromPath(referenceXml, 'publisher-name') || '';
  }

  createBlank() {
    this.year = '';
    this.articleTitle = createReferenceAnnotatedValue();
    this.source = createReferenceAnnotatedValue();
    this.doi = '';
    this.extLink = '';
    this.patent = '';
    this.extLink = '';
    this.publisherName = '';
  }
}

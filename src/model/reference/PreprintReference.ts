import { EditorState } from "prosemirror-state";
import { BackmatterEntity } from "../backmatter-entity";
import { JSONObject } from "../types";
import { getTextContentFromPath } from "../utils";
import { createReferenceAnnotatedValue, deserializeReferenceAnnotatedValue } from "./reference.utils";

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
  
  fromJSON(json: JSONObject) {
    this._id = json._id as string || this._id;
    this.articleTitle = json.articleTitle  ? deserializeReferenceAnnotatedValue(json.articleTitle as JSONObject) : createReferenceAnnotatedValue();
    this.year = json.year as string || '';
    this.doi = json.doi as string || '';
    this.extLink = json.extLink as string || '';
    this.pmid = json.pmid as string || '';
    this.source = json.source ? deserializeReferenceAnnotatedValue(json.source as JSONObject) : createReferenceAnnotatedValue();
  }

  fromXML(referenceXml: Element) {
    this.year = getTextContentFromPath(referenceXml, 'year') || '';
    this.source = createReferenceAnnotatedValue(referenceXml.querySelector('source'));
    this.articleTitle = createReferenceAnnotatedValue(referenceXml.querySelector('article-title'));
    this.doi = getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="doi"]') || '';
    this.pmid = getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="pmid"]') || '';
    this.extLink = getTextContentFromPath(referenceXml, 'ext-link') || '';
  }

  createBlank() {
    this.articleTitle = createReferenceAnnotatedValue();
    this.year = '';
    this.doi = '';
    this.extLink = '';
    this.pmid = '';
    this.source = createReferenceAnnotatedValue();
  }
}

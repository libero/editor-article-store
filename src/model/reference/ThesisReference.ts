import { EditorState } from "prosemirror-state";
import { BackmatterEntity } from "../backmatter-entity";
import { JSONObject } from "../types";
import { getTextContentFromPath } from "../utils";
import { createReferenceAnnotatedValue, deserializeReferenceAnnotatedValue } from "./reference.utils";

export class ThesisReference extends BackmatterEntity {
  year!: string;
  articleTitle!: EditorState;
  publisherLocation!: string;
  publisherName!: string;
  doi!: string;
  extLink!: string;
  pmid!: string;

  constructor(data?: JSONObject | Element) {
    super();
    this.createEntity(data);
  }
  
  protected fromJSON(json: JSONObject) {
    this._id = (json._id as string) || this.id;
    this.articleTitle = json.articleTitle ? deserializeReferenceAnnotatedValue(json.articleTitle as JSONObject) : createReferenceAnnotatedValue();
    this.extLink = json.extLink as string || '';
    this.pmid = json.pmid as string || '';
    this.publisherLocation = json.publisherLocation as string || '';
    this.publisherName = json.publisherName as string || '';
    this.year = json.year as string || '';
    this.doi = json.doi as string || '';
  }

  protected fromXML(referenceXml: Element) {
    this.year = getTextContentFromPath(referenceXml, 'year') || '';
    this.articleTitle = createReferenceAnnotatedValue(referenceXml.querySelector('article-title'));
    this.publisherLocation = getTextContentFromPath(referenceXml, 'publisher-loc') || '';
    this.publisherName = getTextContentFromPath(referenceXml, 'publisher-name') || '';
    this.doi = getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="doi"]') || '';
    this.pmid = getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="pmid"]') || '';
    this.extLink = getTextContentFromPath(referenceXml, 'ext-link') || '';
  }

  protected createBlank() {
    this.articleTitle = createReferenceAnnotatedValue();
    this.extLink = '';
    this.pmid = '';
    this.publisherLocation = '';
    this.publisherName = '';
    this.year = '';
    this.doi = '';
  }
}

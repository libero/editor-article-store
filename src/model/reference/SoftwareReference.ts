import { EditorState } from "prosemirror-state";
import { BackmatterEntity } from "../backmatter-entity";
import { JSONObject } from "../types";
import { getTextContentFromPath } from "../utils";
import { createReferenceAnnotatedValue, deserializeReferenceAnnotatedValue } from "./reference.utils";

export class SoftwareReference extends BackmatterEntity {
  year!: string;
  source!: EditorState;
  articleTitle!: EditorState;
  version!: string;
  publisherName!: string;
  publisherLocation!: string;
  extLink!: string;
  doi!: string;

  constructor(data?: Element | JSONObject) {
    super();
    this.createEntity(data)
  }
  protected fromJSON(json: JSONObject) {
    this._id = json._id as string || this._id;
    this.year = json.year as string || '';
    this.doi = json.doi as string || '';
    this.version = json.version as string || '';
    this.publisherLocation = json.publisherLocation as string || '';
    this.publisherName = json.publisherName as string || '';
    this.articleTitle = json.articleTitle ? deserializeReferenceAnnotatedValue(json.articleTitle as JSONObject) : createReferenceAnnotatedValue();
    this.extLink = json.extLink as string || '';
    this.source = json.source ? deserializeReferenceAnnotatedValue(json.source as JSONObject) : createReferenceAnnotatedValue();
  }
  protected fromXML(referenceXml: Element) {
    this.year = getTextContentFromPath(referenceXml, 'year');
    this.articleTitle = createReferenceAnnotatedValue(referenceXml.querySelector('article-title'));
    this.source = createReferenceAnnotatedValue(referenceXml.querySelector('source'));
    this.version = getTextContentFromPath(referenceXml, 'version') || '';
    this.publisherLocation = getTextContentFromPath(referenceXml, 'publisher-loc') || '';
    this.publisherName = getTextContentFromPath(referenceXml, 'publisher-name') || '';
    this.doi = getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="doi"]') || '';
    this.extLink = getTextContentFromPath(referenceXml, 'ext-link') || '';
  }
  protected createBlank() {
    this.year = '';
    this.doi = '';
    this.version = '';
    this.publisherLocation = '';
    this.publisherName =  '';
    this.articleTitle = createReferenceAnnotatedValue();
    this.extLink = '';
    this.source = createReferenceAnnotatedValue();
  }
}

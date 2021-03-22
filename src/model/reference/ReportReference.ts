import {EditorState} from "prosemirror-state";
import {BackmatterEntity} from "../backmatter-entity";
import {JSONObject} from "../types";
import {getTextContentFromPath} from "../utils";
import {
  createReferenceAnnotatedValue,
  deserializeReferenceAnnotatedValue
} from "./reference.utils";

export class ReportReference extends BackmatterEntity {
  year!: string;
  source!: EditorState;
  publisherName!: string;
  publisherLocation!: string;
  pmid!: string;
  volume!: string;
  isbn!: string;
  doi!: string;
  extLink!: string;

  constructor(data?: JSONObject | Element) {
    super();
    this.createEntity(data);
  }

  fromJSON(json: JSONObject) {
    this._id = (json._id as string) || this.id;
    this.isbn = json.isbn as string || '';
    this.publisherLocation = json.publisherLocation as string || '';
    this.publisherName = json.publisherName as string || '';
    this.pmid = json.pmid as string || '';
    this.extLink = json.extLink as string || '';
    this.volume = json.volume as string || '';
    this.year = json.year as string || '';
    this.doi = json.doi as string || '';
    this.source = json.source ? deserializeReferenceAnnotatedValue(json.source as JSONObject) : createReferenceAnnotatedValue();
  }

  fromXML(referenceXml: Element) {
    this.year = getTextContentFromPath(referenceXml, 'year') || '';
    this.source = createReferenceAnnotatedValue(referenceXml.querySelector('source'));
    this.publisherLocation = getTextContentFromPath(referenceXml, 'publisher-loc') || '';
    this.publisherName = getTextContentFromPath(referenceXml, 'publisher-name') || '';
    this.extLink = getTextContentFromPath(referenceXml, 'ext-link') || '';
    this.doi = getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="doi"]') || '';
    this.pmid = getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="pmid"]') || '';
    this.isbn = getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="isbn"]') || '';
    this.volume = getTextContentFromPath(referenceXml, 'volume') || '';
  }

  createBlank() {
    this.isbn = '';
    this.publisherLocation = '';
    this.publisherName = '';
    this.pmid = '';
    this.extLink = '';
    this.volume = '';
    this.year = '';
    this.doi = '';
    this.source = createReferenceAnnotatedValue();
  }
}

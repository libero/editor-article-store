import {EditorState} from "prosemirror-state";
import {BackmatterEntity} from "../backmatter-entity";
import {JSONObject} from "../types";
import {getTextContentFromPath} from "../utils";
import {
  createReferenceAnnotatedValue,
  deserializeReferenceAnnotatedValue
} from "./reference.utils";

export class JournalReference extends BackmatterEntity {
  year!: string;
  source!: EditorState;
  articleTitle!: EditorState;
  volume!: string;
  firstPage!: string;
  lastPage!: string;
  elocationId!: string;
  inPress!: boolean;
  doi!: string;
  pmid!: string;

  constructor(data?: JSONObject | Element) {
    super();
    this.createEntity(data);
  }

  fromJSON(json: JSONObject) {
    this._id = (json._id as string) || this.id;
    this.articleTitle = json.articleTitle ? deserializeReferenceAnnotatedValue(json.articleTitle as JSONObject) : createReferenceAnnotatedValue();
    this.elocationId = json.elocationId as string || '';
    this.firstPage = json.firstPage as string || '';
    this.inPress = json.inPress as boolean || false;
    this.lastPage = json.lastPage as string || '';
    this.pmid = json.pmid as string || '';
    this.volume = json.volume as string || '';
    this.year = json.year as string || '';
    this.doi = json.doi as string || '';
    this.source = json.source ? deserializeReferenceAnnotatedValue(json.source as JSONObject) : createReferenceAnnotatedValue();
  }

  fromXML(referenceXml: Element) {
    this.year = getTextContentFromPath(referenceXml, 'year') || '';
    this.articleTitle = createReferenceAnnotatedValue(referenceXml.querySelector('article-title'));
    this.source = createReferenceAnnotatedValue(referenceXml.querySelector('source'));
    this.doi = getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="doi"]') || '';
    this.pmid = getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="pmid"]') || '';
    this.elocationId = getTextContentFromPath(referenceXml, 'elocation-id') || '';
    this.firstPage = getTextContentFromPath(referenceXml, 'fpage') || '';
    this.lastPage = getTextContentFromPath(referenceXml, 'lpage') || '';
    this.inPress = getTextContentFromPath(referenceXml, 'comment') === 'In press';
    this.volume = getTextContentFromPath(referenceXml, 'volume') || '';
  }

  createBlank() {
    this.articleTitle = createReferenceAnnotatedValue();
    this.elocationId = '';
    this.firstPage = '';
    this.inPress = false;
    this.lastPage = '';
    this.pmid = '';
    this.volume = '';
    this.year = '';
    this.doi = '';
    this.source = createReferenceAnnotatedValue();
  }
}

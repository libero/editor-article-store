import { EditorState } from "prosemirror-state";
import { BackmatterEntity } from "../backmatter-entity";
import { JSONObject } from "../types";
import { getTextContentFromPath } from "../utils";
import { createReferenceAnnotatedValue, deserializeReferenceAnnotatedValue } from "./reference.utils";

export class ConferenceReference extends BackmatterEntity {
  year!: string;
  articleTitle!: EditorState;
  conferenceName!: EditorState;
  conferenceLocation!: string;
  conferenceDate!: string;
  volume!: string;
  extLink!: string;
  elocationId!: string;
  doi!: string;
  firstPage!: string;
  lastPage!: string;

  constructor(data?: JSONObject | Element) {
    super();
    this.createEntity(data);
  }
  
  protected fromJSON(json: JSONObject) {
    this._id = (json._id as string) || this.id;
    this.articleTitle = json.articleTitle ? deserializeReferenceAnnotatedValue(json.articleTitle as JSONObject) : createReferenceAnnotatedValue();
    this.elocationId = json.elocationId as string || '';
    this.extLink = json.extLink as string || '';
    this.conferenceDate = json.conferenceDate as string || '';
    this.firstPage = json.firstPage as string || '';
    this.lastPage = json.lastPage as string || '';
    this.volume = json.volume as string || '';
    this.year = json.year as string || '';
    this.doi = json.doi as string || '';
    this.conferenceName = json.conferenceName ? deserializeReferenceAnnotatedValue(json.conferenceName as JSONObject) : createReferenceAnnotatedValue();
    this.conferenceLocation = json.conferenceLocation as string || '';
  }

  protected fromXML(referenceXml: Element) {
    this.year = getTextContentFromPath(referenceXml, 'year') || '';
    this.articleTitle = createReferenceAnnotatedValue(referenceXml.querySelector('article-title'));
    this.conferenceName = createReferenceAnnotatedValue(referenceXml.querySelector('conf-name'));
    this.doi = getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="doi"]') || '';
    this.elocationId = getTextContentFromPath(referenceXml, 'elocation-id') || '';
    this.conferenceDate = getTextContentFromPath(referenceXml, 'conf-date') || '';
    this.conferenceLocation = getTextContentFromPath(referenceXml, 'conf-loc') || '';
    this.extLink = getTextContentFromPath(referenceXml, 'ext-link') || '';
    this.firstPage = getTextContentFromPath(referenceXml, 'fpage')|| '';
    this.lastPage = getTextContentFromPath(referenceXml, 'lpage')|| '';
    this.volume = getTextContentFromPath(referenceXml, 'volume') || '';
  }

  protected createBlank() {
    this.articleTitle = createReferenceAnnotatedValue();
    this.elocationId = '';
    this.extLink = '';
    this.conferenceDate = '';
    this.firstPage = '';
    this.lastPage = '';
    this.volume = '';
    this.year = '';
    this.doi = '';
    this.conferenceName = createReferenceAnnotatedValue();
    this.conferenceLocation = '';
  }
}

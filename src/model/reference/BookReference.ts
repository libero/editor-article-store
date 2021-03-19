import { EditorState } from "prosemirror-state";
import { BackmatterEntity } from "../backmatter-entity";
import { JSONObject } from "../types";
import { getTextContentFromPath } from "../utils";
import { createReferenceAnnotatedValue, createReferencePersonList, deserializeReferenceAnnotatedValue } from "./reference.utils";
import { ReferenceContributor } from "./types";

export class BookReference extends BackmatterEntity {
  chapterTitle!: EditorState;
  edition!: string;
  editors!: ReferenceContributor[];
  elocationId!: string;
  firstPage!: string;
  inPress!: boolean;
  lastPage!: string;
  pmid!: string;
  publisherLocation!: string;
  publisherName!: string;
  volume!: string;
  year!: string;
  doi!: string;
  source!: EditorState;

  constructor(data?: JSONObject | Element) {
    super();
    this.createEntity(data);
  }
  
  protected fromJSON(json: JSONObject) {
    this._id = (json._id as string) || this.id;
    this.chapterTitle = json.chapterTitle ? deserializeReferenceAnnotatedValue(json.chapterTitle as JSONObject) : createReferenceAnnotatedValue();
    this.edition = json.edition as string || '';
    this.editors = json.editors as ReferenceContributor[] || [],
    this.elocationId = json.elocationId as string || '';
    this.firstPage = json.firstPage as string || '';
    this.inPress = json.inPress as boolean || false,
    this.lastPage = json.lastPage as string || '';
    this.pmid = json.pmid as string || '';
    this.publisherLocation = json.publisherLocation as string || '';
    this.publisherName = json.publisherName as string || '';
    this.volume = json.volume as string || '';
    this.year = json.year as string || '';
    this.doi = json.doi as string || '';
    this.source = json.source ? deserializeReferenceAnnotatedValue(json.source as JSONObject) : createReferenceAnnotatedValue();
  }

  protected fromXML(referenceXml: Element) {
    const editors: ReferenceContributor[] = createReferencePersonList(referenceXml, 'editor');
    this.year = getTextContentFromPath(referenceXml, 'year') || '';
    this.chapterTitle = createReferenceAnnotatedValue(referenceXml.querySelector('chapter-title'));
    this.source = createReferenceAnnotatedValue(referenceXml.querySelector('source'));
    this.publisherLocation = getTextContentFromPath(referenceXml, 'publisher-loc') || '';
    this.editors = editors;
    this.publisherName = getTextContentFromPath(referenceXml, 'publisher-name') || '';
    this.edition = getTextContentFromPath(referenceXml, 'edition') || '';
    this.doi = getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="doi"]') || '';
    this.pmid = getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="pmid"]') || '';
    this.elocationId = getTextContentFromPath(referenceXml, 'elocation-id') || '';
    this.firstPage = getTextContentFromPath(referenceXml, 'fpage')|| '';
    this.lastPage = getTextContentFromPath(referenceXml, 'lpage')|| '';
    this.inPress = getTextContentFromPath(referenceXml, 'comment') === 'In press';
    this.volume = getTextContentFromPath(referenceXml, 'volume') || '';
  }

  protected createBlank() {
    this.chapterTitle = createReferenceAnnotatedValue();
    this.edition = '';
    this.editors = [];
    this.elocationId = '';
    this.firstPage = '';
    this.inPress = false;
    this.lastPage = '';
    this.pmid = '';
    this.publisherLocation = '';
    this.publisherName = '';
    this.volume = '';
    this.year = '';
    this.doi = '';
    this.source = createReferenceAnnotatedValue();
  }
}

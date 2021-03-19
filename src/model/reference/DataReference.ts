import { EditorState } from "prosemirror-state";
import { BackmatterEntity } from "../backmatter-entity";
import { JSONObject } from "../types";
import { getTextContentFromPath } from "../utils";
import { createReferenceAnnotatedValue, deserializeReferenceAnnotatedValue } from "./reference.utils";

export class DataReference extends BackmatterEntity {
  year!: string;
  dataTitle!: EditorState;
  source!: EditorState;
  doi!: string;
  version!: string;
  extLink!: string;
  accessionId!: string;
  specificUse?: string;

  constructor(data?: JSONObject | Element) {
    super();
    this.createEntity(data);
  }
  
  fromJSON(json: JSONObject) {
    this._id = json._id as string || this._id;
    this.dataTitle = json.dataTitle  ? deserializeReferenceAnnotatedValue(json.dataTitle as JSONObject) : createReferenceAnnotatedValue();
    this.year = json.year as string || '';
    this.doi = json.doi as string || '';
    this.extLink = json.extLink as string || '';
    this.accessionId = json.accessionId as string || '';
    this.specificUse = json.specificUse as string;
    this.version = json.version as string || '';
    this.source = json.source ? deserializeReferenceAnnotatedValue(json.source as JSONObject) : createReferenceAnnotatedValue();
  }

  fromXML(referenceXml: Element) {
    const accessionEl = referenceXml.querySelector('pub-id[pub-id-type="accession"]');
    const specificUse = referenceXml.getAttribute('specific-use');
    this.year = getTextContentFromPath(referenceXml, 'year') || '';
    this.source = createReferenceAnnotatedValue(referenceXml.querySelector('source'));
    this.dataTitle = createReferenceAnnotatedValue(referenceXml.querySelector('data-title'));
    this.doi = getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="doi"]') || '';
    this.accessionId = accessionEl?.textContent ? accessionEl.textContent : '';
    this.extLink =
      getTextContentFromPath(referenceXml, 'ext-link') ||
      (accessionEl?.getAttribute('xlink:href')
        ? accessionEl?.getAttribute('xlink:href') as string
        : '');
    this.version = getTextContentFromPath(referenceXml, 'version') || '';
    this.specificUse = ['generated', 'analyzed'].includes(specificUse as string) ? specificUse as string : undefined;
  }

  createBlank() {
    this.dataTitle = createReferenceAnnotatedValue();
    this.year = '';
    this.doi = '';
    this.extLink = '';
    this.accessionId = '';
    this.specificUse = undefined;
    this.version = '';
    this.source = createReferenceAnnotatedValue();
  }
}

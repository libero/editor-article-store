import { cloneDeep } from "lodash";
import {BackmatterEntity} from "../backmatter-entity";
import {JSONObject} from "../types";
import { ReferenceContributor, ReferenceType } from "./types";
import {JournalReference} from "./JournalReference";
import {ConferenceReference} from "./ConferenceReference";
import { BookReference } from "./BookReference";
import {DataReference} from "./DataReference";
import {PreprintReference} from "./PreprintReference";
import {PeriodicalReference} from "./PeriodicalReference";
import {ReportReference} from "./ReportReference";
import {PatentReference} from "./PatentReference";
import {SoftwareReference} from "./SoftwareReference";
import {WebReference} from "./WebReference";
import {ThesisReference} from "./ThesisReference";
import {createReferencePersonList} from "./reference.utils";

export type ReferenceInfoType =
  | JournalReference
  | BookReference
  | ConferenceReference
  | DataReference
  | PeriodicalReference
  | PreprintReference
  | ReportReference
  | PatentReference
  | SoftwareReference
  | WebReference
  | ThesisReference;

export class Reference extends BackmatterEntity {
  authors: Array<ReferenceContributor> = [];
  referenceInfo!: ReferenceInfoType;

  constructor(data?: JSONObject | Element) {
    super();
    this.createEntity(data);
  }

  public get type(): ReferenceType {
    return this._type;
  }

  public set type(value: ReferenceType) {
    this._type = value;
    this.referenceInfo = this.createReferenceInfo();
  }

  private _type: ReferenceType = "journal";

  protected createBlank(): void {
    this._type = "journal";
    this.authors = [];
    this.referenceInfo = this.createReferenceInfo();
  }

  protected fromJSON(json: JSONObject): void {
    this._id = (json._id as string) || this._id;
    this.authors = cloneDeep(json.authors) as ReferenceContributor[];
    this._type = json._type as ReferenceType;
    this.referenceInfo = this.createReferenceInfo(json.referenceInfo as JSONObject);
  }

  protected fromXML(xmlNode: Element): void {
    this._id = (xmlNode.parentNode as Element).getAttribute('id') || this.id;
    this.authors = [...createReferencePersonList(xmlNode, 'author'), ...createReferencePersonList(xmlNode, 'inventor')];
    this._type = xmlNode.getAttribute('publication-type') as ReferenceType;
    this.referenceInfo = this.createReferenceInfo(xmlNode);
  }

  private createReferenceInfo(data?: JSONObject | Element): ReferenceInfoType {
    const refInfoClass = {
      journal: JournalReference,
      book: BookReference,
      periodical: PeriodicalReference,
      report: ReportReference,
      data: DataReference,
      web: WebReference,
      preprint: PreprintReference,
      software: SoftwareReference,
      confproc: ConferenceReference,
      thesis: ThesisReference,
      patent: PatentReference
    }[this.type];

    return new refInfoClass(data);
  }
}

export function createReferencesState(referencesXml: Element[]): Reference[] {
  return referencesXml.map((referenceXml: Element) => {
    return new Reference(referenceXml);
  });
}

import {EditorState} from "prosemirror-state";
import { get } from "lodash";
import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';

import {BackmatterEntity} from "./backmatter-entity";
import * as bioConfig from './config/author-bio.config';
import { JSONObject } from "./types";
import {makeSchemaFromConfig} from "./utils";

export class Person extends BackmatterEntity {

  firstName: string | undefined;
  lastName: string | undefined;
  suffix?: string;
  isAuthenticated?: boolean;
  orcid?: string;
  email?: string;
  bio?: EditorState;
  isCorrespondingAuthor?: boolean;
  affiliations?: string[];
  hasCompetingInterest?: boolean;
  competingInterestStatement?: string;

  constructor(data?: JSONObject | Element, notesXml?: Element) {
    super();
    this.createEntity(data);
    if (get(data, 'ownerDocument') && get(notesXml, 'ownerDocument')) {
      this.setCompetingInterests(data as Element, notesXml as Element);
    }
  }

  protected fromXML(xmlNode: Element): void {}

  protected fromJSON(json: JSONObject): void {
    this._id = (json._id as string) || this.id;
    this.firstName = json.firstName as string || '';
    this.lastName = json.lastName as string || '';
    this.suffix = json.suffix as string || '';
    this.isAuthenticated = !!json.isAuthenticated;
    this.orcid = json.orcid as string  || '';
    this.bio = json.bio
      ? this.createBioEditorStateFromJSON(json.bio as JSONObject)
      : this.createBioEditorStateFromXml();
    this.email = json.email as string || '';
    this.isCorrespondingAuthor = !!json.isCorrespondingAuthor;
    this.affiliations = Array.isArray(json.affiliations) ? (json.affiliations as string[]) : [];
  }

  protected createBlank(): void {
    this.firstName = '';
    this.lastName = '';
    this.suffix = '';
    this.isAuthenticated = false;
    this.orcid = '';
    this.bio = this.createBioEditorStateFromXml();
    this.email = '';
    this.isCorrespondingAuthor = false;
    this.affiliations = [];
  }

  private setCompetingInterests(dataXml: Element, notesXml: Element): void {
    const competingInterestEl = Array.from(notesXml.querySelectorAll('[fn-type="COI-statement"]')).find(
      (fnEl: Element) => {
        const id = fnEl.getAttribute('id');
        return dataXml.querySelector(`xref[ref-type="fn"][rid="${id}"]`);
      }
    );

    this.hasCompetingInterest = competingInterestEl
      ? competingInterestEl.textContent !== 'No competing interests declared'
      : false;
    this.competingInterestStatement = competingInterestEl ? competingInterestEl.textContent!.trim() : '';
  }

  private createBioEditorStateFromXml(bio?: Element): EditorState {
    const schema = makeSchemaFromConfig(bioConfig.topNode, bioConfig.nodes, bioConfig.marks);
    return EditorState.create({
      doc: bio ? ProseMirrorDOMParser.fromSchema(schema).parse(bio) : undefined,
      schema
    });
  }

  private createBioEditorStateFromJSON(json: JSONObject): EditorState {
    const blankState = this.createBioEditorStateFromXml();
    return EditorState.fromJSON(
      {
        schema: blankState.schema,
        plugins: blankState.plugins
      },
      json
    );
  }
}

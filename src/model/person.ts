import {EditorState} from "prosemirror-state";
import {get} from "lodash";
import {DOMParser as ProseMirrorDOMParser} from 'prosemirror-model';
import { DOMImplementation } from "xmldom";

import {BackmatterEntity} from "./backmatter-entity";
import * as bioConfig from './config/author-bio.config';
import {JSONObject} from "./types";
import {getTextContentFromPath, makeSchemaFromConfig} from "./utils";
import {Manuscript} from "./manuscript";
import {serializeManuscriptSection} from "../xml-exporter/manuscript-serializer";
import {Affiliation} from "./affiliation";
import {clearNode} from "../xml-exporter/xml-utils";

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

  constructor(data?: JSONObject | Element, notesXml?: Element | null) {
    super();
    this.createEntity(data);
    if (get(data, 'ownerDocument') && get(notesXml, 'ownerDocument')) {
      this.setCompetingInterests(data as Element, notesXml as Element);
    }
  }

  public toXml(affiliations: Affiliation[] = []): Element {
    const xmlDoc = new DOMImplementation().createDocument(null, null);
    const contrib = xmlDoc.createElement('contrib');
    contrib.setAttribute('contrib-type', 'author');
    contrib.setAttribute('id', this.id);
    if (this.isCorrespondingAuthor) {
      contrib.setAttribute('corresp', 'yes');
    }
  
    const name = xmlDoc.createElement('name');
    contrib.appendChild(name);
    if (this.firstName) {
      const firstName = xmlDoc.createElement('given-names');
      firstName.appendChild(xmlDoc.createTextNode(this.firstName));
      name.appendChild(firstName);
    }
  
    if (this.lastName) {
      const lastName = xmlDoc.createElement('surname');
      lastName.appendChild(xmlDoc.createTextNode(this.lastName));
      name.appendChild(lastName);
    }
  
    if (this.suffix) {
      const suffix = xmlDoc.createElement('suffix');
      suffix.appendChild(xmlDoc.createTextNode(this.suffix));
      name.appendChild(suffix);
    }
  
    if (this.orcid) {
      const orcidEl = xmlDoc.createElement('contrib-id');
      orcidEl.setAttribute('contrib-id-type', 'orcid');
      orcidEl.setAttribute('authenticated', String(this.isAuthenticated));
      orcidEl.appendChild(xmlDoc.createTextNode(`https://orcid.org/${this.orcid}`));
      contrib.appendChild(orcidEl);
    }
  
    if (this.email) {
      const emailEl = xmlDoc.createElement('email');
      emailEl.appendChild(xmlDoc.createTextNode(this.email));
      contrib.appendChild(emailEl);
    }
  
    if (this.bio) {
      const bioXml = xmlDoc.createElement('bio');
      bioXml.appendChild(serializeManuscriptSection(this.bio, xmlDoc));
      contrib.appendChild(bioXml);
    }
  
    (this.affiliations || []).forEach((affId) => {
      const affEl = xmlDoc.createElement('xref');
      affEl.setAttribute('ref-type', 'aff');
      affEl.setAttribute('rid', affId);
      const affLabel = get(affiliations.find(aff => aff.id === affId), 'label');
      if (affLabel) {
        affEl.appendChild(xmlDoc.createTextNode(affLabel));
        contrib.appendChild(affEl);
      }
    });
  
    return contrib
  }

  protected fromXML(xml: Element): void {
    const orcidEl = xml.querySelector('contrib-id[contrib-id-type="orcid"]');

    this._id = xml.getAttribute('id') || this._id;
    this.firstName = getTextContentFromPath(xml, 'name > given-names');
    this.lastName = getTextContentFromPath(xml, 'name > surname');
    this.suffix = getTextContentFromPath(xml, 'name > suffix');
    this.isAuthenticated = orcidEl ? orcidEl.getAttribute('authenticated') === 'true' : false;
    this.orcid = orcidEl ? this.getOrcid(orcidEl.textContent!) : '';
    this.bio = this.createBioEditorStateFromXml(xml.querySelector('bio')!);
    this.email = getTextContentFromPath(xml, 'email');
    this.isCorrespondingAuthor = xml.getAttribute('corresp') === 'yes';
    this.affiliations = Array.from(xml.querySelectorAll('xref[ref-type="aff"]'))
      .map((xRef) => xRef.getAttribute('rid'))
      .filter(Boolean) as string[];
  }

  protected fromJSON(json: JSONObject): void {
    this._id = (json._id as string) || this.id;
    this.firstName = json.firstName as string || '';
    this.lastName = json.lastName as string || '';
    this.suffix = json.suffix as string || '';
    this.isAuthenticated = !!json.isAuthenticated;
    this.orcid = json.orcid as string || '';
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

  private getOrcid(orcidUrl: string): string {
    const matches = orcidUrl.match(/(([0-9]{4}-?){4})/g);
    if (matches) {
      return matches[0];
    }
    return '';
  }
}

export function createAuthorsState(authorsXml: Element[], notesXml?: Element | null): Person[] {
  return authorsXml.map((xml) => new Person(xml, notesXml));
}

export function serializeAuthors(xmlDoc: Document, manuscript: Manuscript) {
  let authorsGroup = xmlDoc.querySelector('article-meta > contrib-group');
  if(!authorsGroup) {
    authorsGroup = xmlDoc.createElement('contrib-group');
    xmlDoc.querySelector('article-meta')!.appendChild(authorsGroup);
  } else {
    clearNode(authorsGroup);
  }

  manuscript.authors.forEach((author: Person) => {
    authorsGroup!.appendChild(author.toXml());
  });
}

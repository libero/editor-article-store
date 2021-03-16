import {EditorState} from 'prosemirror-state';
import {DOMParser as ProseMirrorDOMParser} from 'prosemirror-model';
import {BackmatterEntity} from "./backmatter-entity";
import * as licenseTextConfig from './config/license-text.config';
import {getTextContentFromPath, makeSchemaFromConfig} from "./utils";
import {JSONObject} from "./types";
import {Person} from "./person";
import {get} from 'lodash';
import xmldom from "xmldom";

export const LICENSE_CC_BY_4 = 'CC-BY-4';
export const LICENSE_CC0 = 'CC0';

export class ArticleInformation extends BackmatterEntity {

  articleType: string = '';
  dtd: string = '';
  articleDOI: string = '';
  publisherId: string = '';
  volume: string = '';
  elocationId: string = '';
  subjects: Array<string> = [];
  publicationDate: string = '';
  licenseType: string = '';
  copyrightStatement: string = '';
  licenseText?: EditorState;

  constructor(data?: JSONObject | Element, authors?: Person[]) {
    super();
    this.createEntity(data);
    if (get(data, 'ownerDocument') && authors) {
      this.updateCopyrightStatementFromXml(data as Element, authors);
    }
  }

  public static createLicenseEditorState(content?: Element | null): EditorState {
    const schema = makeSchemaFromConfig(licenseTextConfig.topNode, licenseTextConfig.nodes, licenseTextConfig.marks);
    const xmlContentDocument = new xmldom.DOMImplementation().createDocument('', '', null);
    if (content) {
      xmlContentDocument.appendChild(content);
    }

    return EditorState.create({
      doc: ProseMirrorDOMParser.fromSchema(schema).parse(xmlContentDocument),
      schema
    });
  }

  public updateCopyrightStatement(authors: Person[]): void {
    if (this.licenseType === LICENSE_CC_BY_4) {
      const authorNamesSection =
        authors.length === 1
          ? authors[0].lastName
          : authors.length === 2
          ? `${authors[0].lastName} and ${authors[1].lastName}`
          : authors.length > 2
            ? `${authors[0].lastName} et al`
            : '';

      const date = new Date(this.publicationDate);
      this.copyrightStatement = `© ${!isNaN(date.getTime()) ? date.getFullYear() : ''}, ${authorNamesSection}`;
    } else {
      this.copyrightStatement = '';
    }
  }

  protected fromJSON(json: JSONObject): void {
    this.articleType = json.articleType as string;
    this.dtd = json.dtd as string;
    this.articleDOI = json.articleDOI as string;
    this.elocationId = json.elocationId as string;
    this.volume = json.volume as string;
    this.publisherId = json.publisherId as string;
    this.subjects = (json.subjects as string[]) || [];

    this.licenseType = json.licenseType as string;
    this.publicationDate = json.publicationDate as string;
    const schema = makeSchemaFromConfig(licenseTextConfig.topNode, licenseTextConfig.nodes, licenseTextConfig.marks);
    this.licenseText = EditorState.fromJSON({ schema }, json.licenseText as JSONObject);
  }

  protected fromXML(xmlNode: Element): void {
    this.articleType = getTextContentFromPath(xmlNode, 'article-meta subj-group[subj-group-type="heading"]');
    const articleEl = xmlNode.ownerDocument.querySelector('article');
    this.dtd = articleEl ? articleEl.getAttribute('dtd-version') || '' : '';
    this.articleDOI = getTextContentFromPath(xmlNode, 'article-meta article-id[pub-id-type="doi"]');
    this.elocationId = getTextContentFromPath(xmlNode, 'article-meta elocation-id');
    this.volume = getTextContentFromPath(xmlNode, 'article-meta volume');
    this.publisherId = getTextContentFromPath(xmlNode, 'article-meta article-id[pub-id-type="publisher-id"]');
    this.subjects = Array.from(xmlNode.querySelectorAll('subj-group[subj-group-type="subject"] subject')).map(
      (el: Element) => el.textContent || ''
    );

    this.licenseType = this.getLicenseTypeFromXml(xmlNode);
    this.publicationDate = this.getPublicationDateFromXml(xmlNode);
    this.licenseText = ArticleInformation.createLicenseEditorState(
      xmlNode.querySelector('article-meta permissions license license-p')
    );
  }

  protected createBlank(): void {
    this.articleType = '';
    this.dtd = '';
    this.articleDOI = '';
    this.elocationId = '';
    this.volume = '';
    this.publisherId = '';
    this.subjects = [];

    this.licenseType = '';
    this.publicationDate = '';
    this.licenseText = ArticleInformation.createLicenseEditorState();
  }

  private getLicenseTypeFromXml(doc: Element): string {
    const licenseEl = doc.querySelector('article-meta permissions license');
    if (!licenseEl) {
      return '';
    }
    const href = licenseEl.getAttribute('xlink:href');
    if (href === 'http://creativecommons.org/licenses/by/4.0/') {
      return LICENSE_CC_BY_4;
    }
    if (href === 'http://creativecommons.org/publicdomain/zero/1.0/') {
      return LICENSE_CC0;
    }

    return '';
  }

  private getPublicationDateFromXml(xmlNode: Element): string {
    let publicationDate = '';
    const pubDateNode = xmlNode.querySelector('pub-date[date-type="pub"][publication-format="electronic"]');
    if (pubDateNode) {
      publicationDate = [
        get(pubDateNode.querySelector('year'), 'textContent', ''),
        get(pubDateNode.querySelector('month'), 'textContent', ''),
        get(pubDateNode.querySelector('day'), 'textContent', ''),
      ].join('-');
    }

    return publicationDate;
  }

  private updateCopyrightStatementFromXml(xmlNode: Element, authors: Person[]): void {
    const copyrightStatementFromXml = getTextContentFromPath(xmlNode, 'article-meta permissions copyright-statement');
    if (copyrightStatementFromXml) {
      this.copyrightStatement = copyrightStatementFromXml;
    } else {
      this.updateCopyrightStatement(authors);
    }
  }
}

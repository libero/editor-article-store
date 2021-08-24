import { EditorState } from 'prosemirror-state';
import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';
import { BackmatterEntity } from './backmatter-entity';
import * as licenseTextConfig from './config/license-text.config';
import { getTextContentFromPath, makeSchemaFromConfig } from './utils';
import { JSONObject } from './types';
import { Person } from './person';
import { get } from 'lodash';
import xmldom from 'xmldom';
import { Manuscript } from './manuscript';
import { parseXML } from '../xml-exporter/xml-utils';

type LicenseType = 'CC-BY-4' | 'CC0' | '';

export const LICENSE_CC_BY_4 = 'CC-BY-4';
export const LICENSE_CC0 = 'CC0';

const LICENSE_URL_MAP = {
    'CC-BY-4': 'http://creativecommons.org/licenses/by/4.0/',
    CC0: 'http://creativecommons.org/publicdomain/zero/1.0/',
};

const LICENSE_TEXT_MAP = {
    'CC-BY-4': `This article is distributed under the terms of the 
    <ext-link ext-link-type="uri" xlink:href="http://creativecommons.org/licenses/by/4.0/">
        Creative Commons Attribution License</ext-link>, which permits unrestricted use and redistribution provided that the original author 
    and source are credited.`,
    CC0: `This is an open-access article, free of all copyright, and may be freely reproduced, 
    distributed, transmitted, modified, built upon, or otherwise used by anyone for any lawful purpose.
    The work is made available under the
    <ext-link ext-link-type="uri" xlink:href="http://creativecommons.org/publicdomain/zero/1.0/">Creative Commons CC0 public domain dedication</ext-link>.`,
};

export class ArticleInformation extends BackmatterEntity {
    articleType: string = '';
    dtd: string = '';
    articleDOI: string = '';
    publisherId: string = '';
    volume: string = '';
    elocationId: string = '';
    subjects: Array<string> = [];
    publicationDate: string = '';
    licenseType: LicenseType = '';
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
        const schema = makeSchemaFromConfig(
            licenseTextConfig.topNode,
            licenseTextConfig.nodes,
            licenseTextConfig.marks,
        );
        const xmlContentDocument = new xmldom.DOMImplementation().createDocument('', '', null);
        if (content) {
            xmlContentDocument.appendChild(content);
        }

        return EditorState.create({
            doc: ProseMirrorDOMParser.fromSchema(schema).parse(xmlContentDocument),
            schema,
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

    private createSubjectXml(xmlDoc: Document): Element {
        const subjectGroupXml = xmlDoc.createElement('subj-group');
        subjectGroupXml.setAttribute('subj-group-type', 'major-subject');

        if (this.subjects.length) {
            this.subjects.forEach((subject) => {
                const subjectXml = xmlDoc.createElement('subject');
                subjectXml.appendChild(xmlDoc.createTextNode(subject));
                subjectGroupXml.appendChild(subjectXml);
            });
        }

        return subjectGroupXml;
    }

    private createDoiXml(xmlDoc: Document) {
        const doiXml = xmlDoc.createElement('article-id');
        doiXml.setAttribute('pub-id-type', 'doi');
        doiXml.appendChild(xmlDoc.createTextNode(this.articleDOI));
        return doiXml;
    }

    private createPublisherXml(xmlDoc: Document) {
        const publisherIdXml = xmlDoc.createElement('article-id');
        publisherIdXml.setAttribute('pub-id-type', 'publisher-id');
        publisherIdXml.appendChild(xmlDoc.createTextNode(this.publisherId));
        return publisherIdXml;
    }

    private createElocationIdXml(xmlDoc: Document) {
        const elocationIdXml = xmlDoc.createElement('elocation-id');
        elocationIdXml.appendChild(xmlDoc.createTextNode(this.elocationId));
        return elocationIdXml;
    }

    private createVolumeXml(xmlDoc: Document) {
        const volumeXml = xmlDoc.createElement('volume');
        volumeXml.appendChild(xmlDoc.createTextNode(this.volume));
        return volumeXml;
    }

    private createPublicationDateXml(xmlDoc: Document) {
        const [year, month, day] = this.publicationDate.split('-');
        const pubdateXml = xmlDoc.createElement('pub-date');
        pubdateXml.setAttribute('date-type', 'publication');
        pubdateXml.setAttribute('publication-format', 'electronic');
        pubdateXml.setAttribute('iso-8601-date', this.publicationDate.replace(/-+$/, ''));

        if (!year) {
            return;
        }

        const yearXml = xmlDoc.createElement('year');
        yearXml.appendChild(xmlDoc.createTextNode(year));
        pubdateXml.appendChild(yearXml);

        if (month) {
            const monthXml = xmlDoc.createElement('month');
            monthXml.appendChild(xmlDoc.createTextNode(month));
            pubdateXml.appendChild(monthXml);
        }

        if (day) {
            const dayXml = xmlDoc.createElement('day');
            dayXml.appendChild(xmlDoc.createTextNode(day));
            pubdateXml.appendChild(dayXml);
        }

        return pubdateXml;
    }

    private createLicenseXml(xmlDoc: Document) {
        if (!this.licenseType) return;
        const licenseXml = xmlDoc.createElement('license');
        licenseXml.setAttribute('xlink:href', LICENSE_URL_MAP[this.licenseType]);
        const licenseRef = xmlDoc.createElement('ali:license_ref');
        licenseRef.appendChild(xmlDoc.createTextNode(LICENSE_URL_MAP[this.licenseType]));
        licenseXml.appendChild(licenseRef);

        if (this.licenseType) {
            const licenseText = parseXML(
                '<wrapperNode xmlns:xlink="http://www.w3.org/1999/xlink"><license-p>' +
                    LICENSE_TEXT_MAP[this.licenseType] +
                    '</license-p></wrapperNode>',
            );

            licenseXml.appendChild(licenseText?.documentElement?.querySelector('license-p') as Element);
        }

        return licenseXml;
    }

    private createPermissionsXml(xmlDoc: Document) {
        const permissionsXml = xmlDoc.createElement('permissions');

        if (this.copyrightStatement) {
            const copyrightStatementXml = xmlDoc.createElement('copyright-statement');
            copyrightStatementXml.appendChild(xmlDoc.createTextNode(this.copyrightStatement));
            permissionsXml.appendChild(copyrightStatementXml);

            const copyrightHolder = this.copyrightStatement.split(',')[1]?.trim();

            if (copyrightHolder) {
                const copyrightHolderXml = xmlDoc.createElement('copyright-holder');
                copyrightHolderXml.appendChild(xmlDoc.createTextNode(copyrightHolder));
                permissionsXml.appendChild(copyrightHolderXml);
            }


            const [year] = this.publicationDate.split('-');
            const copyrightYearXml = xmlDoc.createElement('copyright-year');
            copyrightYearXml.appendChild(xmlDoc.createTextNode(year));
            permissionsXml.appendChild(copyrightYearXml);
        }
        permissionsXml.appendChild(xmlDoc.createElement('ali:free_to_read'));

        const licenseXml = this.createLicenseXml(xmlDoc);

        if (licenseXml) {
            permissionsXml.appendChild(licenseXml);
        }

        return permissionsXml;
    }

    public toXml() {
        const xmlDoc = new xmldom.DOMImplementation().createDocument(null, null);
        return {
            subjects: this.createSubjectXml(xmlDoc),
            articleDOI: this.createDoiXml(xmlDoc),
            publisherId: this.createPublisherXml(xmlDoc),
            elocationId: this.createElocationIdXml(xmlDoc),
            volume: this.createVolumeXml(xmlDoc),
            publicationDate: this.createPublicationDateXml(xmlDoc),
            permissions: this.createPermissionsXml(xmlDoc),
        };
    }

    protected fromJSON(json: JSONObject): void {
        this.articleType = json.articleType as string;
        this.dtd = json.dtd as string;
        this.articleDOI = json.articleDOI as string;
        this.elocationId = json.elocationId as string;
        this.volume = json.volume as string;
        this.publisherId = json.publisherId as string;
        this.subjects = (json.subjects as string[]) || [];

        this.licenseType = json.licenseType as LicenseType;
        this.publicationDate = json.publicationDate as string;
        const schema = makeSchemaFromConfig(
            licenseTextConfig.topNode,
            licenseTextConfig.nodes,
            licenseTextConfig.marks,
        );
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
        this.subjects = Array.from(xmlNode.querySelectorAll('subj-group[subj-group-type="major-subject"] subject')).map(
            (el: Element) => el.textContent || '',
        );

        this.licenseType = this.getLicenseTypeFromXml(xmlNode);
        this.publicationDate = this.getPublicationDateFromXml(xmlNode);
        this.licenseText = ArticleInformation.createLicenseEditorState(
            xmlNode.querySelector('article-meta permissions license license-p'),
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

    private getLicenseTypeFromXml(doc: Element): LicenseType {
        const licenseEl = doc.querySelector('article-meta permissions license');
        if (!licenseEl) {
            return '';
        }
        const href = licenseEl.getAttribute('xlink:href');
        if (href === LICENSE_URL_MAP[LICENSE_CC_BY_4]) {
            return LICENSE_CC_BY_4;
        }
        if (href === LICENSE_URL_MAP[LICENSE_CC0]) {
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
        const copyrightStatementFromXml = getTextContentFromPath(
            xmlNode,
            'article-meta permissions copyright-statement',
        );
        if (copyrightStatementFromXml) {
            this.copyrightStatement = copyrightStatementFromXml;
        } else {
            this.updateCopyrightStatement(authors);
        }
    }
}

export function serializeArticleInformaion(xmlDoc: Document, manuscript: Manuscript) {
    const xmlFragments = manuscript.articleInfo.toXml();
    const documentElement = xmlDoc.documentElement;

    documentElement
        .querySelector('subj-group[subj-group-type="major-subject"]')
        ?.replaceWith(xmlFragments.subjects || '');
    documentElement
        .querySelector('article-meta article-id[pub-id-type="doi"]')
        ?.replaceWith(xmlFragments.articleDOI || '');
    documentElement
        .querySelector('article-meta article-id[pub-id-type="publisher-id"]')
        ?.replaceWith(xmlFragments.publisherId);
    documentElement.querySelector('article-meta elocation-id')?.replaceWith(xmlFragments.elocationId || '');
    documentElement.querySelector('article-meta volume')?.replaceWith(xmlFragments.volume || '');
    documentElement
        .querySelector('pub-date[date-type="pub"][publication-format="electronic"]')
        ?.replaceWith(xmlFragments.publicationDate || '');
    documentElement.querySelector('article-meta permissions')?.replaceWith(xmlFragments.permissions || '');
}

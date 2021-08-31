import { cloneDeep, get } from 'lodash';
import { BackmatterEntity } from '../backmatter-entity';
import { JSONObject } from '../types';
import { ReferenceContributor, ReferenceType } from './types';
import { JournalReference } from './JournalReference';
import { ConferenceReference } from './ConferenceReference';
import { BookReference } from './BookReference';
import { DataReference } from './DataReference';
import { PreprintReference } from './PreprintReference';
import { PeriodicalReference } from './PeriodicalReference';
import { ReportReference } from './ReportReference';
import { PatentReference } from './PatentReference';
import { SoftwareReference } from './SoftwareReference';
import { WebReference } from './WebReference';
import { ThesisReference } from './ThesisReference';
import { createReferencePersonList, serializeReferenceContributorsList } from './reference.utils';
import { Manuscript } from '../manuscript';
import { clearNode } from '../../xml-exporter/xml-utils';

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

    toXml(listIndex: number): Element {
        const elementCitation = this.referenceInfo.toXml();
        const authorsXml = serializeReferenceContributorsList(
            this.type === 'patent' ? 'inventor' : 'author',
            this.authors,
        );
        elementCitation.insertBefore(authorsXml, elementCitation.firstChild);
        const refElement = elementCitation.ownerDocument.createElement('ref');
        refElement.setAttribute('id', `bib${listIndex}`);
        refElement.appendChild(elementCitation);
        return refElement;
    }

    private _type: ReferenceType = 'journal';

    protected createBlank(): void {
        this._type = 'journal';
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
        this.authors = [
            ...createReferencePersonList(xmlNode, 'author'),
            ...createReferencePersonList(xmlNode, 'inventor'),
        ];
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
            patent: PatentReference,
        }[this.type];

        return new refInfoClass(data);
    }
}

export function createReferencesState(referencesXml: Element[]): Reference[] {
    return referencesXml.map((referenceXml: Element) => {
        return new Reference(referenceXml);
    });
}
function getAuthorLastNamesForSorting(ref: Reference): string {
    return ref.authors.length > 0
        ? ref.authors
              .map((refAuthor) => {
                  return get(refAuthor, 'groupName', get(refAuthor, 'lastName'));
              })
              .join('')
              .toLowerCase()
        : '';
}

function sortReferencesList(refs: Reference[]): Reference[] {
    return [...refs].sort((ref1, ref2) => {
        const ref1LastNames = getAuthorLastNamesForSorting(ref1);
        const ref2LastNames = getAuthorLastNamesForSorting(ref2);
        if (ref1LastNames < ref2LastNames) {
            return -1;
        } else if (ref1LastNames > ref2LastNames) {
            return 1;
        } else {
            if (get(ref1, 'referenceInfo.year', '') < get(ref2, 'referenceInfo.year', '')) {
                return -1;
            } else if (get(ref1, 'referenceInfo.year', '') > get(ref2, 'referenceInfo.year', '')) {
                return 1;
            }
        }
        return 0;
    });
}

export function serializeReferenceState(xmlDoc: Document, manuscript: Manuscript) {
    let refList = xmlDoc.querySelector('ref-list');
    if (!refList) {
        refList = xmlDoc.createElement('ref-list');
        xmlDoc.querySelector('article back')?.appendChild(refList);
    } else {
        clearNode(refList);
    }

    const title = xmlDoc.createElement('title');
    title.appendChild(xmlDoc.createTextNode('References'));
    refList.appendChild(title);
    const sortedReferences = sortReferencesList(manuscript.references);

    sortedReferences.forEach((ref: Reference, index: number) => {
        const refId = index + 1;
        refList?.appendChild(ref.toXml(refId));
        const xmlBody = xmlDoc.querySelector('body');
        if (xmlBody) {
            xmlBody.querySelectorAll(`xref[rid="${ref.id}"]`).forEach((el) => {
                el.setAttribute('rid', `bib${refId}`);
            });
        }
    });
}

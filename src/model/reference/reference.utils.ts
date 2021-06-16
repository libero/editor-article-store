import { EditorState } from 'prosemirror-state';
import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';
import { getTextContentFromPath, makeSchemaFromConfig } from '../utils';
import { ReferenceContributor } from './types';
import * as referenceInfoConfig from '../config/reference-info.config';
import xmldom, { DOMImplementation } from 'xmldom';
import { JSONObject } from '../types';
import { get, has } from 'lodash';

const referenceInfoSchema = makeSchemaFromConfig(
    referenceInfoConfig.topNode,
    referenceInfoConfig.nodes,
    referenceInfoConfig.marks,
);

export function createReferencePersonList(referenceXml: Element, groupType: string): ReferenceContributor[] {
    const contributors = referenceXml.querySelector(`person-group[person-group-type=${groupType}]`);
    if (!contributors) {
        return [];
    }

    return Array.from(contributors.children).map((contributorXml) => {
        if (contributorXml.nodeName.toLowerCase() === 'name') {
            return {
                firstName: getTextContentFromPath(contributorXml, 'given-names') || '',
                lastName: getTextContentFromPath(contributorXml, 'surname') || '',
            };
        } else {
            return {
                groupName: contributorXml.textContent?.trim(),
            };
        }
    });
}

export function serializeReferenceContributorsList(groupType: string, contributors: ReferenceContributor[]): Element {
    const xmlDoc = new DOMImplementation().createDocument(null, null);
    const contributorsXml = xmlDoc.createElement('person-group');
    contributorsXml.setAttribute('person-group-type', groupType);

    contributors.forEach((refContributor) => {
        if (has(refContributor, 'groupName')) {
            const collab = xmlDoc.createElement('collab');
            collab.appendChild(xmlDoc.createTextNode(get(refContributor, 'groupName')));
            contributorsXml.appendChild(collab);
        } else {
            const name = xmlDoc.createElement('name');
            const givenNames = xmlDoc.createElement('given-names');
            givenNames.appendChild(xmlDoc.createTextNode(get(refContributor, 'firstName')));
            name.appendChild(givenNames);

            const surname = xmlDoc.createElement('surname');
            surname.appendChild(xmlDoc.createTextNode(get(refContributor, 'lastName')));
            name.appendChild(surname);

            contributorsXml.appendChild(name);
        }
    });

    return contributorsXml;
}

export function createReferenceAnnotatedValue(content?: Node | null): EditorState {
    const xmlContentDocument = new xmldom.DOMImplementation().createDocument('', '', null);

    if (content) {
        xmlContentDocument.appendChild(content);
    }

    return EditorState.create({
        doc: ProseMirrorDOMParser.fromSchema(referenceInfoSchema).parse(xmlContentDocument),
        schema: referenceInfoSchema,
    });
}

export function deserializeReferenceAnnotatedValue(json: JSONObject): EditorState {
    return EditorState.fromJSON(
        {
            schema: referenceInfoSchema,
        },
        json,
    );
}

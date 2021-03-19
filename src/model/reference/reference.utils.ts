import { EditorState } from "prosemirror-state";
import {DOMParser as ProseMirrorDOMParser} from 'prosemirror-model';
import { getTextContentFromPath, makeSchemaFromConfig } from "../utils";
import { ReferenceContributor } from "./types";
import * as referenceInfoConfig from '../config/reference-info.config';
import xmldom from "xmldom";
import { JSONObject } from "../types";

const referenceInfoSchema = makeSchemaFromConfig(
  referenceInfoConfig.topNode,
  referenceInfoConfig.nodes,
  referenceInfoConfig.marks
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
        lastName: getTextContentFromPath(contributorXml, 'surname') || ''
      };
    } else {
      return {
        groupName: contributorXml.textContent?.trim()
      };
    }
  });
}

export function createReferenceAnnotatedValue(content?: Node | null): EditorState {
  const xmlContentDocument = new xmldom.DOMImplementation().createDocument('', '', null);

  if (content) {
    xmlContentDocument.appendChild(content);
  }

  return EditorState.create({
    doc: ProseMirrorDOMParser.fromSchema(referenceInfoSchema).parse(xmlContentDocument),
    schema: referenceInfoSchema
  });
}

export function deserializeReferenceAnnotatedValue(json: JSONObject): EditorState {
  return EditorState.fromJSON(
    {
      schema: referenceInfoSchema,
    },
    json
  );
}
import { pick, get } from 'lodash';
import {Node as ProsemirrorNode, Schema, SchemaSpec} from 'prosemirror-model';

import { nodes } from './config/nodes';
import { marks } from './config/marks';
import {Manuscript} from "./manuscript";

export function makeSchemaFromConfig(topNode: string, nodeNames: string[], markNames: string[]): Schema {
  const filteredNodes = pick(nodes, nodeNames);
  const filteredMarks = pick(marks, markNames);

  return new Schema({
    nodes: filteredNodes,
    marks: filteredMarks,
    topNode
  } as SchemaSpec<keyof typeof filteredNodes, keyof typeof filteredMarks>);
}

export function getTextContentFromPath(el: ParentNode, path: string): string {
  return (get(el.querySelector(path), 'textContent', '') as string).trim();
}

export function getAllFigureAssets(manuscript: Manuscript): Record<string, string> {
  const result = {} as Record<string, string>;
  manuscript.body.doc.descendants((node: ProsemirrorNode) => {
    if (node.type.name === 'figure') {
      result[node.attrs.id] = node.attrs.img;
    }
    return Boolean(node.childCount);
  });

  return result;
}

import { cloneDeepWith } from 'lodash';
import { EditorState } from 'prosemirror-state';
import {JSONObject, Manuscript} from './manuscript';
import {ProsemirrorChange} from "./history/prosemirror-change";
import { Change } from './history/change';
import {BatchChange} from "./history/batch-change";

export function manuscriptEntityToJson<T>(object: T): JSONObject {
  return cloneDeepWith(object, (value) => {
    if (value instanceof EditorState) {
      return value.toJSON();
    }
  });
}

export function deserializeChanges(changesJson: JSONObject[]): Array<Change>  {
  return changesJson.map((changeData) => {
    switch (changeData.type) {
      case 'prosemirror':
        return ProsemirrorChange.fromJSON(changeData);
      case 'batch':
        return BatchChange.fromJSON(changeData);

      default:
        return null;
    }
  }).filter(Boolean) as Change[];
}

export function cloneManuscript(manuscript: Manuscript): Manuscript {
  const cloneCustomizer = (value: any): EditorState | undefined => (value instanceof EditorState ? value : undefined);
  return cloneDeepWith(manuscript, cloneCustomizer);
}

//
// export function deserializeBackmatter(path: string, json: JSONObject): BackmatterEntity {
//   if (path.indexOf('affiliations') >= 0) {
//     return new Affiliation(json);
//   }
//
//   if (path.indexOf('authors') >= 0) {
//     return new Person(json);
//   }
//
//   if (path.indexOf('references') >= 0) {
//     return new Reference(json);
//   }
//
//   if (path.indexOf('relatedArticles') >= 0) {
//     return new RelatedArticle(json);
//   }
//
//   if (path.match(/keywordGroups\.[^.]+\.keywords/)) {
//     return new Keyword(json);
//   }
//   throw new Error(`deserialization of backmatter entity for  ${path} is not implemented or provided path is invalid`);
// }

export function applyChangesToManuscript(manuscript: Manuscript, changesJson: JSONObject[]): Manuscript {
  const allChanges = new BatchChange(deserializeChanges(changesJson) as Change[]);
  return allChanges.applyChange(manuscript);
}

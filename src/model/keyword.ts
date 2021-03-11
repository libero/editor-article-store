import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';
import * as keywordConfig from './config/keywords.config';
import { BackmatterEntity } from './backmatter-entity';
import { EditorState } from 'prosemirror-state';
import { JSONObject } from './types';
import { makeSchemaFromConfig } from './utils';
import { set } from 'lodash';

export class Keyword extends BackmatterEntity {
  content: EditorState | undefined;

  constructor(data?: JSONObject | Element | EditorState) {
    super();
    if (data instanceof EditorState) {
      this.content = data;
    } else {
      this.createEntity(data);
    }
  }

  protected fromXML(xmlNode: Element): void {
    const schema = makeSchemaFromConfig(keywordConfig.topNode, keywordConfig.nodes, keywordConfig.marks);
    this.content = EditorState.create({
      doc: ProseMirrorDOMParser.fromSchema(schema).parse(xmlNode),
      schema,
    });
  }

  protected fromJSON(json: JSONObject): void {
    this._id = (json._id as string) || this._id;
    const blankState = this.createEmptyEditorState();
    this.content = EditorState.fromJSON(
      { schema: blankState.schema,  },
      json.content as JSONObject
    );
  }

  protected createBlank(): void {
    this.content = this.createEmptyEditorState();
  }
  
  private createEmptyEditorState(): EditorState {
    const schema = makeSchemaFromConfig(keywordConfig.topNode, keywordConfig.nodes, keywordConfig.marks);
    return EditorState.create({
      doc: undefined,
      schema
    });
  }
}

export interface KeywordGroup {
  title: string | undefined;
  keywords: Keyword[];
  newKeyword: Keyword;
}

export interface KeywordGroups {
  [keywordType: string]: KeywordGroup;
}

export function createKeywordGroupsState(keywordGroupsXml: Element[]): KeywordGroups {
  return keywordGroupsXml.reduce((acc, kwdGroup) => {
    const kwdGroupType = kwdGroup.getAttribute('kwd-group-type') || 'keywords-1';
    const groupTitle = kwdGroup.querySelector('title');
    const moreKeywords = Array.from(kwdGroup.querySelectorAll('kwd')).map(
      (keywordEl: Element, _) => new Keyword(keywordEl)
    );
    set(acc, 
      kwdGroupType,
      {
        title: groupTitle ? groupTitle.textContent : undefined,
        keywords: moreKeywords,
        newKeyword: new Keyword()
      });

    return acc;
  }, {});
}
import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';
import * as keywordConfig from './config/keywords.config';
import { BackmatterEntity } from './backmatter-entity';
import { EditorState } from 'prosemirror-state';
import { JSONObject } from './types';
import { makeSchemaFromConfig } from './utils';

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
  protected fromJSON(json: JSONObject): void {}
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
import { manuscriptEntityToJson, deserializeChanges, cloneManuscript, applyChangesToManuscript } from '../../../src/model/changes.utils';
import { EditorState } from 'prosemirror-state';
import { Schema } from "prosemirror-model"
import {Manuscript} from "../../../src/model/manuscript";

const textSchema = new Schema({
  nodes: {
    text: {},
    doc: {content: "text*"}
  }
});

const mockBatchChange = {
  "type": "batch",
  "changes": [
        {
          "type": "update-object",
          "timestamp": 1613407407221,
          "path": "references.1",
          "differences": [
            {
              "kind": "E",
              "path": [
                "authors",
                5,
                "lastName"
              ],
              "lhs": "Foo",
              "rhs": "Foox"
            }
          ]
        },
    {
      "type": "prosemirror",
      "timestamp": 1613407407225,
      "path": "body",
      "transactionSteps": [
        {
          "stepType": "replace",
          "from": 30584,
          "to": 30585,
          "slice": {
            "content": [
              {
                "type": "refCitation",
                "attrs": {
                  "refId": "bib2",
                  "refText": "Foox et al., 2011"
                }
              }
            ]
          }
        }
      ]
    }
  ],
  "timestamp": 1613407407225
};
const mockProsemirrorChange = {
  "_id": "601927c84892502637b7dcf7",
  "type": "prosemirror",
  "timestamp": 1612261319184,
  "path": "body",
  "transactionSteps": [
    {
      "stepType": "replace",
      "from": 0,
      "to": 0,
      "slice": {
        "content": [
          {
            text: "some new text",
            type: "text"
          }
        ]
      }
    }
  ],
  "user": "static-for-now",
  "applied": false,
  "articleId": "60263"
}

const mockManuscript: Manuscript = {
  journalMeta: { publisherName: 'foo', issn: 'bar'},
  title: EditorState.create({ schema: textSchema}),
  abstract: EditorState.create({ schema: textSchema}),
  impactStatement: EditorState.create({ schema: textSchema}),
  body: EditorState.create({ schema: textSchema}),
  acknowledgements: EditorState.create({ schema: textSchema}),
  relatedArticles: []
};

describe('manuscriptEntityToJson', () => {
  it('returns expected JSON object when passed object with EditorState values', () => {
    const testObject = {
      a: EditorState.create({ schema: textSchema}),
      b: EditorState.create({ schema: textSchema}),
      c: 'foo'
    };
    const expectedSchemaToJSONOutput = {
      "doc": {
        "type": "doc",
      },
      "selection":  {
        "anchor": 0,
        "head": 0,
        "type": "text",
      },
    };
    expect(manuscriptEntityToJson(testObject)).toMatchObject({ 
      "a": {...expectedSchemaToJSONOutput},
      "b": {...expectedSchemaToJSONOutput},
     })
  });
  it('returns an empty object when passed an empty object', () => {
    expect(manuscriptEntityToJson({})).toMatchObject({});
  });
  it('returns an empty object when none of objects properties are EditorState', () => {
    expect(manuscriptEntityToJson({ foo: 'a', bar: 'b' })).toMatchObject({});
  })
});

describe('deserializeChanges', () => {
  it('deserializes batch changes as expected', () => {
    expect(JSON.stringify(deserializeChanges([mockBatchChange]))).toBe('[{"type":"batch","changes":[{"type":"prosemirror","timestamp":1613407407225,"path":"body","transactionSteps":[{"stepType":"replace","from":30584,"to":30585,"slice":{"content":[{"type":"refCitation","attrs":{"refId":"bib2","refText":"Foox et al., 2011"}}]}}]}],"timestamp":1613407407225}]')
  });
  it('deserializes prosemirror changes as expected', () => {
    expect(JSON.stringify(deserializeChanges([mockProsemirrorChange]))).toBe('[{"type":"prosemirror","timestamp":1612261319184,"path":"body","transactionSteps":[{"stepType":"replace","from":0,\"to\":0,\"slice\":{\"content\":[{\"text\":\"some new text\",\"type\":\"text\"}]}}]}]')
  });

  it('filters out none batch/prosemirror changes', () => {
    expect(JSON.stringify(deserializeChanges([mockProsemirrorChange, {
      "type": "update-object",
      "timestamp": 1613407407221,
      "path": "references.1",
      "differences": [
        {
          "kind": "E",
          "path": [
            "authors",
            5,
            "lastName"
          ],
          "lhs": "Foo",
          "rhs": "Foox"
        }
      ]
    }]))).toBe('[{"type":"prosemirror","timestamp":1612261319184,"path":"body","transactionSteps":[{"stepType":"replace","from":0,"to":0,"slice":{"content":[{"text":"some new text","type":"text"}]}}]}]')
  });

  it('returns an empty array when passed an empty array', () => {
    expect(deserializeChanges([])).toMatchObject([]);
  })
});

describe('cloneManuscript', () => {
  it('returns a clone of the manuscript passed', () => {
    const clonedManuscript = cloneManuscript(mockManuscript);
    expect(clonedManuscript).not.toBe(mockManuscript);
    expect(clonedManuscript).toMatchObject(mockManuscript);
  });
});

describe('applyChangesToManuscript', () => {
  it('applies a given set of changes to a manuscript', () => {
    expect(JSON.stringify(mockManuscript.body.doc.content)).toBe("null");
    const appliedChanges = applyChangesToManuscript(mockManuscript, [mockProsemirrorChange]);
    expect(JSON.stringify(appliedChanges.body.doc.content)).toBe('[{"type":"text","text":"some new text"}]');
  });
});

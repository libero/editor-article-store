import { manuscriptEntityToJson, deserializeChanges, cloneManuscript } from '../../../src/model/changes.utils';
import { EditorState } from 'prosemirror-state';
import { Schema } from "prosemirror-model"

const textSchema = new Schema({
  nodes: {
    text: {},
    doc: {content: "text*"}
  }
});

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
  const mockBatchChange = 
      {
        "type": "batch",
        "changes": [
          {
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
              }
            ],
            "timestamp": 1613407407221
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
        "from": 4329,
        "to": 4331
      }
    ],
    "user": "static-for-now",
    "applied": false,
    "articleId": "60263"
  }
  it('deserializes batch changes as expected', () => {
    expect(JSON.stringify(deserializeChanges([mockBatchChange]))).toBe('[{"type":"batch","changes":[{"type":"prosemirror","timestamp":1613407407225,"path":"body","transactionSteps":[{"stepType":"replace","from":30584,"to":30585,"slice":{"content":[{"type":"refCitation","attrs":{"refId":"bib2","refText":"Foox et al., 2011"}}]}}]}],"timestamp":1613407407225}]')
  });
  it('deserializes prosemirror changes as expected', () => {
    expect(JSON.stringify(deserializeChanges([mockProsemirrorChange]))).toBe('[{"type":"prosemirror","timestamp":1612261319184,"path":"body","transactionSteps":[{"stepType":"replace","from":4329,"to":4331}]}]')
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
    }]))).toBe('[{"type":"prosemirror","timestamp":1612261319184,"path":"body","transactionSteps":[{"stepType":"replace","from":4329,"to":4331}]}]')
  });

  it('returns an empty array when passed an empty array', () => {
    expect(deserializeChanges([])).toMatchObject([]);
  })
});

describe('cloneManuscript', () => {
  it('returns a clone of the manuscript passed', () => {
    const manuscript = {
        journalMeta: { publisherName: 'foo', issn: 'bar'},
        title: EditorState.create({ schema: textSchema}),
        abstract: EditorState.create({ schema: textSchema}),
        impactStatement: EditorState.create({ schema: textSchema}),
        body: EditorState.create({ schema: textSchema}),
        acknowledgements: EditorState.create({ schema: textSchema}),
    };
    const clonedManuscript = cloneManuscript(manuscript);
    expect(clonedManuscript).not.toBe(manuscript);
    expect(clonedManuscript).toMatchObject(manuscript);
  });
});
import { RelatedArticle } from "../../../src/model/related-article"
import { deserializeBackmatter, manuscriptEntityToJson, deserializeChanges, cloneManuscript, applyChangesToManuscript } from '../../../src/model/changes.utils';
import { EditorState } from 'prosemirror-state';
import { Schema } from "prosemirror-model"
import {Manuscript} from "../../../src/model/manuscript";
import { BatchChange } from "../../../src/model/history/batch-change";
import { ProsemirrorChange } from "../../../src/model/history/prosemirror-change";
import { AddObjectChange } from "../../../src/model/history/add-object-change";
import { DeleteObjectChange } from "../../../src/model/history/delete-object-change";

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

const mockAddObjectChange = {
  "type": "add-object",
  "timestamp": 1614097785693,
  "path": "relatedArticles",
  "idField": "id",
  "object": {
    "_id": "ad319b14-c312-4627-a5a1-d07a548a6e7e",
    "articleType": "article-reference",
    "href": "111111"
  } 
};

const mockDeleteObjectChange = {
  "type": "delete-object",
  "timestamp": 1614097785693,
  "path": "relatedArticles",
  "idField": "id",
  "object": {
    "_id": "ad319b14-c312-4627-a5a1-d07a548a6e7f",
    "articleType": "article-reference",
    "href": "222222"
  } 
};

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
    const deserializedChanges = deserializeChanges([mockBatchChange]);
    expect(deserializedChanges[0]).toBeInstanceOf(BatchChange);
    expect(JSON.stringify(deserializedChanges)).toBe('[{"type":"batch","changes":[{"type":"prosemirror","timestamp":1613407407225,"path":"body","transactionSteps":[{"stepType":"replace","from":30584,"to":30585,"slice":{"content":[{"type":"refCitation","attrs":{"refId":"bib2","refText":"Foox et al., 2011"}}]}}]}],"timestamp":1613407407225}]');
  });
  it('deserializes prosemirror changes as expected', () => {
    const deserializedChanges = deserializeChanges([mockProsemirrorChange]);
    expect(deserializedChanges[0]).toBeInstanceOf(ProsemirrorChange);
    expect(JSON.stringify(deserializedChanges)).toBe('[{"type":"prosemirror","timestamp":1612261319184,"path":"body","transactionSteps":[{"stepType":"replace","from":0,\"to\":0,\"slice\":{\"content\":[{\"text\":\"some new text\",\"type\":\"text\"}]}}]}]');
  });
  it('deserializes add-object changes as expected', () => {
    const deserializedChanges = deserializeChanges([mockAddObjectChange]);
    expect(deserializedChanges[0]).toBeInstanceOf(AddObjectChange);
    expect(JSON.stringify(deserializedChanges)).toBe('[{"type":"add-object","timestamp":1614097785693,"path":"relatedArticles","idField":"id","object":{"_id":"ad319b14-c312-4627-a5a1-d07a548a6e7e","articleType":"article-reference","href":"111111"}}]');
  });
  it('deserializes delete-object changes as expected', () => {
    const deserializedChanges = deserializeChanges([mockDeleteObjectChange]);
    expect(deserializedChanges[0]).toBeInstanceOf(DeleteObjectChange);
    expect(JSON.stringify(deserializedChanges)).toBe('[{"type":"delete-object","timestamp":1614097785693,"path":"relatedArticles","idField":"id","object":{"_id":"ad319b14-c312-4627-a5a1-d07a548a6e7f","articleType":"article-reference","href":"222222"}}]');
  });
  it('filters out unsupported change types', () => {
    expect(JSON.stringify(deserializeChanges([mockProsemirrorChange, {
      "type": "some-unsupported-change",
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
    const addObjToBeRemoved = {"type":"add-object","timestamp":1614266180919,"path":"relatedArticles","idField":"id","object":{"_id":"73144bb5-660b-4b1e-90eb-de6d315315bf","articleType":"article-reference","href":"dsdsfsdfsd"}};
    const removeObj = {"type":"delete-object","timestamp":1614266187541,"path":"relatedArticles","removedIndex":1,"idField":"id","object":{"_id":"73144bb5-660b-4b1e-90eb-de6d315315bf","articleType":"article-reference","href":"dsdsfsdfsd"}};
    const appliedChanges = applyChangesToManuscript(mockManuscript, [mockProsemirrorChange, mockAddObjectChange, addObjToBeRemoved, removeObj ]);
    expect(JSON.stringify(appliedChanges.body.doc.content)).toBe('[{"type":"text","text":"some new text"}]');
    expect(appliedChanges.relatedArticles).toEqual([{
      "_id": "ad319b14-c312-4627-a5a1-d07a548a6e7e",
      "articleType": "article-reference",
      "href": "111111"
    }]);
  });
});

describe('deserializeBackmatter', () => {
  it('returns a relatedArticle object when passed relatedArticles backmatter JSON', () => {
    const relatedArticle = deserializeBackmatter('relatedArticles', {
      "_id": "ad319b14-c312-4627-a5a1-d07a548a6e7e",
      "articleType": "article-reference",
      "href": "111111"
    });
    expect(relatedArticle).toBeInstanceOf(RelatedArticle);
    expect(relatedArticle).toEqual(expect.objectContaining({
      "_id": "ad319b14-c312-4627-a5a1-d07a548a6e7e",
      "articleType": "article-reference",
      "href": "111111"
    }));
  });
  it('throws correct error if passed invalid path', () => {
    expect(() => deserializeBackmatter('foo', {
      "bar" : "bar"
    })).toThrow('deserialization of backmatter entity for foo is not implemented or provided path is invalid');
  });
});

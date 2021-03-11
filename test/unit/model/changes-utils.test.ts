import {RelatedArticle} from "../../../src/model/related-article"
import {
  applyChangesToManuscript,
  cloneManuscript,
  deserializeBackmatter,
  deserializeChanges,
  manuscriptEntityToJson
} from '../../../src/model/changes.utils';
import {EditorState} from 'prosemirror-state';
import {Schema} from "prosemirror-model"
import {Manuscript} from "../../../src/model/manuscript";
import {BatchChange} from "../../../src/model/history/batch-change";
import {ProsemirrorChange} from "../../../src/model/history/prosemirror-change";
import {AddObjectChange} from "../../../src/model/history/add-object-change";
import {DeleteObjectChange} from "../../../src/model/history/delete-object-change";
import {UpdateObjectChange} from "../../../src/model/history/update-object-change";
import {Person} from "../../../src/model/person";
import { Keyword } from "../../../src/model/keyword";
import {ArticleInformation} from "../../../src/model/article-information";

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
};

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

const mockUpdateObjectChange = {
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
};

const mockManuscript: Manuscript = {
  authors: [],
  articleInfo: new ArticleInformation(),
  journalMeta: { publisherName: 'foo', issn: 'bar'},
  title: EditorState.create({ schema: textSchema}),
  abstract: EditorState.create({ schema: textSchema}),
  impactStatement: EditorState.create({ schema: textSchema}),
  body: EditorState.create({ schema: textSchema}),
  acknowledgements: EditorState.create({ schema: textSchema}),
  keywordGroups: {},
  relatedArticles: [],
  affiliations: []
};

const createProsemirrorChange = (path:string, value:string) => ({
  "_id": "601927c84892502637b7dcf7",
  "type": "prosemirror",
  "timestamp": 1612261319184,
  "path": path,
  "transactionSteps": [
    {
      "stepType": "replace",
      "from": 0,
      "to": 0,
      "slice": {
        "content": [
          {
            text: value,
            type: "text"
          }
        ]
      }
    }
  ],
  "user": "static-for-now",
  "applied": false,
  "articleId": "60263"
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
  it('deserializes batch changes as expected', () => {
    const deserializedChanges = deserializeChanges([mockBatchChange]);
    expect(deserializedChanges[0]).toBeInstanceOf(BatchChange);
    expect(deserializedChanges[0].toJSON()).toEqual({
      "type": "batch",
      "changes": [{
        "type": "update-object",
        "timestamp": 1613407407221,
        "path": "references.1",
        "differences": [{"kind": "E", "path": ["authors", 5, "lastName"], "lhs": "Foo", "rhs": "Foox"}]
      }, {
        "type": "prosemirror",
        "timestamp": 1613407407225,
        "path": "body",
        "transactionSteps": [{
          "stepType": "replace",
          "from": 30584,
          "to": 30585,
          "slice": {"content": [{"type": "refCitation", "attrs": {"refId": "bib2", "refText": "Foox et al., 2011"}}]}
        }]
      }],
      "timestamp": 1613407407225
    });
  });

  it('deserializes prosemirror changes as expected', () => {
    const deserializedChanges = deserializeChanges([mockProsemirrorChange]);
    expect(deserializedChanges[0]).toBeInstanceOf(ProsemirrorChange);
    expect(deserializedChanges[0].toJSON()).toEqual({
      "type": "prosemirror",
      "timestamp": 1612261319184,
      "path": "body",
      "transactionSteps": [{
        "stepType": "replace",
        "from": 0,
        "to": 0,
        "slice": {"content": [{"text": "some new text", "type": "text"}]}
      }]
    });
  });

  it('deserializes add-object changes as expected', () => {
    const deserializedChanges = deserializeChanges([mockAddObjectChange]);
    expect(deserializedChanges[0]).toBeInstanceOf(AddObjectChange);
    expect(deserializedChanges[0].toJSON()).toEqual({
      "type": "add-object",
      "timestamp": 1614097785693,
      "path": "relatedArticles",
      "idField": "id",
      "object": {"_id": "ad319b14-c312-4627-a5a1-d07a548a6e7e", "articleType": "article-reference", "href": "111111"}
    });
  });

  it('deserializes delete-object changes as expected', () => {
    const deserializedChanges = deserializeChanges([mockDeleteObjectChange]);
    expect(deserializedChanges[0]).toBeInstanceOf(DeleteObjectChange);
    expect(deserializedChanges[0].toJSON()).toEqual({
      "type": "delete-object",
      "timestamp": 1614097785693,
      "path": "relatedArticles",
      "idField": "id",
      "object": {"_id": "ad319b14-c312-4627-a5a1-d07a548a6e7f", "articleType": "article-reference", "href": "222222"}
    });
  });

  it('deserializes update-object changes as expected', () => {
    const deserializedChanges = deserializeChanges([mockUpdateObjectChange]);
    expect(deserializedChanges[0]).toBeInstanceOf(UpdateObjectChange);
    expect(deserializedChanges[0].toJSON()).toEqual({
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
    });
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
  it('adds an entity to related article list', () => {
    const changesJSON = [{
      "type": "add-object",
      "timestamp": 1614097785693,
      "path": "relatedArticles",
      "idField": "id",
      "object": {
        "_id": "ad319b14-c312-4627-a5a1-d07a548a6e7e",
        "articleType": "article-reference",
        "href": "111111"
      }
    }];

    const updatedManuscript = applyChangesToManuscript(mockManuscript, changesJSON);
    expect(updatedManuscript.relatedArticles.length).toBe(1);
    expect(updatedManuscript.relatedArticles[0]).toEqual(changesJSON[0].object);
  });

  it('deletes an entity from related article list', () => {
    const changesJSON = [{
      "type": "add-object",
      "timestamp": 161409771111,
      "path": "relatedArticles",
      "idField": "id",
      "object": {
        "_id": "ad319b14-c312-1111-a5a1-d07a548a6e7e",
        "articleType": "article-commentary",
        "href": "222"
      }
    }, {
      "type": "add-object",
      "timestamp": 1614097785693,
      "path": "relatedArticles",
      "idField": "id",
      "object": {
        "_id": "ad319b14-c312-4627-a5a1-d07a548a6e7e",
        "articleType": "article-reference",
        "href": "111111"
      }
    }];


    const testManuscript = applyChangesToManuscript(mockManuscript, changesJSON);
    expect(testManuscript.relatedArticles.length).toBe(2);

    const updatedManuscript = applyChangesToManuscript(testManuscript, [{
        "type": "delete-object",
        "timestamp": 1614097785693,
        "path": "relatedArticles",
        "idField": "id",
        "object": {
          "_id": "ad319b14-c312-1111-a5a1-d07a548a6e7e",
          "articleType": "article-commentary",
          "href": "222"
        }
    }]);

    expect(updatedManuscript.relatedArticles.length).toBe(1);
    expect(updatedManuscript.relatedArticles[0]).toEqual(changesJSON[1].object);
  });

  it('updates an entity on related article list', () => {
    const changesJSON = [{
      "type": "add-object",
      "timestamp": 1614097785693,
      "path": "relatedArticles",
      "idField": "id",
      "object": {
        "_id": "ad319b14-c312-4627-a5a1-d07a548a6e7e",
        "articleType": "article-reference",
        "href": "111111"
      }
    }];

    const testManuscript = applyChangesToManuscript(mockManuscript, changesJSON);

    const updatedManuscript = applyChangesToManuscript(testManuscript, [{
      "type": "update-object",
      "timestamp": 1614250395860,
      "path": "relatedArticles.0",
      "differences": [{"kind": "E", "path": ["href"], "lhs": "111111", "rhs": "10.7554/eLife.4849811"}]
    }]);
    expect(updatedManuscript.relatedArticles.length).toBe(1);
    expect(updatedManuscript.relatedArticles[0].id).toBe(changesJSON[0].object._id);
    expect(updatedManuscript.relatedArticles[0].articleType).toBe(changesJSON[0].object.articleType);
    expect(updatedManuscript.relatedArticles[0].href).toBe("10.7554/eLife.4849811");
  });

  it('applies a prosemirror change on the body', () => {
    expect(mockManuscript.body.doc.textContent).toBe('');
    const updatedManuscript = applyChangesToManuscript(mockManuscript, [createProsemirrorChange('body', 'some new body')]);
    expect(updatedManuscript.body.doc.textContent).toBe('some new body');
  });
  it('applies a prosemirror change on the title', () => {
    expect(mockManuscript.title.doc.textContent).toBe('');
    const updatedManuscript = applyChangesToManuscript(mockManuscript, [createProsemirrorChange('title', 'some new title')]);
    expect(updatedManuscript.title.doc.textContent).toBe('some new title');
  });
  it('applies a prosemirror change on the abstract', () => {
    expect(mockManuscript.abstract.doc.textContent).toBe('');
    const updatedManuscript = applyChangesToManuscript(mockManuscript, [createProsemirrorChange('abstract', 'some new abstract')]);
    expect(updatedManuscript.abstract.doc.textContent).toBe('some new abstract');
  });
  it('applies a prosemirror change on the impactStatement', () => {
    expect(mockManuscript.impactStatement.doc.textContent).toBe('');
    const updatedManuscript = applyChangesToManuscript(mockManuscript, [createProsemirrorChange('impactStatement', 'some new impactStatement')]);
    expect(updatedManuscript.impactStatement.doc.textContent).toBe('some new impactStatement');
  });
  it('applies a prosemirror change on the acknowledgements', () => {
    expect(mockManuscript.acknowledgements.doc.textContent).toBe('');
    const updatedManuscript = applyChangesToManuscript(mockManuscript, [createProsemirrorChange('acknowledgements', 'some new acknowledgements')]);
    expect(updatedManuscript.acknowledgements.doc.textContent).toBe('some new acknowledgements');
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

  it('returns a Person object when passed authors backmatter JSON', () => {
    const relatedArticle = deserializeBackmatter('authors', {
      _id: 'author-3888',
      firstName: 'Fred',
      lastName: 'Atherden',
      isAuthenticated: true,
      orcid: '0000-0002-6048-1470',
      email: 'fatherden@elifesciences.org',
      isCorrespondingAuthor: true,
      affiliations: ['aff2', 'aff3']
    });
    expect(relatedArticle).toBeInstanceOf(Person);
    expect(relatedArticle).toEqual(expect.objectContaining({
      _id: 'author-3888',
      firstName: 'Fred',
      lastName: 'Atherden',
      isAuthenticated: true,
      orcid: '0000-0002-6048-1470',
      email: 'fatherden@elifesciences.org',
      isCorrespondingAuthor: true,
      affiliations: ['aff2', 'aff3']
    }));
  });
  it('returns a Keyword object when passed keywordGroup backmatter JSON', () => {
    const relatedArticle = deserializeBackmatter('keywordGroups.kwdGroup.keywords',      
    {"_id": "some_preset_id",
      "content": {
        "doc": {
          "content": [
            {
              "text": "A",
              "type": "text",
            },
            {
              "marks": [
                {
                  "type": "italic",
                },
              ],
              "text": "Puppy",
              "type": "text",
            },
          ],
          "type": "keyword",
        },
        "selection": {
          "anchor": 0,
          "head": 0,
          "type": "text",
        },
      },
    });
    expect(relatedArticle).toBeInstanceOf(Keyword);
    expect(relatedArticle).toMatchInlineSnapshot(`
    Keyword {
      "_id": "some_preset_id",
      "content": Object {
        "doc": Object {
          "content": Array [
            Object {
              "text": "A",
              "type": "text",
            },
            Object {
              "marks": Array [
                Object {
                  "type": "italic",
                },
              ],
              "text": "Puppy",
              "type": "text",
            },
          ],
          "type": "keyword",
        },
        "selection": Object {
          "anchor": 0,
          "head": 0,
          "type": "text",
        },
      },
    }
    `);
  });

  it('throws correct error if passed invalid path', () => {
    expect(() => deserializeBackmatter('foo', {
      "bar" : "bar"
    })).toThrow('deserialization of backmatter entity for foo is not implemented or provided path is invalid');
  });
});

import { Keyword, createKeywordGroupsState, serializeKeywordGroups } from '../../../src/model/keyword';
import * as xmldom from 'xmldom';
import { parseXML } from '../../../src/xml-exporter/xml-utils';
import { Manuscript } from '../../../src/model/manuscript';
const xmlSerializer = new xmldom.XMLSerializer();

jest.mock('uuid', () => ({
    v4: () => 'unique_id',
}));

const emptyKywordSnapshot = `
Keyword {
  "_id": "unique_id",
  "content": Object {
    "doc": Object {
      "type": "keyword",
    },
    "selection": Object {
      "anchor": 0,
      "head": 0,
      "type": "text",
    },
  },
}
`;

const xmlDoc = new xmldom.DOMImplementation().createDocument(null, null);

describe('Keyword', () => {
    it('returns empty Keyword when called with no data', () => {
        const keyword = new Keyword();
        expect(keyword).toMatchInlineSnapshot(emptyKywordSnapshot);
    });
    describe('toXml', () => {
        it('serializes an empty keyword object to XML', () => {
            const keyword = new Keyword();
            expect(xmlSerializer.serializeToString(keyword.toXml())).toBe('<kwd/>');
        });
        it('serializes a populated keyword', () => {
            const element = parseXML(`<kwd>A<sub>Poodle</sub><italic>Puppy</italic><sup>Dog</sup></kwd>`);
            const keyword = new Keyword(element.querySelector('kwd')!);
            expect(xmlSerializer.serializeToString(keyword.toXml())).toBe(
                '<kwd>' + 'A<sub>Poodle</sub><italic>Puppy</italic><sup>Dog</sup>' + '</kwd>',
            );
        });
    });
    describe('fromXml', () => {
        it('returns empty Keyword when called with empty aff xml fragment', () => {
            const keyword = new Keyword(xmlDoc.createElement('kwd-group'));
            expect(keyword).toMatchInlineSnapshot(emptyKywordSnapshot);
        });
        it('creates a Keyword from a complete xml fragment', () => {
            const element = parseXML(`<kwd>A<sub>Poodle</sub><italic>Puppy</italic><sup>Dog</sup></kwd>`);
            const keyword = new Keyword(element.querySelector('kwd')!);
            expect(keyword).toMatchInlineSnapshot(`
      Keyword {
        "_id": "unique_id",
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
                    "type": "subscript",
                  },
                ],
                "text": "Poodle",
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
              Object {
                "marks": Array [
                  Object {
                    "type": "superscript",
                  },
                ],
                "text": "Dog",
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
    });
    describe('fromJSON', () => {
        it('returns empty Keyword when called with empty JSON object', () => {
            const keyword = new Keyword(xmlDoc.createElement('kwd-group'));
            expect(keyword).toMatchInlineSnapshot(emptyKywordSnapshot);
        });
        it('creates a Keyword from a complete JSON object', () => {
            const keyword = new Keyword({
                _id: 'some_preset_id',
                content: {
                    doc: {
                        content: [
                            {
                                text: 'A',
                                type: 'text',
                            },
                            {
                                marks: [
                                    {
                                        type: 'subscript',
                                    },
                                ],
                                text: 'Poodle',
                                type: 'text',
                            },
                            {
                                marks: [
                                    {
                                        type: 'italic',
                                    },
                                ],
                                text: 'Puppy',
                                type: 'text',
                            },
                            {
                                marks: [
                                    {
                                        type: 'superscript',
                                    },
                                ],
                                text: 'Dog',
                                type: 'text',
                            },
                        ],
                        type: 'keyword',
                    },
                    selection: {
                        anchor: 0,
                        head: 0,
                        type: 'text',
                    },
                },
            });
            expect(keyword).toMatchInlineSnapshot(`
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
                    "type": "subscript",
                  },
                ],
                "text": "Poodle",
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
              Object {
                "marks": Array [
                  Object {
                    "type": "superscript",
                  },
                ],
                "text": "Dog",
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
    });
});

describe('createKeywordGroupsState', () => {
    it('creates a keywordGroup from array of xml elements', () => {
        const kwdContainer = parseXML(`<article>
      <kwd-group kwd-group-type="author-keywords">
        <kwd>cerebellum</kwd>
        <kwd>climbing fiber</kwd>
      </kwd-group>
      <kwd-group kwd-group-type="research-organism">
        <title>Research organism</title>
        <kwd>Mouse</kwd>
      </kwd-group>
    </article>`);

        const editorState = createKeywordGroupsState(Array.from(kwdContainer.querySelectorAll('kwd-group')));
        expect(editorState).toMatchInlineSnapshot(`
    Object {
      "author-keywords": Object {
        "keywords": Array [
          Keyword {
            "_id": "unique_id",
            "content": Object {
              "doc": Object {
                "content": Array [
                  Object {
                    "text": "cerebellum",
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
          },
          Keyword {
            "_id": "unique_id",
            "content": Object {
              "doc": Object {
                "content": Array [
                  Object {
                    "text": "climbing fiber",
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
          },
        ],
        "newKeyword": Keyword {
          "_id": "unique_id",
          "content": Object {
            "doc": Object {
              "type": "keyword",
            },
            "selection": Object {
              "anchor": 0,
              "head": 0,
              "type": "text",
            },
          },
        },
        "title": undefined,
      },
      "research-organism": Object {
        "keywords": Array [
          Keyword {
            "_id": "unique_id",
            "content": Object {
              "doc": Object {
                "content": Array [
                  Object {
                    "text": "Mouse",
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
          },
        ],
        "newKeyword": Keyword {
          "_id": "unique_id",
          "content": Object {
            "doc": Object {
              "type": "keyword",
            },
            "selection": Object {
              "anchor": 0,
              "head": 0,
              "type": "text",
            },
          },
        },
        "title": "Research organism",
      },
    }
    `);
    });
});

describe('serializeKeywordGroups', () => {
    it('returns article-meta unchanged if it has no keywordGroups and manuscript keywordGroups is empty', () => {
        const articleXmlString = '<article><article-meta><some-other-tag/></article-meta></article>';
        const xmlDoc = parseXML(articleXmlString);
        serializeKeywordGroups(xmlDoc, { keywordGroups: [] } as unknown as Manuscript);
        expect(xmlSerializer.serializeToString(xmlDoc)).toBe(articleXmlString);
    });
    it('clears down article-meta keywordGroups if the Manuscript keywordGroups is empty', () => {
        const articleXmlString =
            '<article><article-meta>' +
            `<kwd-group kwd-group-type="author-keywords">
      <kwd>transgenerational inheritance</kwd>
      <kwd>epigenetics</kwd>
      <kwd>aging</kwd>
      <kwd>chromatin</kwd>
    </kwd-group>` +
            '</article-meta></article>';
        const xmlDoc = parseXML(articleXmlString);
        serializeKeywordGroups(xmlDoc, { keywordGroups: [] } as unknown as Manuscript);
        expect(xmlSerializer.serializeToString(xmlDoc)).toBe('<article><article-meta/></article>');
    });

    it('replaces article-meta keywordGroups if the Manuscript keywordGroups', () => {
        const articleXmlString =
            '<article><article-meta>' +
            `<kwd-group kwd-group-type="author-keywords">
      <kwd>transgenerational inheritance</kwd>
      <kwd>epigenetics</kwd>
      <kwd>aging</kwd>
      <kwd>chromatin</kwd>
    </kwd-group>` +
            '</article-meta></article>';

        const kwdContainer = parseXML(`<article>
      <kwd-group kwd-group-type="author-keywords">
        <kwd>cerebellum</kwd>
        <kwd>climbing fiber</kwd>
      </kwd-group>
      <kwd-group kwd-group-type="research-organism">
        <title>Research organism</title>
        <kwd>Mouse</kwd>
      </kwd-group>
    </article>`);

        const xmlDoc = parseXML(articleXmlString);
        const keywordGroups = createKeywordGroupsState(Array.from(kwdContainer.querySelectorAll('kwd-group')));
        serializeKeywordGroups(xmlDoc, { keywordGroups } as unknown as Manuscript);
        expect(xmlSerializer.serializeToString(xmlDoc)).toBe(
            '<article><article-meta>' +
                '<kwd-group kwd-group-type="author-keywords"><kwd>cerebellum</kwd><kwd>climbing fiber</kwd></kwd-group>' +
                '<kwd-group kwd-group-type="research-organism"><title>Research organism</title><kwd>Mouse</kwd></kwd-group>' +
                '</article-meta></article>',
        );
    });
});

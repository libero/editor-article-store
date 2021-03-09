/**
 * @jest-environment jsdom
 */
import { Keyword } from '../../../src/model/keyword';

jest.mock('uuid', () => ({
  v4: () => 'unique_id'
}));

describe('Keyword', () => {
  it('returns empty Keyword when called with no data', () => {
    const keyword = new Keyword();
    expect(keyword).toMatchInlineSnapshot(`
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
    `);
  });
  describe('fromXml', () => {
    it('returns empty Keyword when called with empty aff xml fragment', () => {
      const keyword = new Keyword(document.createElement('kwd-group'));
      expect(keyword).toMatchInlineSnapshot(`
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
      `);
    });
    it('creates a Keyword from a complete xml fragment', () => {
      const element = document.createElement('kwd')
      element.innerHTML = `A<sub>Poodle</sub><italic>Puppy</italic><sup>Dog</sup>`;
      const keyword = new Keyword(element);
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
});
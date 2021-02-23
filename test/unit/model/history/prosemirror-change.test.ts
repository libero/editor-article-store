import * as jsdom from "jsdom";
import {Manuscript} from "../../../../src/model/manuscript";
import {createBodyState} from "../../../../src/model/body";
import {createTitleState} from "../../../../src/model/title";
import {ProsemirrorChange} from "../../../../src/model/history/prosemirror-change";

describe('ProsemirrorChange', () => {
  const dom = new jsdom.JSDOM();
  let manuscript: Manuscript;

  beforeEach(() => {
    manuscript = {
      body: createBodyState(dom.window.document.createElement('div')),
      title: createTitleState(dom.window.document.createElement('div'))
    } as Manuscript;
  });


  it('should apply prosemirror change', () => {
    const prosemirrorChange = new ProsemirrorChange('body', manuscript.body.tr.insertText('test content'));

    const updatedManuscript = prosemirrorChange.applyChange(manuscript);
    expect(updatedManuscript.body.doc.textContent).toBe('test content');
  });

  it('should indicate empty change', () => {
    const prosemirrorChange = new ProsemirrorChange('body', manuscript.body.tr);

    expect(prosemirrorChange.isEmpty).toBeTruthy();
  });

  it('should serialize to JSON', () => {
    const change = new ProsemirrorChange('body', manuscript.body.tr.insertText('test content'));

    expect(change.toJSON()).toEqual({
      path: 'body',
      timestamp: expect.any(Number),
      type: 'prosemirror',
      transactionSteps: [
        {
          from: 1,
          slice: { content: [{ type: 'text', text: 'test content' }] },
          stepType: 'replace',
          to: 1
        }
      ]
    });
  });

  it('should deserialize from JSON', () => {
    const JSONObject = {
      path: 'body',
      timestamp: 1610979099826,
      transactionSteps: [
        {
          stepType: 'replace',
          from: 1,
          to: 1,
          slice: {
            content: [
              {
                type: 'text',
                text: 'This text is sent from the server'
              }
            ]
          }
        }
      ],
      type: 'prosemirror'
    };

    const change = ProsemirrorChange.fromJSON(JSONObject);

    expect(change).toMatchSnapshot();
    expect(change).toBeInstanceOf(ProsemirrorChange);
  });
});

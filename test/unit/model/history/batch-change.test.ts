import {BatchChange} from '../../../../src/model/history/batch-change';
import {ProsemirrorChange} from '../../../../src/model/history/prosemirror-change';
import {createBodyState} from '../../../../src/model/body';
import {createTitleState} from '../../../../src/model/title';
import {Manuscript} from '../../../../src/model/manuscript';
import {parseXML} from "../../../../src/xml-exporter/xml-utils";

describe('BatchChange', () => {
  let manuscript: Manuscript;

  beforeEach(() => {
    const xmlDoc = parseXML(`<article> <title></title> <body></body> </article>`)
    manuscript = {
      body: createBodyState(xmlDoc.querySelector('body')!),
      title: createTitleState(xmlDoc.querySelector('title')!)
    } as Manuscript;
  });

  it('should apply batch change', () => {
    const batchChange = new BatchChange([
      new ProsemirrorChange('body', manuscript.body.tr.insertText('test content')),
      new ProsemirrorChange('title', manuscript.title.tr.insertText('sample content'))
    ]);

    const updatedManuscript = batchChange.applyChange(manuscript);
    expect(updatedManuscript.body.doc.textContent).toBe('test content');
    expect(updatedManuscript.title.doc.textContent).toBe('sample content');
    expect(batchChange.isEmpty).toBeFalsy();
  });

  it('should indicate empty change', () => {
    const batchChange = new BatchChange([new ProsemirrorChange('body', manuscript.body.tr)]);
    expect(batchChange.isEmpty).toBeTruthy();

    const batchChange2 = new BatchChange();
    expect(batchChange2.isEmpty).toBeTruthy();
  });

  it('should have a timestamp', () => {
    jest.spyOn(Date, 'now').mockReturnValue(123);
    const batchChange = new BatchChange([new ProsemirrorChange('body', manuscript.body.tr)]);
    expect(batchChange.timestamp).toBe(Date.now());
    jest.restoreAllMocks();
  });

  it('should apply batch change', () => {
    const change1 = new ProsemirrorChange('body', manuscript.body.tr.insertText('test content'));
    const change2 = new ProsemirrorChange('title', manuscript.title.tr.insertText('sample content'));
    const batchChange = new BatchChange([change1, change2]);

    expect(batchChange.toJSON()).toEqual({
      timestamp: expect.any(Number),
      type: 'batch',
      changes: [change1.toJSON(), change2.toJSON()]
    });
  });

  it('should deserialize from JSON', () => {
    const JSONObject = {
      timestamp: 1610979099826,
      type: 'batch-change',
      changes: [
        {
          timestamp: 1610979099826,
          path: 'body',
          transactionSteps: [
            {
              stepType: 'replace',
              from: 0,
              to: 0,
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
        },
        {
          path: 'keywordGroups.kwdGroup.keywords',
          timestamp: 1610979099826,
          order: [2, 0, 1],
          type: 'rearranging'
        }
      ]
    };

    const change = BatchChange.fromJSON(JSONObject);

    expect(change).toMatchSnapshot();
    expect(change).toBeInstanceOf(BatchChange);
  });
});

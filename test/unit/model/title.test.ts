/**
 * @jest-environment jsdom
 */
import { createTitleState } from '../../../src/model/title';

describe('Manuscript state factory', () => {
  it('creates title state', () => {
    const el = document.createElement('article-title');
    el.innerHTML = 'A sample <italic>text</italic> with <sub>a</sub> variety of <sup>tags</sup>';
    const editorState = createTitleState(el);
    expect(editorState).toMatchSnapshot();
  });

  it('creates empty title state', () => {
    const editorState = createTitleState(undefined);
    expect(editorState.doc.textContent).toBe('');
  });
});

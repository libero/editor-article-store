/**
 * @jest-environment jsdom
 */
import { createAcknowledgementsState } from '../../../src/model/acknowledgements';

describe('Manuscript state factory', () => {
  it('creates acknowledgements state', () => {
    const el = document.createElement('ack');
    el.innerHTML = '<title>Acknowledgements</title><p>A sample <italic>text</italic> with <sub>a</sub> variety of <sup>tags</sup></p>';
    const editorState = createAcknowledgementsState(el);
    expect(editorState).toMatchSnapshot();
  });
});

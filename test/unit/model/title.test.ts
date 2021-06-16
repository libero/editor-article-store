import { createTitleState } from '../../../src/model/title';
import { parseXML } from '../../../src/xml-exporter/xml-utils';

describe('Manuscript state factory', () => {
    it('creates title state', () => {
        const xmlDoc = parseXML(`<article>
        <body> A sample <italic>text</italic> with <sub>a</sub> variety of <sup>tags</sup> </body>
    </article>`);
        const editorState = createTitleState(xmlDoc.querySelector('body')!);
        expect(editorState).toMatchSnapshot();
    });

    it('creates empty title state', () => {
        const editorState = createTitleState(undefined);
        expect(editorState.doc.textContent).toBe('');
    });
});

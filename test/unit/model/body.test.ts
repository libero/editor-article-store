import { createBodyState } from '../../../src/model/body';
import { parseXML } from '../../../src/xml-exporter/xml-utils';

describe('Manuscript state factory', () => {
    it('creates body state', () => {
        const xmlDoc = parseXML(`<article>
        <body> A sample <italic>text</italic> with <sub>a</sub> variety of <sup>tags</sup> </body>
    </article>`);
        const editorState = createBodyState(xmlDoc.querySelector('body')!);
        expect(editorState).toMatchSnapshot();
    });
});

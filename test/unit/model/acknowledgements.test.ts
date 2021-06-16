import { createAcknowledgementsState } from '../../../src/model/acknowledgements';
import { parseXML } from '../../../src/xml-exporter/xml-utils';

describe('Manuscript state factory', () => {
    it('creates acknowledgements state', () => {
        const xmlDoc = parseXML(`<article>
        <ack>
          <title>Acknowledgements</title><p>A sample <italic>text</italic> with <sub>a</sub> variety of <sup>tags</sup></p>
        </ack>
    </article>`);
        const editorState = createAcknowledgementsState(xmlDoc.querySelector('ack')!);
        expect(editorState).toMatchSnapshot();
    });
});

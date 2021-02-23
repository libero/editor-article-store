import * as jsdom from "jsdom";

import {parseFigure, serializeFigure} from '../../../../src/model/config/figure.parser';
import {createBodyState} from '../../../../src/model/body';
import {parseXML} from "../../../../src/xml-exporter/xml-utils";

const FIGURE_CONTENT_XML = `<fig id="fig2">
  <label>Figure 1.</label>
  <caption>
    <title>Bacterial cells on the surface of a plant leaf.</title>
    <p>
        Pellentesque porta interdum sodales (<xref ref-type="bibr" rid="bib6">Heissler and Sellers, 2016a</xref>). 
        Vestibulum<sub>id</sub> interdum<sup>felis</sup>. 
        <bold>Vestibulum</bold> at <underline>viverra</underline> lorem. <sc>Aliquam Gravida</sc> nulla orci, quis tristique tortor ornare at 
        <ext-link ext-link-type="uri" xlink:href="https://www.biobam.com/">https://www.biobam.com/</ext-link>. 
        Pellentesque accumsan sed ipsum eget hendrerit (<xref ref-type="bibr" rid="bib3">Foley et al., 2018</xref>). 
        Pellentesque cursus, nibh eu <monospace>mattis condimentum</monospace>, massa libero faucibus enim, 
        et tempor orci neque eget<sup>mi</sup>. Phasellus lacus<sub>mi</sub>, ultrices quis placerat id, dignissim ac erat.
    </p>
  </caption>
  <graphic mime-subtype="jpg" mimetype="image" xlink:href="fig1.jpg"/>
</fig>`;

jest.mock('../../../../src/model/figure', () => ({
  getFigureImageUrlFromXml: () => 'IMAGE_URL',
  createFigureLicenseAttributes: () => ({
    copyrightHolder: 'Copyright holder',
    copyrightStatement: 'Copyright stmt',
    copyrightYear: 'Copyright year',
    licenseType: 'License type'

  }),
  createEmptyLicenseAttributes: () => ({
    copyrightHolder: '',
    copyrightStatement: '',
    copyrightYear: '',
    licenseType: ''
  })
}));

describe('figure parsing spec', () => {
  it('checks empty figure parsing', () => {
    const dom = new jsdom.JSDOM();
    const body = dom.window.document.body;
    const figure = dom.window.document.createElement('fig');
    body.appendChild(figure);
    const bodyState = createBodyState(dom.window.document.body);
    expect(parseFigure(body.firstChild as Element, bodyState.schema)).toMatchSnapshot();
  });

  it('checks figure parsing', () => {
    const dom = new jsdom.JSDOM();
    const bodyState = createBodyState(dom.window.document.createElement('body'));
    dom.window.document.body.innerHTML = FIGURE_CONTENT_XML;
    expect(parseFigure(dom.window.document.body.firstChild as Element, bodyState.schema)).toMatchSnapshot();
  });

  it('checks figure serialization', () => {
    const dom = parseXML(`<article><body>${FIGURE_CONTENT_XML}</body></article>`);
    const bodyState = createBodyState(dom.querySelector('body')!);
    expect(serializeFigure(bodyState.doc.firstChild!)).toMatchSnapshot();

  });
});

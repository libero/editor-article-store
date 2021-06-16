import { createEmptyLicenseAttributes, createFigureLicenseAttributes, getLicenseUrl } from '../../../src/model/figure';
import { parseXML } from '../../../src/xml-exporter/xml-utils';

jest.mock('../../../src/model/config/nodes');

describe('Manuscript state factory', () => {
    it('creates empty figure license attributes', () => {
        expect(createEmptyLicenseAttributes()).toEqual({
            copyrightHolder: '',
            copyrightStatement: '',
            copyrightYear: '',
            licenseType: '',
        });
    });

    it('returns license URL', () => {
        expect(getLicenseUrl('LICENSE_CCO')).toEqual('http://creativecommons.org/publicdomain/zero/1.0/');
        expect(getLicenseUrl('LICENSE_CC_BY_4')).toEqual('http://creativecommons.org/licenses/by/4.0/');
        expect(getLicenseUrl('LICENSE_OTHER')).toEqual('');
    });

    it('returns license attributes', () => {
        const xmlDoc = parseXML(`<article>
        <permissions> 
          <copyright-statement>2020, Emerson et al</copyright-statement>
          <copyright-year>2020</copyright-year>
          <copyright-holder>Emerson et al</copyright-holder>
          <ali:free_to_read/>
          <license xlink:href="http://creativecommons.org/licenses/by/4.0/">
              <ali:license_ref>http://creativecommons.org/licenses/by/4.0/</ali:license_ref>
          </license> 
      </permissions>
    </article>`);
        const el = xmlDoc.querySelector('permissions')!;
        expect(createFigureLicenseAttributes(el)).toEqual({
            copyrightHolder: 'Emerson et al',
            copyrightStatement: '2020, Emerson et al',
            copyrightYear: '2020',
            licenseType: 'LICENSE_CC_BY_4',
        });
    });
});

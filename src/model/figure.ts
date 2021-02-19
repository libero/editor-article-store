import { get } from 'lodash';

import { getTextContentFromPath } from './utils';

export interface Figure {
  copyrightHolder: string;
  copyrightStatement: string;
  copyrightYear: string;
  licenseType: string;
}

export const FIGURE_LICENSE_CC0 = 'LICENSE_CCO';
export const FIGURE_LICENSE_CC_BY_4 = 'LICENSE_CC_BY_4';
export const FIGURE_LICENSE_OTHER = 'LICENSE_OTHER';

const LICENSE_URLS_MAP: Record<string, string> = {
  'http://creativecommons.org/licenses/by/4.0/': FIGURE_LICENSE_CC_BY_4,
  'http://creativecommons.org/publicdomain/zero/1.0/': FIGURE_LICENSE_CC0
};

export function createFigureLicenseAttributes(el: Element): Figure {
  return {
    copyrightHolder: getTextContentFromPath(el, 'copyright-holder'),
    copyrightStatement: getTextContentFromPath(el, 'copyright-statement'),
    copyrightYear: getTextContentFromPath(el, 'copyright-year'),
    licenseType: getLicenseType(el)
  };
}

export function createEmptyLicenseAttributes(): Figure {
  return {
    copyrightHolder: '',
    copyrightStatement: '',
    copyrightYear: '',
    licenseType: ''
  };
}

export function getLicenseUrl(licenseType: string): string {
  const licenseEntry = Object.entries(LICENSE_URLS_MAP).find(([type]) => type === licenseType);
  return licenseEntry ? licenseEntry[0] : '';
}

export function getFigureImageUrlFromXml(el: Element): string {
  return el.querySelector('graphic')!.getAttribute('xlink:href') || '';
}

function getLicenseType(el: Element): string {
  const licenseUrl =
    getTextContentFromPath(el, 'license_ref') || el.querySelector('license')!.getAttribute('xlink:href') || '';

  return LICENSE_URLS_MAP[licenseUrl] || FIGURE_LICENSE_OTHER;
}

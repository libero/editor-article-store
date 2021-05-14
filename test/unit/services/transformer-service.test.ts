import { String } from 'aws-sdk/clients/apigateway';
import fetch from 'node-fetch';
import { ConfigManagerInstance } from '../../../src/services/config-manager';
import TransformService from '../../../src/services/transform';

jest.mock('node-fetch');

const mockConfigGet = jest.fn(() => 'someUrl');

const mockConfigManager = ({
  get: mockConfigGet
}as unknown) as ConfigManagerInstance;

describe('TransformService', () => {
  describe('importTransform', () => {
    it('returns transformed xml',async () => {
      (fetch as unknown as jest.Mock).mockImplementation(() => ({
        text: () => '<SomeFetchedXml />'
      }));
      const transformSrv = TransformService(mockConfigManager);
      expect(fetch).not.toBeCalled();
      const xml = await transformSrv.importTransform('<article></article>');
      expect(fetch).toBeCalledWith('someUrl', { method: 'POST', body: '<article></article>' });
      expect(xml).toBe('<SomeFetchedXml />');
    });
    it('throws expected error on fetch fail', async () => {
      (fetch as unknown as jest.Mock).mockImplementation(() => { throw new Error('Some error message') });
      const transformSrv = TransformService(mockConfigManager);
      await expect(transformSrv.importTransform('<article></article>')).rejects.toThrow('Failed to transform the imported xml: Some error message');
    });
  });
  describe('articleMetaOrderTransform', () => {
    const transformSrv = TransformService(mockConfigManager);
    it('returns correctly when passed empty article meta fragment', async () => {
      await expect(transformSrv.articleMetaOrderTransform('<article><article-meta/></article>')).resolves.toBe('<article><article-meta/></article>');
    });
    it('returns correctly when passed partial article meta fragment', async () => {
      await expect(transformSrv.articleMetaOrderTransform(`<article><article-meta>
        <title-group/>
        <article-categories/>
        <article-id/>
      </article-meta></article>`)).resolves.toBe('<article><article-meta><article-id/><article-categories/><title-group/></article-meta></article>');
    });
    it('returns correctly when passed complete article meta fragment', async () => {
      await expect(transformSrv.articleMetaOrderTransform(`<article><article-meta>
      <supplementary-material/>
      <history/>
      <pub-history/>
      <permissions/>
      <self-uri/>
      <related-article/>
      <related-object/>
      <abstract/>
      <trans-abstract/>
      <kwd-group/>
      <funding-group/>
      <support-group/>
      <conference/>
      <counts/>
      <custom-meta-group/>
      <article-id/>
      <article-version/>
      <article-version-alternatives/>
      <article-categories/>
      <title-group/>
      <contrib-group/>
      <aff/>
      <aff-alternatives/>
      <x/>
      <author-notes/>
      <pub-date/>
      <pub-date-not-available/>
      <volume/>
      <volume-id/>
      <volume-series/>
      <issue/>
      <issue-id/>
      <issue-title/>
      <issue-sponsor/>
      <issue-part/>
      <volume-issue-group/>
      <isbn/>
      <supplement/>
      <fpage/>
      <lpage/>
      <page-range/>
      <elocation-id/>
      <email/>
      <ext-link/>
      <uri/>
      <product/>
      </article-meta></article>`)).resolves.toBe('<article><article-meta><article-id/><article-version/><article-version-alternatives/><article-categories/><title-group/><contrib-group/><aff/><aff-alternatives/><x/><author-notes/><pub-date/><pub-date-not-available/><volume/><volume-id/><volume-series/><issue/><issue-id/><issue-title/><issue-sponsor/><issue-part/><volume-issue-group/><isbn/><supplement/><fpage/><lpage/><page-range/><elocation-id/><email/><ext-link/><uri/><product/><supplementary-material/><history/><pub-history/><permissions/><self-uri/><related-article/><related-object/><abstract/><trans-abstract/><kwd-group/><funding-group/><support-group/><conference/><counts/><custom-meta-group/></article-meta></article>');
    });
  });
});
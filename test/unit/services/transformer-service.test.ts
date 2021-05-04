import fetch from 'node-fetch';
import TransformService from '../../../src/services/transform';
jest.mock('node-fetch');

describe('TransformService', () => {
  describe('importTransform', () => {
    it('returns transformed xml',async () => {
      (fetch as unknown as jest.Mock).mockImplementation(() => ({
        text: () => '<SomeFetchedXml />'
      }));
      const transformSrv = TransformService({ importUrl: 'someUrl' });
      expect(fetch).not.toBeCalled();
      const xml = await transformSrv.importTransform('<article></article>');
      expect(fetch).toBeCalledWith('someUrl', { method: 'POST', body: '<article></article>' });
      expect(xml).toBe('<SomeFetchedXml />');
    });
    it('throws expected error on fetch fail', async () => {
      (fetch as unknown as jest.Mock).mockImplementation(() => { throw new Error('Some error message') });
      const transformSrv = TransformService({ importUrl: 'someUrl' });
      await expect(transformSrv.importTransform('<article></article>')).rejects.toThrow('Failed to transform the imported xml: Some error message');
    });
  });
});
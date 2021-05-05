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
});
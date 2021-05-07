import fetch from 'node-fetch';
import { ConfigManager } from '../types/config-manager';

export interface TransformService {
  importTransform: (xml: string) => Promise<string>
};

export default (config: ConfigManager): TransformService => {
  return {
    importTransform: async (xml: string) => {
      let response;
      try {
        response = await fetch(config.get('importTransformUrl'), { method: 'POST', body: xml })
      } catch (e) {
        throw new Error('Failed to transform the imported xml: ' + e.message)
      }
      return response.text()
    }
  }
}
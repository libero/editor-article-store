import fetch from 'node-fetch';
import { TransformConfig } from '../types/config';

export default ({ 
  importUrl, 
}: TransformConfig) => {
  return {
    importTransform: async (xml: string) => {
      let response;
      try {
        response = await fetch(importUrl, { method: 'POST', body: xml })
      } catch (e) {
        throw new Error('Failed to transform the imported xml: ' + e.message)
      }
      return response.text()
    }
  }
}
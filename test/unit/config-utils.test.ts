import {createConfigFromArgs} from '../../src/utils/config-utils';

describe('Creating Config from Command Line Arguments', () => {
  test('Returns empty object when called with empty args', () => {
    expect(createConfigFromArgs([])).toMatchObject({});
  });
});

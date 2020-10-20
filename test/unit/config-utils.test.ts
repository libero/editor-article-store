import { createConfigFromArgs, createConfigFromEnv } from '../../src/utils/config-utils';

describe('createConfigFromArgs()', () => {
 test('Support short form args', () => {
    const input = ['-p', '8080'];
    const output = {
      port: 8080
    };
    expect(createConfigFromArgs(input)).toEqual(output);
  });

  test('Cope with empty input', () => {
    const input = [''];
    const output = {};
    expect(createConfigFromArgs(input)).toEqual(output);
  });

  test('Cope with missing value(s)', () => {
    const input = ['-p'];
    const output = {};
    expect(createConfigFromArgs(input)).toEqual(output);
  });

  test('Cope with missing value(s)', () => {
    const input = ['-p'];
    const output = {};
    expect(createConfigFromArgs(input)).toEqual(output);
  });

  test('Cope with unsupported args', () => {
    const input = ['none', 'of', 'these', 'matter'];
    const output = {};
    expect(createConfigFromArgs(input)).toEqual(output);
  });

  test('Cope with all supported args', () => {
    const input = ['-p', '8080'];
    const output = {
      port: 8080
    };
    expect(createConfigFromArgs(input)).toEqual(output);
  });
});

describe('createConfigFromEnv()', () => {
  test('Cope with empty input', () => {
    const input = {};
    const output = {};
    expect(createConfigFromEnv(input)).toEqual(output);
  });

  test('Cope with unsupported args', () => {
    const input = {
      INVALID_ARG: 'invalid'
    };
    const output = {};
    expect(createConfigFromEnv(input)).toEqual(output);
  });

  test('Cope with all supported args', () => {
    const input = {
      PORT: '8080'
    };
    const output = {
      port: 8080
    };
    expect(createConfigFromEnv(input)).toEqual(output);
  });
});

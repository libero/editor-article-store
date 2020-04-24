import { createConfigFromArgs, createConfigFromEnv } from '../../src/utils/config-utils';

describe('createConfigFromArgs()', () => {
  test('Support long form args', () => {
    const input = ['--article-root', '/path/to/some/files'];
    const output = {
      articleRoot: '/path/to/some/files'
    };
    expect(createConfigFromArgs(input)).toEqual(output);
  });

  test('Support short form args', () => {
    const input = ['-r', '/path/to/some/files'];
    const output = {
      articleRoot: '/path/to/some/files'
    };
    expect(createConfigFromArgs(input)).toEqual(output);
  });

  test('Cope with empty input', () => {
    const input = [''];
    const output = {};
    expect(createConfigFromArgs(input)).toEqual(output);
  });

  test('Cope with missing value(s)', () => {
    const input = ['-r'];
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
    const input = ['-r', '/path/to/some/files', '-p', '8080'];
    const output = {
      articleRoot: '/path/to/some/files',
      port: 8080
    };
    expect(createConfigFromArgs(input)).toEqual(output);
  });
});

describe('createConfigFromEnv()', () => {
  test('Support an arg', () => {
    const input = {
      ARTICLE_ROOT: '/path/to/some/files'
    };
    const output = {
      articleRoot: '/path/to/some/files'
    };
    expect(createConfigFromEnv(input)).toEqual(output);
  });

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
      ARTICLE_ROOT: '/path/to/some/files',
      PORT: '8080'
    };
    const output = {
      articleRoot: '/path/to/some/files',
      port: 8080
    };
    expect(createConfigFromEnv(input)).toEqual(output);
  });
});

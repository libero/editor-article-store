import { Config } from '../../../src/types/config';
import { configManager } from '../../../src/services/config-manager';

describe('configManager', () => {
    test('Can add a config item', () => {
        expect(() => {
            configManager.set('test', 'value');
        }).not.toThrow();
    });

    test('Cannot overwrite an existing config item', () => {
        expect(() => {
            configManager.set('test', 'another value');
        }).toThrow();
    });

    test('Can overwrite an existing config item', () => {
        expect(() => {
            configManager.set('test', 'another value', true);
        }).not.toThrow();
    });

    test('Can get a config item', () => {
        expect(configManager.get('test')).toBe('another value');
    });

    test('Copes with trying to get a config item that does not exist', () => {
        expect(() => {
            configManager.get('invalid');
        }).toThrow();
    });

    test('Can apply a config', () => {
        const config: Config = {
            test: 'applied',
        } as Config;
        expect(() => {
            configManager.apply(config);
        }).not.toThrow();
        expect(configManager.get('test')).toBe('applied');
    });
});

import { buildDatabaseUri } from '../../../src/utils/db-utils';

describe('buildDatabaseUri', () => {
    it('creates a URI given all parameters', () => {
        const uri = buildDatabaseUri('somecluster.host.com:27017', 'root', 'password', 'replica=1&retry=true');
        expect(uri).toBe('mongodb://root:password@somecluster.host.com:27017?replica=1&retry=true');
    });
    it('creates a full URI without a query', () => {
        const uri = buildDatabaseUri('somecluster.host.com:27017', 'root', 'password');
        expect(uri).toBe('mongodb://root:password@somecluster.host.com:27017');
    });
});

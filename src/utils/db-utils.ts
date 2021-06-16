export function buildDatabaseUri(endpoint: string, user: string, password: string, query = ''): string {
    return `mongodb://${user}:${password}@${endpoint}${query ? '?' : ''}${query}`;
}

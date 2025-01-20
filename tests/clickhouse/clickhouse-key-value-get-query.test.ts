import { ClickhouseKeyValueGetQuery } from '../../src/query/clickhouse/clickhouse-key-value-get-query'
import { SpyDbConnector } from '../spy/spy-db-connector'

type TestableEntity<T> = T & { id: string; author: string; version: string }

describe('ClickhouseKeyValueGetQuery', () => {
  test('make sql string', async () => {
    const client = new SpyDbConnector()
    const query = new ClickhouseKeyValueGetQuery<TestableEntity<any>>(client, 'test_table')
    await query.get('test-id')
    expect(client.lastQuery).toBe(`SELECT * FROM "test_table" WHERE "id" = 'test-id' ORDER BY "key", "version"`)
  })
})

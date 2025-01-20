import { ClickhouseKeyValueSaveQuery } from '../../src/query/clickhouse/clickhouse-key-value-save-query'
import { SpyDbConnector } from '../spy/spy-db-connector'

type TestableEntity<T> = T & { id: string; author: string; version: string }

describe('ClickhouseKeyValueSaveQuery', () => {
  test('make sql string', async () => {
    const client = new SpyDbConnector()
    const query = new ClickhouseKeyValueSaveQuery<TestableEntity<any>>(client, 'test_table')
    await query.save({
      id: 'test-id',
      customer: 'test-customer',
      author: 'test-author',
      version: 'test-version',
      field1: 'field1-value',
      field2: 'field2-value',
      field3: 'field3-value',
    })
    expect(client.lastQuery).toEqual(
      `INSERT INTO "test_table" ("id", "key", "value", "author", "version")
      FORMAT Values
      ('test-id', 'id', 'test-id', 'test-author', 'test-version'),
      ('test-id', 'customer', 'test-customer', 'test-author', 'test-version'),
      ('test-id', 'field1', 'field1-value', 'test-author', 'test-version'),
      ('test-id', 'field2', 'field2-value', 'test-author', 'test-version'),
      ('test-id', 'field3', 'field3-value', 'test-author', 'test-version')`
        .replace(/\s{2,}/g, ' ')
        .replace(/\(\s/g, '(')
        .replace(/\s\)/g, ')'),
    )
  })
})

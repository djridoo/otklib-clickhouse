import { ClickhouseKeyValueSearchQuery } from '../../src/query/clickhouse/clickhouse-key-value-search-query'
import { SpyDbConnector } from '../spy/spy-db-connector'

describe('ClickhouseKeyValueSearchQuery', () => {
  test('make sql string to search by specified fields', async () => {
    const client = new SpyDbConnector()
    const query = new ClickhouseKeyValueSearchQuery(client)
    query.select(['a', 'b', 'c'])
    query.from('table_name')
    query.search('x', ['b', 'c'])
    await query.execute()
    expect(client.lastQuery).toEqual(
      `SELECT *
      FROM "table_name"
      WHERE in("id", (
        SELECT "id"
        FROM "table_name"
        WHERE and(
          in("key", ('b','c')),
          ilike("value", '%x%')
        )
      ))
      AND "key" IN ('a', 'b', 'c')
      ORDER BY "id", "key", "version"`
        .replace(/\s{2,}/g, ' ')
        .replace(/\(\s/g, '(')
        .replace(/\s\)/g, ')'),
    )
  })

  test('make sql string to search by all fields', async () => {
    const client = new SpyDbConnector()
    const query = new ClickhouseKeyValueSearchQuery(client)
    query.select(['a', 'b', 'c'])
    query.from('table_name')
    query.search('x')
    await query.execute()
    expect(client.lastQuery).toEqual(
      `SELECT *
      FROM "table_name"
      WHERE in("id", (
        SELECT "id"
        FROM "table_name"
        WHERE ilike("value", '%x%')
      ))
      AND "key" IN ('a', 'b', 'c')
      ORDER BY "id", "key", "version"`
        .replace(/\s{2,}/g, ' ')
        .replace(/\(\s/g, '(')
        .replace(/\s\)/g, ')'),
    )
  })

  test('make sql string to search by all fields with all output fields', async () => {
    const client = new SpyDbConnector()
    const query = new ClickhouseKeyValueSearchQuery(client)
    query.select(['*'])
    query.from('table_name')
    query.search('x')
    await query.execute()
    expect(client.lastQuery).toEqual(
      `SELECT *
      FROM "table_name"
      WHERE in("id", (
        SELECT "id"
        FROM "table_name"
        WHERE ilike("value", '%x%')
      ))
      ORDER BY "id", "key", "version"`
        .replace(/\s{2,}/g, ' ')
        .replace(/\(\s/g, '(')
        .replace(/\s\)/g, ')'),
    )
  })
})

import { and, equals, match, or, not, any, less, greater } from '@otklib/db'
import { ClickhouseKeyValueFindQuery } from '../../src/query/clickhouse/clickhouse-key-value-find-query'
import { SpyDbConnector } from '../spy/spy-db-connector'

describe('ClickhouseKeyValueFindQuery', () => {
  test('make sql string with specified output fields', async () => {
    const client = new SpyDbConnector()
    const query = new ClickhouseKeyValueFindQuery(client)
    query.select(['a', 'b', 'c'])
    query.from('table_name')
    query.where(
      and(
        equals('a', 'b'),
        match('c', 'd'),
        or(
          not(any('e', ['f', 'g', 'h'])), //
          less('i', 'j'),
          greater('k', 'l'),
        ),
      ),
    )
    await query.execute()
    expect(client.lastQuery).toEqual(
      `SELECT *
      FROM "table_name"
      WHERE and(
        in("id", (
          SELECT "id"
          FROM "table_name"
          WHERE and(
            equals("key", 'a'),
            equals("value", 'b')
          )
        )),
        in("id", (
          SELECT "id"
          FROM "table_name"
          WHERE and(
            equals("key", 'c'),
            ilike("value", '%d%')
          )
        )),
        or(
          not(in("id", (
            SELECT "id"
            FROM "table_name"
            WHERE and(
              equals("key", 'e'),
              in("value", ('f', 'g', 'h'))
            )
          ))),
          in("id", (
            SELECT "id"
            FROM "table_name"
            WHERE and(
              equals("key", 'i'),
              less("value", 'j')
            )
          )),
          in("id", (
            SELECT "id"
            FROM "table_name"
            WHERE and(
              equals("key", 'k'),
              greater("value", 'l')
            )
          ))
        )
      )
      AND "key" IN ('a', 'b', 'c')
      ORDER BY "id", "key", "version"`
        .replace(/\s{2,}/g, ' ')
        .replace(/\(\s/g, '(')
        .replace(/\s\)/g, ')'),
    )
  })

  test('make sql string with all output fields', async () => {
    const client = new SpyDbConnector()
    const query = new ClickhouseKeyValueFindQuery(client)
    query.select(['*'])
    query.from('table_name')
    query.where(equals('a', 'b'))
    await query.execute()
    expect(client.lastQuery).toEqual(
      `SELECT *
      FROM "table_name"
      WHERE in("id", (
        SELECT "id"
        FROM "table_name"
        WHERE and(
          equals("key", 'a'),
          equals("value", 'b')
        )
      ))
      ORDER BY "id", "key", "version"`
        .replace(/\s{2,}/g, ' ')
        .replace(/\(\s/g, '(')
        .replace(/\s\)/g, ')'),
    )
  })
})

import { and, any, equals, less, match, greater, not, or } from '@otklib/db'
import { ClickhouseKeyValueComparerBuilder } from '../../src/query/clickhouse/clickhouse-key-value-comparer-builder'

describe('ClickhouseKeyValueComparerBuilder', () => {
  test('compare', () => {
    const comparerBuilder = new ClickhouseKeyValueComparerBuilder(
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

    const result = comparerBuilder.build()
    expect(result).toEqual(
      `and(
        in("id", (
          SELECT "id"
          FROM "{{TABLE_NAME}}"
          WHERE and(
            equals("key", 'a'),
            equals("value", 'b')
          )
        )),
        in("id", (
          SELECT "id"
          FROM "{{TABLE_NAME}}"
          WHERE and(
            equals("key", 'c'),
            ilike("value", '%d%')
          )
        )),
        or(
          not(in("id", (
            SELECT "id"
            FROM "{{TABLE_NAME}}"
            WHERE and(
              equals("key", 'e'),
              in("value", ('f', 'g', 'h'))
            )
          ))),
          in("id", (
            SELECT "id"
            FROM "{{TABLE_NAME}}"
            WHERE and(
              equals("key", 'i'),
              less("value", 'j')
            )
          )),
          in("id", (
            SELECT "id"
            FROM "{{TABLE_NAME}}"
            WHERE and(
              equals("key", 'k'),
              greater("value", 'l')
            )
          ))
        )
      )`
        .replace(/\s{2,}/g, ' ')
        .replace(/\(\s/g, '(')
        .replace(/\s\)/g, ')'),
    )
  })
})

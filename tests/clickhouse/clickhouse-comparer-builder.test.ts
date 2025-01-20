import { and, any, equals, less, match, greater, not, or, isNull, overlap } from '@otklib/db'
import { ClickhouseComparerBuilder } from '../../src/query/clickhouse/clickhouse-comparer-builder'

describe('ClickhouseComparerBuilder', () => {
  test('compare', () => {
    const comparerBuilder = new ClickhouseComparerBuilder(
      and(
        equals('a', 'b'),
        match('c', 'd'),
        or(
          not(any('e', ['f', 'g', 'h'])), //
          less('i', 'j'),
          greater('k', 'l'),
          isNull('q'),
        ),
        overlap('r', ['a', 'b', 'c']),
      ),
    )

    const result = comparerBuilder.build()
    expect(result).toEqual(
      `and(
        equals("a", 'b'),
        ilike("c", '%d%'),
        or(
          not(in("e", ('f', 'g', 'h'))),
          less("i", 'j'),
          greater("k", 'l'),
          isNull("q")
        ),
        hasAny("r", ['a', 'b', 'c'])
      )`
        .replace(/\s{2,}/g, ' ')
        .replace(/\(\s/g, '(')
        .replace(/\s\)/g, ')'),
    )
  })
})

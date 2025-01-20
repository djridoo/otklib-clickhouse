import { QueryAst, QueryAstArg, QueryAstFn } from '@otklib/db'
import { or, not, and, equals, match, less, greater, any } from './clickhouse-key-value-condition'
import { ClickhouseComparerBuilder } from './clickhouse-comparer-builder'

export class ClickhouseKeyValueComparerBuilder extends ClickhouseComparerBuilder {
  protected fns = new Map<QueryAstFn, Function>([
    [QueryAstFn.OR, or],
    [QueryAstFn.NOT, not],
    [QueryAstFn.AND, and],
    [QueryAstFn.EQUALS, equals],
    [QueryAstFn.MATCH, match],
    [QueryAstFn.LESS, less],
    [QueryAstFn.GREATER, greater],
    [QueryAstFn.ANY, any],
  ])

  protected parseArgument(arg: QueryAstArg): QueryAstArg {
    if (arg?.['fn'] && arg?.['args']) {
      const builder = new ClickhouseKeyValueComparerBuilder(arg as QueryAst)
      return builder.build()
    }
    return arg
  }
}

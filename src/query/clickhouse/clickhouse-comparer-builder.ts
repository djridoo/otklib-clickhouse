import { QueryAst, QueryAstArg, QueryAstFn } from '@otklib/db'
import { or, not, and, equals, match, less, greater, any, isNull, overlap } from './clickhouse-condition'

export class ClickhouseComparerBuilder {
  protected fns = new Map<QueryAstFn, Function>([
    [QueryAstFn.OR, or],
    [QueryAstFn.NOT, not],
    [QueryAstFn.AND, and],
    [QueryAstFn.EQUALS, equals],
    [QueryAstFn.MATCH, match],
    [QueryAstFn.LESS, less],
    [QueryAstFn.GREATER, greater],
    [QueryAstFn.ANY, any],
    [QueryAstFn.IS_NULL, isNull],
    [QueryAstFn.OVERLAP, overlap],
  ])

  private ast: QueryAst

  constructor(ast: QueryAst) {
    this.ast = ast
  }

  public build(): string {
    const args = this.ast.args.map(this.parseArgument)
    return this.fns.get(this.ast.fn)!(...args)
  }

  protected parseArgument(arg: QueryAstArg): QueryAstArg {
    if (arg?.['fn'] && arg?.['args']) {
      const builder = new ClickhouseComparerBuilder(arg as QueryAst)
      return builder.build()
    }
    return arg
  }
}

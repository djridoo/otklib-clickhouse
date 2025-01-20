import { Query, equals, QueryAst, DbConnector } from '@otklib/db'
import { ClickhouseKeyValueComparerBuilder } from './clickhouse-key-value-comparer-builder'
import { KeyValueToRowsConverter } from './key-value-to-rows-converter'
import { KeysCondition } from './keys-condition'

export class ClickhouseKeyValueFindQuery<T> implements Query {
  private keys: string[] = ['*']

  private table: string = 'unknown'

  private ast: QueryAst = equals('id', 0)

  private readonly connector: DbConnector

  constructor(connector: DbConnector) {
    this.connector = connector
  }

  public select(keys: string[]): ClickhouseKeyValueFindQuery<T> {
    this.keys = keys
    return this
  }

  public from(table: string): ClickhouseKeyValueFindQuery<T> {
    this.table = table
    return this
  }

  public where(ast: QueryAst): ClickhouseKeyValueFindQuery<T> {
    this.ast = ast
    return this
  }

  public makeSql(): string {
    const subQueryBuilder = new ClickhouseKeyValueComparerBuilder(this.ast)
    const subQuery = subQueryBuilder.build()
    return `SELECT * FROM "{{TABLE_NAME}}" WHERE ${subQuery}${KeysCondition.make(this.keys)} ORDER BY "id", "key", "version"`
      .split('{{TABLE_NAME}}')
      .join(this.table)
  }

  public async execute(): Promise<T[]> {
    const sql = this.makeSql()
    const result = await this.connector.query(sql, {})
    return KeyValueToRowsConverter.makeRows(result)
  }
}

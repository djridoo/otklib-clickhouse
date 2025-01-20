import { Query, DbConnector } from '@otklib/db'
import { KeyValueToRowsConverter } from './key-value-to-rows-converter'
import { KeysCondition } from './keys-condition'

export class ClickhouseKeyValueSearchQuery<T> implements Query {
  private keys: string[] = ['*']

  private table: string = 'unknown'

  private text: string = ''

  private fields: string[] | null = null

  private readonly connector: DbConnector

  constructor(connector: DbConnector) {
    this.connector = connector
  }

  public select(keys: string[]): ClickhouseKeyValueSearchQuery<T> {
    this.keys = keys
    return this
  }

  public from(table: string): ClickhouseKeyValueSearchQuery<T> {
    this.table = table
    return this
  }

  public search(text: string, fields: string[] | null = null): ClickhouseKeyValueSearchQuery<T> {
    this.text = text
    this.fields = fields
    return this
  }

  public makeSql(): string {
    const subQuery = this.buildSubQuery()
    return `SELECT * FROM "{{TABLE_NAME}}" WHERE ${subQuery}${KeysCondition.make(this.keys)} ORDER BY "id", "key", "version"`
      .split('{{TABLE_NAME}}')
      .join(this.table)
  }

  public async execute(): Promise<T[]> {
    const sql = this.makeSql()
    const result = await this.connector.query(sql, {})
    return KeyValueToRowsConverter.makeRows(result)
  }

  private buildSubQuery(): string {
    const condition = this.buildCondition()
    return `in("id", (SELECT "id" FROM "{{TABLE_NAME}}" WHERE ${condition}))`
  }

  private buildCondition(): string {
    const valueCondition = `ilike("value", '%${this.text}%')`
    if (!this.fields) return valueCondition
    const keyCondition = `in("key", (${this.fields.map((field: string) => `'${field}'`).join(',')}))`
    return `and(${keyCondition}, ${valueCondition})`
  }
}

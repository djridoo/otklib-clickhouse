import { DbConnector } from '@otklib/db'
import { KeyValueToRowsConverter } from './key-value-to-rows-converter'

type EntityType<T> = T & { id: string; author: string; version: string }

export class ClickhouseKeyValueGetQuery<T> {
  private readonly table: string = 'unknown'

  private readonly connector: DbConnector

  constructor(connector: DbConnector, table: string) {
    this.connector = connector
    this.table = table
  }

  public makeSql(id: string): string {
    return `SELECT * FROM "${this.table}" WHERE "id" = '${id}' ORDER BY "key", "version"`
  }

  public async get(id: string): Promise<EntityType<T> | null> {
    const sql = this.makeSql(id)
    const results = await this.connector.query(sql, {})
    if (results.length === 0) return null
    return KeyValueToRowsConverter.makeRows(results)[0]
  }
}

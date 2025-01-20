import { DbConnector } from '@otklib/db'

type EntityType<T> = T & { id: string; author: string; version: string }

export class ClickhouseKeyValueSaveQuery<T> {
  private readonly table: string = 'unknown'

  private readonly connector: DbConnector

  constructor(connector: DbConnector, table: string) {
    this.connector = connector
    this.table = table
  }

  public makeSql(entity: EntityType<T>): string {
    const rows = Object.entries(entity).filter(([key, _]) => !['author', 'version'].includes(key))
    const rowsSql = this.makeRowsSql(rows, entity)
    return `INSERT INTO "${this.table}" ("id", "key", "value", "author", "version") FORMAT Values ${rowsSql}`
  }

  public async save(entity: EntityType<T>): Promise<void> {
    const sql = this.makeSql(entity)
    await this.connector.query(sql, {})
  }

  private makeRowsSql(rows: [string, string][], entity: EntityType<T>): string {
    return rows.map((row) => this.makeRowSql(row, entity)).join(', ')
  }

  private makeRowSql(row: [string, string], entity: EntityType<T>) {
    return `('${entity.id}', '${row[0]}', '${row[1]}', '${entity.author}', '${entity.version}')`
  }
}

import { ClickHouse } from 'clickhouse'
import { Props } from '@otklib/core'
import { DbConnector } from '@otklib/db'

interface ClickhouseDbConnectorConfig {
  url: string
  port: number
  username: string
  password: string
  database: string
}

export class ClickhouseDbConnector implements DbConnector {
  private client: ClickHouse

  constructor({ url, port, username, password, database }: ClickhouseDbConnectorConfig) {
    this.client = new ClickHouse({
      url,
      port,
      debug: false,
      basicAuth: {
        username,
        password,
      },
      isUseGzip: false,
      trimQuery: false,
      usePost: false,
      format: 'json',
      raw: false,
      config: {
        database,
      },
    })
  }

  public async query(sql: string, props: Props): Promise<Props[]> {
    const typeIsInsert = sql.toLowerCase().indexOf('insert') === 0
    return typeIsInsert ? this.insertQuery(sql, props) : this.selectQuery(sql, props)
  }

  private async selectQuery(sql: string, props: Props): Promise<Props[]> {
    return (await this.client
      .query(sql, {
        params: props,
      })
      .toPromise()) as Props[]
  }

  private async insertQuery(sql: string, props: Props): Promise<Props[]> {
    return (await this.client.insert(sql, [props]).toPromise()) as Props[]
  }
}

export class KeyValueToRowsConverter {
  public static makeRows(collection) {
    return collection.reduce((result, item) => this.makeRow(result, item), { rows: [], links: {} }).rows
  }

  private static makeRow(result, item) {
    const res = this.prepareRow(result, item)
    res.links[item.id][item.key] = item.value
    if (this.isNewVersionGreaterThenCurrent(item.version, res.links[item.id].version)) {
      res.links[item.id].version = item.version
      res.links[item.id].author = item.author
    }
    return res
  }

  private static prepareRow(result, item) {
    if (!(item.id in result.links)) {
      result.links[item.id] = {}
      result.rows.push(result.links[item.id])
    }
    return result
  }

  private static isNewVersionGreaterThenCurrent(newVersion: string, currentVersion?: string) {
    const newVersionNumber = Number.parseInt(`${newVersion}`.replace(/\D+/g, '') || '0', 10)
    const currentVersionNumber = Number.parseInt(`${currentVersion}`.replace(/\D+/g, '') || '0', 10)
    return newVersionNumber > currentVersionNumber
  }
}

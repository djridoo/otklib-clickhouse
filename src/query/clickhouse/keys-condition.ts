export class KeysCondition {
  public static make(keys: string[]) {
    if (keys.length === 1 && keys[0] === '*') return ''
    return ` AND "key" IN (${keys.map((key: string) => `'${key}'`).join(', ')})`
  }
}

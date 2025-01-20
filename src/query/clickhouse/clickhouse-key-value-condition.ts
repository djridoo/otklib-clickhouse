const makeSubQuery = (operator: string, key: string, value: string): string =>
  `in("id", (${[
    'SELECT "id"',
    'FROM "{{TABLE_NAME}}"',
    `WHERE and(equals("key", '${key}'), ${operator}("value", ${value}))`, //
  ].join(' ')}))`

export const not = (arg): string => `not(${arg})`
export const or = (...args): string => `or(${args.join(', ')})`
export const and = (...args): string => `and(${args.join(', ')})`
export const equals = (field, value): string => makeSubQuery('equals', field, `'${value}'`)
export const match = (field, value): string => makeSubQuery('ilike', field, `'%${value}%'`)
export const less = (field, value): string => makeSubQuery('less', field, `'${value}'`)
export const greater = (field, value): string => makeSubQuery('greater', field, `'${value}'`)
export const any = (field, values: string[]): string => makeSubQuery('in', field, `(${values.map((value: string) => `'${value}'`).join(', ')})`)
export const isNull = (field): string => `isNull(${field})`

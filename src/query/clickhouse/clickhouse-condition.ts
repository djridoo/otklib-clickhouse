import { QueryAstValue } from '@otklib/db'

export const not = (arg: string): string => `not(${arg})`
export const or = (...args: string[]): string => `or(${args.join(', ')})`
export const and = (...args: string[]): string => `and(${args.join(', ')})`
export const equals = (field: string, value: QueryAstValue): string => `equals("${field}", '${value}')`
export const match = (field: string, value: QueryAstValue): string => `ilike("${field}", '%${value}%')`
export const less = (field: string, value: QueryAstValue): string => `less("${field}", '${value}')`
export const greater = (field: string, value: QueryAstValue): string => `greater("${field}", '${value}')`
export const any = (field: string, values: QueryAstValue[]): string => `in("${field}", (${values.map((value) => `'${value}'`).join(', ')}))`
export const isNull = (field: string): string => `isNull("${field}")`
export const overlap = (field: string, values: QueryAstValue[]): string => `hasAny("${field}", [${values.map((value) => `'${value}'`).join(', ')}])`

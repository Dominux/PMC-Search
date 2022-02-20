import QueryOperator from "./query_operator";

// WARNING: Don't change variants order! Regex isn't the best and doesn't handle it
enum RuQueryOperator {
  Or = 'или',
  And = 'и',
  Not = 'не',
}

export default RuQueryOperator

/**
 * Perform operators translation from russian to english
 */
export function translateRu2En(rawQuery: string): string {
  Object.keys(RuQueryOperator).forEach(operator => {
    const re = new RegExp(`\\B${RuQueryOperator[operator]}\\B`, 'gmi')
    rawQuery = rawQuery.replaceAll(re, QueryOperator[operator])
  })

  return rawQuery
}

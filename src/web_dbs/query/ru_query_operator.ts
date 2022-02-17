import QueryOperator from "./query_operator";

enum RuQueryOperator {
  And = 'и',
  Or = 'или',
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

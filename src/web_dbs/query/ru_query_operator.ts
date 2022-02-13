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
  ['And', 'Or', 'Not'].forEach(operator => {
    const ruOperator = RuQueryOperator[operator]
    const re = new RegExp(`\\B${ruOperator}\\B`, 'gmi')
    rawQuery = rawQuery.replaceAll(re, QueryOperator[operator])
  })

  return rawQuery
}

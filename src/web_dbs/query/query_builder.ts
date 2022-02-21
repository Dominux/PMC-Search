import type QueryElement from './query_element'

export default class QueryBuilder {
	constructor(public rawQuery: string) {}

	compile(): Array<QueryElement> {
		const tokens = QueryBuilder.parseToTokens(this.rawQuery)
		return this.compileTokens(tokens)
	}

	/**
	 * rawQuery looks like:
	 *  human AND protein OR apple OR [human AND [apple OR rat]] AND sugar AND [breast cancer AND lol]
	 */
	public static parseToTokens(rawQuery: string): Array<string> {
		return QueryBuilder
      .addSpacesNearBrackets(rawQuery)
      .trim()
      .split(/\s+/) // any number of spaces
	}

  public static addSpacesNearBrackets(text: string): string {
		// Putting space after every '[' and before every ']' symbol
		return text
      .replaceAll('[', ' [ ')
      .replaceAll(']', ' ] ')
  }

	private compileTokens(tokens: Array<string>): Array<QueryElement> {
		let openedBracketsAmount = 0
		let subquery: Array<string> = []
		let query: Array<QueryElement> = []

		tokens.forEach((token) => {
			if (token === '[') {
				openedBracketsAmount++

				if (openedBracketsAmount > 1) {
					subquery.push(token)
				}
			} else if (token === ']') {
				openedBracketsAmount--

				if (openedBracketsAmount) {
					subquery.push(token)
				} else {
					query.push(this.compileTokens(subquery))
					subquery = []
				}
			} else if (openedBracketsAmount) {
				subquery.push(token)
			} else {
				query.push(token)
			}
		})

		return query
	}
}

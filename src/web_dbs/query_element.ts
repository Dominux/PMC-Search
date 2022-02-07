export enum QueryOperator {
	And = 'AND',
	Or = 'OR',
	Not = 'NOT',
}

export type QueryElement = QueryOperator | string | Array<QueryElement>

export class QueryBuilder {
	constructor(public rawQuery: string) {}

	compile(): Array<QueryElement> {
		const tokens = this.parseToTokens(this.rawQuery)
		return this.compileTokens(tokens)
	}

	/**
	 * rawQuery looks like:
	 *  human AND protein OR apple OR [human AND [apple OR rat]] AND sugar AND [breast cancer AND lol]
	 */
	private parseToTokens(rawQuery: string): Array<string> {
		// Putting space after every '[' and before every ']' symbol
		rawQuery = rawQuery.replaceAll('[', '[ ')
		rawQuery = rawQuery.replaceAll(']', ' ]')

		return rawQuery.split(' ')
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

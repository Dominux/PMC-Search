/**
 * Performs query matching
 *
 * Query may contain next objects:
 *  * word
 *  * AND
 *  * OR
 *  * NOT
 *  * [...] - subquery
 *
 * */
export default class Query {
	private query: RegExp

	constructor(rawQuery: string) {
		this.query = this.compile(rawQuery)
	}

	public match(text: string): Boolean {
		return false
	}

	private compile(rawQuery: string): RegExp {
		return QueryCompiler.compile(rawQuery)
	}
}

enum QueryOperator {
	And = 'AND',
	Or = 'OR',
	Not = 'NOT',
	OpenedBracket = '[',
	ClosedBracket = ']',
}

class QueryCompiler {
	static compile(rawQuery: string): RegExp {
		const tokens = QueryCompiler.parseToTokens(rawQuery)
		const re = QueryCompiler.compileTokens(tokens)
		return new RegExp(re, 'gi')
	}

	/**
	 * rawQuery looks like:
	 *  human AND protein OR apple OR [human AND [apple OR rat]] AND sugar AND [breast cancer AND lol]
	 */
	static parseToTokens(rawQuery: string): Array<string> {
		// Putting space after every '[' and before every ']' symbol
		rawQuery = rawQuery.replaceAll('[', '[ ')
		rawQuery = rawQuery.replaceAll(']', ' ]')

		return rawQuery.split(' ')
	}

	static compileTokens(tokens: Array<string>): string {
		let operator: QueryOperator | null
		let subquery: Array<string>

		return tokens.reduce((previous, current) => {
			if (
				operator == QueryOperator.OpenedBracket &&
				current != QueryOperator.ClosedBracket
			) {
				// Constructing subquery
				subquery.push(current)
				return previous
			}

			switch (current) {
				case QueryOperator.And:
				case QueryOperator.Or:
				case QueryOperator.Not:
					operator = current
					break

				case QueryOperator.OpenedBracket:
					operator = current
					break

				case QueryOperator.ClosedBracket:
					operator = null
					previous += QueryCompiler.compileTokens(subquery)

				default:
					switch (operator) {
						case QueryOperator.And:
							previous = `(${previous}).*${current}|${current}.*(${previous})`
							break
						case QueryOperator.Or:
							previous = `((${previous})|${current})`
							break
						case QueryOperator.Not:
							previous = `(?!.*${current}).*(${previous}).*$`
							break
						default:
							previous = `(${previous}).*${current}|${current}.*(${previous})`
					}
			}

			return previous
		}, '')
	}
}

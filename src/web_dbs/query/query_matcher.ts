import { QueryOperator } from './query_element'
import type { QueryElement } from './query_element'

const RUNTIME_TYPE_CHECKING = `
  if (typeof articlePart !== 'string') {
    throw TypeError('articlePart is not type of string')
  }
`

export default class QueryMatcher {
	readonly matchingFunc: Function
  private innerVarName = 'articlePart'

	public match(text: string): boolean {
		return this.matchingFunc(text)
	}

	constructor(query: Array<QueryElement>) {
		this.matchingFunc = this.buildQueryMatcher(query)
	}

	private buildQueryMatcher(query: Array<QueryElement>): Function {
		const condition = this.createCondition(query)
		return new Function(this.innerVarName, `${RUNTIME_TYPE_CHECKING}return ${condition}`)
	}

	private createCondition(query: Array<QueryElement>): string {
    let resultCondition = ''
    let operator = ''

		query.forEach((element) => {
      switch (element) {

        case QueryOperator.And:
          operator = '&&'
          break

        case QueryOperator.Or:
          operator = '||'
          break

        case QueryOperator.Not:
          operator = `&& !`
          break

        default:
          // Consuming operator's value, so we get it or set default as AND operator
          if (resultCondition) {
            operator = operator || '&&'
          }

          if (typeof element === 'object') {
            // Getting sub condition recursively
            element = this.createCondition(element)
          } else {
            element = this.createConditionFromWord(element)
          }

          // Appending next element
          resultCondition = `(${resultCondition} ${operator} ${element})`

          // Cause we consumed it's value, we gotta empty it
          operator = ''
      }
    })

		return resultCondition
	}

  /** Perform converting a word into condition */
  private createConditionFromWord(word: string): string {
    return `${this.innerVarName}.includes("${word}")`
  }
}

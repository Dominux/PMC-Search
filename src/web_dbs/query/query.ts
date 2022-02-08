import { QueryBuilder } from "./query_element"
import type { QueryElement } from "./query_element"
import QueryMatcher from "./query_matcher"

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
	private query: Array<QueryElement>
	private queryMatcher: QueryMatcher

	constructor(rawQuery: string) {
		this.query = this.compile(rawQuery)
    this.queryMatcher = this.createQueryMatcher(this.query)
	}

	public match(text: string): boolean {
    return this.queryMatcher.match(text)
	}

	private compile(rawQuery: string): Array<QueryElement> {
		const builder = new QueryBuilder(rawQuery)
		return builder.compile()
	}

  private createQueryMatcher(query: Array<QueryElement>): QueryMatcher {
    return new QueryMatcher(query)
  }
}

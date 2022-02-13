import QueryBuilder from "./query_builder"
import type QueryElement from "./query_element"
import QueryMatcher from "./query_matcher"
import { translateRu2En } from "./ru_query_operator"

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
  readonly rawQuery: string
	private query: Array<QueryElement>
	private queryMatcher: QueryMatcher

	constructor(rawQuery: string) {
    this.rawQuery = this.translate(rawQuery)
		this.query = this.compile(this.rawQuery)
    this.queryMatcher = this.createQueryMatcher(this.query)
	}

	public match(text: string): boolean {
    return this.queryMatcher.match(text)
	}
  
  private translate(text: string): string {
    return translateRu2En(text)
  }

	private compile(rawQuery: string): Array<QueryElement> {
		const builder = new QueryBuilder(rawQuery)
		return builder.compile()
	}

  private createQueryMatcher(query: Array<QueryElement>): QueryMatcher {
    return new QueryMatcher(query)
  }
}

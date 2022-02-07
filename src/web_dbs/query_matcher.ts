import type { QueryElement } from "./query_element"

export default class QueryMatcher {
  private matchingFunc: Function

  public match(): boolean {
    return this.matchingFunc()
  }

  constructor(query: Array<QueryElement>) {
    this.matchingFunc = this.contructMatchingFunc(query)
  }

  private contructMatchingFunc(query: Array<QueryElement>): Function {
    // TODO
    return new Function()
  }
}

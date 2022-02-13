import type QueryOperator from "./query_operator"

type QueryElement = QueryOperator | string | Array<QueryElement>

export default QueryElement

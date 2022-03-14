export type DataTable = string

const COLLUMN_SEPARATER = ','
const LINE_SEPARATER = '\n'

export default function build_datatable(collection: Array<Object>): DataTable {
  const headers = Object.keys(collection[0])
  const lines = [headers, ...collection.map(c => Object.values(c))]
  return lines.map(line => line.join(COLLUMN_SEPARATER)).join(LINE_SEPARATER)
}

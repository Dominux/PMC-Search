import type { ID } from "./article"
import { PMC_ARTICLE_BASEURL } from "./constants"

export type DataTableFormat = string

const COLLUMN_SEPARATER = '\t'
const LINE_SEPARATER = '\n'

export default function buildDataTable(collection: Array<Object>): DataTableFormat {
  const headers = Object.keys(collection[0])
  const lines = [headers, ...collection.map(c => Object.values(c))]
  return lines.map(line => line.join(COLLUMN_SEPARATER)).join(LINE_SEPARATER)
}


export class DataTableArticle {
  url: URL

  constructor(
    public pmcID: ID,
    public title: string,
    public keywords: string,
  ) {
    this.url = new URL(`${PMC_ARTICLE_BASEURL}${pmcID}`)
  }
}

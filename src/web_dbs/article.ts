import { PMC_ARTICLE_BASEURL, NCBI_BASEURL } from './constants'

// Type-aliasing
export type ID = string

export default class Article {
	constructor(readonly id: ID, readonly content: string) {}
}

export class ArticleOverview {
	constructor(
		readonly id: ID,
		readonly title: string,
		readonly body: string,
		readonly authors: Array<ArticleAuthor>,
    readonly bibliographicData: string,
	) {}

	public get url(): URL {
		return new URL(`${PMC_ARTICLE_BASEURL}${this.id}`)
	}
}

export class ArticleAuthor {
  readonly url: URL

	constructor(readonly name: string, url: string) {
    // NOTE: in localhost url isn't proper cause there we have to remove port and change protocol
    this.url = new URL(url)
    this.url.hostname = NCBI_BASEURL
  }
}

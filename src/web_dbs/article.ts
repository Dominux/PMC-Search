import { PMC_ARTICLE_BASEURL } from "./constants"

// Type-aliasing
export type ID = string

export default class Article {
  constructor(
    readonly id: ID,
    readonly content: string,
  ) {}
}

export class ArticleOverview {
	constructor(
		readonly id: ID,
		readonly title: string,
		readonly body: string,
	) {}

	public get url(): URL {
		return new URL(`${PMC_ARTICLE_BASEURL}${this.id}`)
	}
}

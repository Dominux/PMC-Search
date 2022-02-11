import pmcClient from './webdbs_clients/pmc_client'
import Query from './query/query'
import PMCArticleParser from './parsers/pmc_parser'
import type { ID } from './article'

/* High-level searching service */
export default class Searcher {
	private _state: SearchingState

  public get state(): SearchingState {
    return this._state
  }
  
  constructor(
    public originalArticles: Array<ID>,
    public reviewArticles: Array<ID>,
  ) {}
  
	/** Main function */
	async search(rawQuery: string) {
		this._state = SearchingState.GettingIds

		// 1. Parsing raw query
		const query = new Query(rawQuery)

		// 2. Getting ids
		let pmcids = await pmcClient.getIds(rawQuery)

		this._state = SearchingState.GettingAndParsingArticles

		const pmcParser = new PMCArticleParser()

		await Promise.all(
			pmcids.slice(0, 100).map(async (id) => {
				// 3. Getting article
				const article = await pmcClient.getArticleById(id)

				// 4. Parsing
				const text = pmcParser.parse(article)

				if (!text) {
					this.reviewArticles.push(article.id)
					return
				}

				// 5. Query matching
				if (query.match(text)) {
					this.originalArticles.push(article.id)
				} else {
					this.reviewArticles.push(article.id)
				}
			})
		)

		console.log(this.originalArticles, this.reviewArticles)
    this._state = SearchingState.Completed
	}
}

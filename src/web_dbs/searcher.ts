import pmcClient from './webdbs_clients/pmc_client'
import Query from './query/query'
import PMCArticleParser from './parsers/pmc_parser'
import type { ID } from './article'

/* High-level searching service */
export class Searcher {
	/** Main function */
	async search(rawQuery: string) {
		// 1. Parsing raw query
		const query = new Query(rawQuery)

		// 2. Getting ids
		let pmcids = await pmcClient.getIds(rawQuery)

		const reviewArticles: Array<ID> = []
		const searchedArticles: Array<ID> = []

    const pmcParser = new PMCArticleParser()

		await Promise.all(
			pmcids.slice(0, 100).map(async (id) => {
				// 3. Getting article
        const article = await pmcClient.getArticleById(id)

				// 4. Parsing
				const text = pmcParser.parse(article)

				if (!text) {
					reviewArticles.push(article.id)
					return
				}

				// 5. Query matching
				if (query.match(text)) {
          console.log("lol")
					searchedArticles.push(article.id)
				} else {
					reviewArticles.push(article.id)
				}
			})
		)

    console.log(searchedArticles, reviewArticles)
	}
}

const searcher = new Searcher()
export default searcher

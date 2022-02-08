// import pmcClient from './webdbs_clients/pmc_client';
import pubmedClient from './webdbs_clients/pubmed_client'
import PubmedArticleParser from './parsers/pubmed_parser'
import Query from './query/query'

/* High-level searching service */
export class Searcher {
	/** Main function */
	async search(rawQuery: string) {
		// 1. Parsing raw query
		const query = new Query(rawQuery)

		// 2. Getting ids
		const pubmedIds = await pubmedClient.getIds(rawQuery)

		// Getting pubmed articles, parsing and matching them
    const result: string[] = []
		await Promise.all(
			pubmedIds.slice(0, 100).map(async (id) => {
				// Getting article
				const article = await pubmedClient.getArticleById(id)

				// Parsing it
				const articlePart = new PubmedArticleParser().parse(article)

        // Matching it
        if (articlePart && query.match(articlePart)) {
          result.push(article)
        }
			})
		)

		console.log('result:', result)
	}
}

const searcher = new Searcher()
export default searcher

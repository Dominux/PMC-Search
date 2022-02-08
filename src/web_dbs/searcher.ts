// import pmcClient from './webdbs_clients/pmc_client';
import pubmedClient from './webdbs_clients/pubmed_client'
import Query from './query/query'

/* High-level searching service */
export class Searcher {
  /** Main function */
  async search(rawQuery: string) {
    // 1. Parsing raw query
    const query = new Query(rawQuery)

    // 2. Getting ids
    const pubmedIds = await pubmedClient.getIds(rawQuery)

    // TODO: create awaiting for this
    await Promise.all(pubmedIds.slice(0, 100).map(async id => {
      // 3. Getting article
      await pubmedClient.getArticleById(id)

      // 4. Parsing it
    }))

    console.log("lol")
  }
}

const searcher = new Searcher()
export default searcher

// import pmcClient from './webdbs_clients/pmc_client';
import pubmedClient from './webdbs_clients/pubmed_client'

/** High-level searching service */
export class Searcher {
  /** Main function */
  async search(rawQuery: string) {
    // 1. Parsing raw query

    // 2. Getting ids
    const pubmedIds = await pubmedClient.getIds(rawQuery)

    await pubmedIds.forEach(async id => {
      // 3. Getting article
      await pubmedClient.getArticleById(id)

      // 4. Parsing it
    })

    console.log("lol")
  }
}

const searcher = new Searcher()
export default searcher

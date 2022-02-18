<main>
  <div class="searchbar">
    <SearchBar on:search={event => search(event.detail.rawQuery)}/>
  </div>

  <div style="min-width: 60%;">
    <Loading 
      buffer={articlesAmount}
      originalArticlesAmount={originalArticles.length} 
      reviewArticlesAmount={reviewArticles.length} 
      searchingState={state}
    />
  </div>

  {#if state === SearchingState.Completed}
    <div style="margin: 0 50px">
      <h3>
        По вашему запросу найдено 
        <strong>{originalArticles.length}</strong> оригинальных и
        <strong>{reviewArticles.length}</strong> обзорных статей
      </h3>
      <ul class="results-list">
        {#each articlesOverviews as articleOverview}
          <li>
            <ArticleOverviewItem articleOverview={articleOverview}/>
          </li>
        {/each}
    </div>
  {/if}
</main>

<script lang="ts">
  import Loading from './Loading.svelte'
  import ArticleOverviewItem from './ArticleOverviewItem.svelte';
  import SearchBar from "./Searchbar.svelte";
    
  import type {ArticleOverview, ID} from './web_dbs/article'
  import Query from './web_dbs/query/query'
  import pmcClient from './web_dbs/webdbs_clients/pmc_client'
  import PMCArticleParser from './web_dbs/parsers/pmc_parser'
  import SearchingState from './web_dbs/searching_state'

  ///////////////////////////////////////////////////////////////////
  //  Variables
  ///////////////////////////////////////////////////////////////////

  const pmcParser = new PMCArticleParser()

  let state: SearchingState
  let articlesAmount = 0
  let originalArticles: Array<ID> = []
  let reviewArticles: Array<ID> = []
  let articlesOverviews: Array<ArticleOverview>

  ///////////////////////////////////////////////////////////////////
  //  Functions
  ///////////////////////////////////////////////////////////////////

	/** Main function */
	async function search(rawQuery) {
    articlesAmount = 0

    originalArticles = []
    reviewArticles = []

		state = SearchingState.GettingIds

		// 1. Parsing raw query
		const query = new Query(rawQuery)

		// 2. Getting ids
		let pmcids = (await pmcClient.getIds(query.rawQuery)).slice(0, 100)
    articlesAmount = pmcids.length

		state = SearchingState.GettingAndParsingAndQueryMatchingArticles

    const chunk_size = 100
    let pmcids_chunks: Array<Array<ID>> = []
    for (let i = 0; i < pmcids.length; i += chunk_size) {
      pmcids_chunks.push(pmcids.slice(i, i + chunk_size))
    }

    // Running fetching syncroniously in chunks cause of net::ERR_INSUFFICIENT_RESOURCES
    for (const chunk of pmcids_chunks) {
      await Promise.all(
        chunk.map(async (id) => {
          // 3. Getting article
          const article = await pmcClient.getArticleById(id)

          // 4. Parsing
          const text = pmcParser.parse(article)

          if (!text) {
            reviewArticles = [...reviewArticles, article.id]
            return
          }

          // 5. Query matching
          if (query.match(text)) {
            originalArticles = [...originalArticles, article.id]
          } else {
            reviewArticles = [...reviewArticles, article.id]
          }
        })
      )
    }
      
		console.log("Results:", {originalArticles, reviewArticles})

    state = SearchingState.GettingArticlesOverviews

    articlesOverviews = await getArticlesOverviews(originalArticles)

    state = SearchingState.Completed
	}

  async function getArticleOverview(articleID: ID): Promise<ArticleOverview> {
    const article = await pmcClient.getArticleById(articleID)
    return pmcParser.getArticleOverview(article)
  }

  async function getArticlesOverviews(articlesIds: Array<ID>): Promise<Array<ArticleOverview>> {
    return await Promise.all(articlesIds.map(async id => await getArticleOverview(id)))
  }
</script>

<style>
.searchbar {
  width: 60%;
  margin: 3rem auto 0;
  /* display: flex;
  justify-self: center; */
}

.results-list {
  list-style-type: none;
  padding: 0;
}
</style>

<main>
  <div class="searchbar">
    <Autocomplete
      combobox 
      bind:value={rawQuery}
      bind:text={rawQuery}
    >
      <Textfield class="shaped-outlined" label="Поиск" bind:value={rawQuery} variant="outlined">
        <Fab slot="trailingIcon" color="primary" on:click={search}> 
          <Icon class="material-icons">search</Icon>
        </Fab>
      </Textfield>
    </Autocomplete>
  </div>
  <br/>
  <div style="min-width: 60%;">
    <Loading 
      buffer={articlesAmount}
      originalArticlesAmount={originalArticles.length} 
      reviewArticlesAmount={reviewArticles.length} 
      searchingState={state}
    />
  </div>
</main>

<script lang="ts">
  import Autocomplete from '@smui-extra/autocomplete'
  import Textfield from '@smui/textfield'
  import { Icon } from '@smui/common'
  import Fab from '@smui/fab'

  import Loading from './Loading.svelte';
  
  import type {ID} from './web_dbs/article'
  import Query from './web_dbs/query/query';
  import pmcClient from './web_dbs/webdbs_clients/pmc_client'
  import PMCArticleParser from './web_dbs/parsers/pmc_parser'
  import SearchingState from './web_dbs/searching_state'

  let rawQuery: string = ''
  let articlesAmount = 0
  let originalArticles: Array<ID> = []
  let reviewArticles: Array<ID> = []
  let state: SearchingState

	/** Main function */
	async function search() {
    articlesAmount = 0

    // TODO: remove
    originalArticles = []
    reviewArticles = []

		state = SearchingState.GettingIds

		// 1. Parsing raw query
		const query = new Query(rawQuery)

		// 2. Getting ids
		let pmcids = (await pmcClient.getIds(rawQuery)).slice(0, 15)
    articlesAmount = pmcids.length

		state = SearchingState.GettingAndParsingArticles

		const pmcParser = new PMCArticleParser()

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
      
    state = SearchingState.Completed
		console.log("Results:", {originalArticles, reviewArticles})
	}
</script>

<style>
main {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.searchbar {
  min-width: 100%;
  display: flex;
  justify-content: center;
}
</style>

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
  <Loading 
    originalArticlesAmount={originalArticles.length} 
    reviewArticlesAmount={reviewArticles.length} 
    searchingState={state}
  />
</main>

<script lang="ts">
  import Autocomplete from '@smui-extra/autocomplete'
  import Textfield from '@smui/textfield'
  import { Icon } from '@smui/common'
  import Fab from '@smui/fab'

  import Loading from './Loading.svelte';
  
  import type {ID} from './web_dbs/article'
  import Query from './web_dbs/query/query';
  import pmcClient from './web_dbs/webdbs_clients/pmc_client';
  import PMCArticleParser from './web_dbs/parsers/pmc_parser';

  enum SearchingState {
    GettingIds,
    GettingAndParsingArticles,
    Completed,
  }

  let rawQuery: string = ''
  let originalArticles: Array<ID> = []
  let reviewArticles: Array<ID> = []
  let state: SearchingState

	/** Main function */
	async function search() {
		state = SearchingState.GettingIds

		// 1. Parsing raw query
		const query = new Query(rawQuery)

		// 2. Getting ids
		let pmcids = await pmcClient.getIds(rawQuery)

		state = SearchingState.GettingAndParsingArticles

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
					originalArticles.push(article.id)
				} else {
					reviewArticles.push(article.id)
				}
			})
		)

		console.log(originalArticles, reviewArticles)
    state = SearchingState.Completed
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

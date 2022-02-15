<main>
  <div class="searchbar">
    <Autocomplete
      combobox 
      options={autocompleteOptions}
      style="width: 60%;"
      bind:value={autocompleteValue}
      bind:text={autocompleteValue}
      on:SMUIAutocomplete:selected={onSelectAutocompleteOption}
    >
      <Textfield 
        class="shaped-outlined" 
        variant="outlined"
        label="Поиск" 
        style="width: 100%;"
        bind:this={searchBarElement}
        bind:value={rawQuery} 
      >
        <Fab slot="trailingIcon" color="primary" on:click={search}> 
          <Icon class="material-icons">search</Icon>
        </Fab>
      </Textfield>
    </Autocomplete>
  </div>
  {autocompleteValue}

  <div style="min-width: 60%;">
    <Loading 
      buffer={articlesAmount}
      originalArticlesAmount={originalArticles.length} 
      reviewArticlesAmount={reviewArticles.length} 
      searchingState={state}
    />
  </div>

  {#if articlesAmount && state === SearchingState.Completed}
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
  import { onMount } from 'svelte'

  import Autocomplete from '@smui-extra/autocomplete'
  import Textfield, { TextfieldComponentDev } from '@smui/textfield'
  import { Icon } from '@smui/common'
  import Fab from '@smui/fab'

  import Loading from './Loading.svelte'
  import ArticleOverviewItem from './ArticleOverviewItem.svelte';
    
  import type {ArticleOverview, ID} from './web_dbs/article'
  import Query from './web_dbs/query/query'
  import QueryBuilder from './web_dbs/query/query_builder'
  import RuQueryOperator from './web_dbs/query/ru_query_operator'
  import pmcClient from './web_dbs/webdbs_clients/pmc_client'
  import PMCArticleParser from './web_dbs/parsers/pmc_parser'
  import SearchingState from './web_dbs/searching_state'
  import { SEARCHBAR_ONMOUNT_FOCUSING_TIMEOUT } from './web_dbs/constants'

  ///////////////////////////////////////////////////////////////////
  //  Variables
  ///////////////////////////////////////////////////////////////////

  const pmcParser = new PMCArticleParser()

  let searchBarElement: TextfieldComponentDev
  let rawQuery = ''
  let autocompleteValue = ''
  let autocompleteOptions = []
  let state: SearchingState
  let articlesAmount = 0
  let originalArticles: Array<ID> = []
  let reviewArticles: Array<ID> = []
  let articlesOverviews: Array<ArticleOverview>

  ///////////////////////////////////////////////////////////////////
  //  Reactive declarations
  ///////////////////////////////////////////////////////////////////

  // $: autocompleteOptions = rawQuery.length % 2 == 0 ? ['[', ']'] : ['lol', 'kek']
  $: {
    // Checking user raw query while he's typing
    const query = QueryBuilder.parseToTokens(rawQuery)
    const lastWord = query[query.length - 1]

    if (!lastWord || [...Object.values<string>(RuQueryOperator), '['].includes(lastWord)) {
      autocompleteOptions = ['[', ']']
    } else {
      autocompleteOptions = [...Object.values(RuQueryOperator), '[', ']']
    }
  }

  ///////////////////////////////////////////////////////////////////
  //  Lifecycle hooks
  ///////////////////////////////////////////////////////////////////
  
  onMount(() => {
    // running focusing on search bar
    setTimeout(() => {
      searchBarElement.focus()
    }, SEARCHBAR_ONMOUNT_FOCUSING_TIMEOUT)
  })

  ///////////////////////////////////////////////////////////////////
  //  Functions
  ///////////////////////////////////////////////////////////////////

  function onSelectAutocompleteOption() {
    rawQuery = rawQuery ? `${rawQuery} ${autocompleteValue}` : autocompleteValue 
    autocompleteValue = ''
  }

  async function handleKeyPress(event: CustomEvent | KeyboardEvent) {
    // Handling keypress
    event = event as KeyboardEvent
    if (event.key === 'Enter') {
      // Unfocusing element
      const target = event.target as HTMLElement 
      target.blur()

      // Running search
      await search()
    }
  }

	/** Main function */
	async function search() {
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
  margin-top: 42px;
  min-width: 100%;
  display: flex;
  justify-content: center;
}

.results-list {
  list-style-type: none;
  padding: 0;
}
</style>

<script lang="ts">
	import Switch from '@smui/switch'
	import FormField from '@smui/form-field'

	import Filters from './Filters.svelte'
	import Loading from './Loading.svelte'
	import SearchBar from './Searchbar.svelte'
	import ArticlesOverviewsComponent from './ArticlesOverviewsComponent.svelte'
	import SearchHistory from './SearchHistory.svelte'

	import type { ID } from './web_dbs/article'
	import Query from './web_dbs/query/query'
	import pmcClient from './web_dbs/webdbs_clients/pmc_client'
	import PMCArticleParser from './web_dbs/parsers/pmc_parser'
	import SearchingState from './web_dbs/states'
	import history from './stores/history_store'
	import type { HistoryRecord } from './stores/history_store'

	///////////////////////////////////////////////////////////////////
	//  Variables
	///////////////////////////////////////////////////////////////////

	const pmcParser = new PMCArticleParser()

	let state: SearchingState
	let rawQuery: string
	let articlesAmount = 0
	let originalArticles: Array<ID> = []
	let reviewArticles: Array<ID> = []
	let toShowReviewArticlesOverviews = true
	let minPubDate: number
	let maxPubDate: number
	let articlesLimit: number
	let originalArticlesLimit: number

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
		let pmcids = await pmcClient.getIds(
			query.rawQuery,
			articlesLimit,
			minPubDate,
			maxPubDate
		)
		articlesAmount = pmcids.length

		state = SearchingState.Processing

		const chunk_size = 100
		let pmcids_chunks: Array<Array<ID>> = []
		for (let i = 0; i < pmcids.length; i += chunk_size) {
			pmcids_chunks.push(pmcids.slice(i, i + chunk_size))
		}

		// Running fetching syncroniously in chunks cause of net::ERR_INSUFFICIENT_RESOURCES
		for (const chunk of pmcids_chunks) {
			// Stopping process if it's completed
			if (state !== SearchingState.Processing) break

			await Promise.all(
				chunk.map(async (id) => {
					// 3. Getting article
					const article = await pmcClient.getArticleById(id)

					// 4. Parsing
					const text = pmcParser.parse(article)

					// Stopping process if it's completed
					if (state !== SearchingState.Processing) return

					if (!text) {
						reviewArticles = [...reviewArticles, article.id]
						return
					}

					// 5. Query matching
					if (query.match(text)) {
						originalArticles = [...originalArticles, article.id]

						if (
							originalArticlesLimit &&
							originalArticles.length === originalArticlesLimit
						) {
							state = SearchingState.Completed
						}
					} else {
						reviewArticles = [...reviewArticles, article.id]
					}
				})
			)
		}

		console.log('Results:', { originalArticles, reviewArticles })

		// Saving raw query with results in history
		const record: HistoryRecord = {
			rawQuery: rawQuery,
			results: {
				original: originalArticles,
				review: reviewArticles,
			},
		}
		history.createRecord(record)

		state = SearchingState.Completed
	}
</script>

<main>
	<div class="searchbar">
		<SearchBar
			bind:rawQuery
			on:search={(event) => search(event.detail.rawQuery)}
		/>

		<SearchHistory
			on:useRecord={(event) => {
				rawQuery = event.detail.rawQuery
				originalArticles = event.detail.results.original
				reviewArticles = event.detail.results.review
				state = SearchingState.Completed
			}}
		/>

		<Filters
			bind:minPubDate
			bind:maxPubDate
			bind:articlesLimit
			bind:originalArticlesLimit
		/>

		<FormField>
			<Switch bind:checked={toShowReviewArticlesOverviews} icons={false} />
			<span slot="label">Показать обзорные статьи</span>
		</FormField>
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
		<ArticlesOverviewsComponent
			{originalArticles}
			{reviewArticles}
			{toShowReviewArticlesOverviews}
		/>
	{/if}
</main>

<style>
	.searchbar {
		width: 60%;
		margin: 3rem auto 0;
	}
</style>

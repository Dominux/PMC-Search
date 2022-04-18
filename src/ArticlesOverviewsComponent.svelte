<script lang="ts">
	import InfiniteScroll from './InfiniteScroll.svelte'

	import ArticleOverviewItem from './ArticleOverviewItem.svelte'

	import type Article from './web_dbs/article'
	import type { ArticleOverview, ID } from './web_dbs/article'
	import PMCArticleParser from './web_dbs/parsers/pmc_parser'
	import pmcClient from './web_dbs/webdbs_clients/pmc_client'
	import { DEFAULT_BATCH_SIZE } from './web_dbs/constants'
	import ExportToDataTable from './ExportToDataTable.svelte'
	import CircularProgress from '@smui/circular-progress/src/CircularProgress.svelte'

	export let originalArticles: Array<ID>
	export let reviewArticles: Array<ID>
	export let originalArticlesOverviews: Array<Article>
	export let reviewArticlesOverviews: Array<Article>
	export let toShowReviewArticlesOverviews: boolean

	let batchSize = DEFAULT_BATCH_SIZE
	let is_fetching = false
	let oldArticlesAmount = 0
	let innerOriginalArticlesOverviews: Array<ArticleOverview> = []
	let innerReviewArticlesOverviews: Array<ArticleOverview> = []

	const pmcParser = new PMCArticleParser()

	$: if (oldArticlesAmount === 0) {
		// On first search
		if (originalArticlesOverviews.length && reviewArticlesOverviews.length) {
			innerOriginalArticlesOverviews = originalArticlesOverviews.map((a) =>
				pmcParser.getArticleOverview(a)
			)
			innerReviewArticlesOverviews = reviewArticlesOverviews.map((a) =>
				pmcParser.getArticleOverview(a)
			)
		} else {
			innerOriginalArticlesOverviews = []
			innerReviewArticlesOverviews = []
			fetchNextBatch().then()
		}

		oldArticlesAmount = originalArticles.length + reviewArticles.length
	}

	async function fetchNextBatch(): Promise<void> {
		if (is_fetching) {
			return
		}

		is_fetching = true

		const newOriginalArticlesOverviews = await getArticlesOverviews(
			originalArticles.slice(
				innerOriginalArticlesOverviews.length,
				innerOriginalArticlesOverviews.length + batchSize
			)
		)
		innerOriginalArticlesOverviews = [
			...innerOriginalArticlesOverviews,
			...newOriginalArticlesOverviews,
		]

		if (toShowReviewArticlesOverviews) {
			const newReviewArticlesOverviews = await getArticlesOverviews(
				reviewArticles.slice(
					innerReviewArticlesOverviews.length,
					innerReviewArticlesOverviews.length + batchSize
				)
			)

			innerReviewArticlesOverviews = [
				...innerReviewArticlesOverviews,
				...newReviewArticlesOverviews,
			]
		}

		is_fetching = false
	}

	async function getArticlesOverviews(
		articlesIds: Array<ID>
	): Promise<Array<ArticleOverview>> {
		return await Promise.all(
			articlesIds.map(async (id) => await getArticleOverview(id))
		)
	}

	async function getArticleOverview(articleID: ID): Promise<ArticleOverview> {
		const article = await pmcClient.getArticleById(articleID)
		return pmcParser.getArticleOverview(article)
	}
</script>

<div style="margin: 0">
	<h3 class="results-title">
		По вашему запросу найдено
		<strong>{originalArticles.length}</strong> оригинальных и
		<strong>{reviewArticles.length}</strong> обзорных статей
	</h3>

	<!-- TODO: change to CSS Grid -->
	<div class="flex-results" style="margin: 0 100px;">
		<ExportToDataTable articles={innerOriginalArticlesOverviews} />
		{#if toShowReviewArticlesOverviews}
			<h2 class="header">Оригинальные</h2>
			<ExportToDataTable articles={innerOriginalArticlesOverviews} />
			<h2 class="header">Обзорные</h2>
		{/if}
	</div>

	<div class="flex-results">
		<!-- Original articles -->

		<ul class="results-list">
			{#each innerOriginalArticlesOverviews as articleOverview}
				<li>
					<ArticleOverviewItem {articleOverview} />
				</li>
			{/each}
		</ul>

		<!-- Review articles -->
		{#if toShowReviewArticlesOverviews}
			<ul class="results-list">
				{#each innerReviewArticlesOverviews as articleOverview}
					<li>
						<ArticleOverviewItem {articleOverview} />
					</li>
				{/each}
			</ul>
		{/if}
	</div>

	<InfiniteScroll bottomHeight={1000} on:scroll={fetchNextBatch} />

	{#if is_fetching}
		<div style="text-align: center;">
			<CircularProgress style="height: 50px; width: 50px;" indeterminate />
		</div>
	{/if}
</div>

<style>
	.results-title {
		text-align: center;
		font-size: 24px;
	}

	.flex-results {
		display: flex;
		justify-content: space-around;
	}

	.results-list {
		list-style-type: none;
		padding: 0;
	}

	.header {
		width: 50%;
		text-align: center;
	}
</style>

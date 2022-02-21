<div style="margin: 0 50px">
  <h3>
    По вашему запросу найдено 
    <strong>{originalArticles.length}</strong> оригинальных и
    <strong>{reviewArticles.length}</strong> обзорных статей
  </h3>

  <!-- TODO: change to CSS Grid -->
  <div class="flex-results">
    <h2 class="header">Оригинальные</h2>
    <h2 class="header">Обзорные</h2>
  </div>

  <div class="flex-results">
    <!-- Original articles -->
    <ul class="results-list">
      {#each originalArticlesOverviews as articleOverview}
        <li>
          <ArticleOverviewItem {articleOverview}/>
        </li>
      {/each}
    </ul>

    <!-- Review articles -->
    {#if toShowReviewArticlesOverviews}
      <ul class="results-list">
        {#each reviewArticlesOverviews as articleOverview}
          <li>
            <ArticleOverviewItem {articleOverview}/>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</div>

<script lang="ts">
  import ArticleOverviewItem from './ArticleOverviewItem.svelte'
    
  import type {ArticleOverview, ID} from './web_dbs/article'
  import PMCArticleParser from './web_dbs/parsers/pmc_parser'
  import pmcClient from './web_dbs/webdbs_clients/pmc_client'

  export let originalArticles: Array<ID>
  export let reviewArticles: Array<ID>
  export let toShowReviewArticlesOverviews: boolean

  let batchSize = 20
  let oldArticlesAmount = 0
  let originalArticlesOverviews: Array<ArticleOverview>
  let reviewArticlesOverviews: Array<ArticleOverview>

  const pmcParser = new PMCArticleParser()

  $: if(oldArticlesAmount !== originalArticles.length + reviewArticles.length) {
    originalArticlesOverviews = []
    reviewArticlesOverviews = []
    fetchNextBatch().then()    
  }

  async function fetchNextBatch(): Promise<void> {
    const newOriginalArticlesOverviews = await getArticlesOverviews(
      originalArticles.slice(originalArticlesOverviews.length, originalArticlesOverviews.length + batchSize)
    )
    const newReviewArticlesOverviews = await getArticlesOverviews(
      reviewArticles.slice(reviewArticlesOverviews.length, reviewArticlesOverviews.length + batchSize)
    )
    originalArticlesOverviews = [...originalArticlesOverviews, ...newOriginalArticlesOverviews]
    reviewArticlesOverviews = [...reviewArticlesOverviews, ...newReviewArticlesOverviews]
  }
  
  async function getArticlesOverviews(articlesIds: Array<ID>): Promise<Array<ArticleOverview>> {
    return await Promise.all(articlesIds.map(async id => await getArticleOverview(id)))
  }

  async function getArticleOverview(articleID: ID): Promise<ArticleOverview> {
    const article = await pmcClient.getArticleById(articleID)
    return pmcParser.getArticleOverview(article)
  }
</script>

<style>
  .flex-results {
    display: flex;
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

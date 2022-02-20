<div class="card-wrapper">
  <Card elevation={6}>
    <Content class="mdc-typography--body2">

      <!-- Title -->
      <h2 class="mdc-typography--headline6" style="margin-top: 0; font-size: 1.2rem;">
        <a href={articleOverview.url.toString()}>{articleOverview.title}</a>
      </h2>

      <!-- Body -->
      {articleOverviewBody} 
      <span class="readmore-toggle" on:click={() => toShowFullBody = !toShowFullBody}>
        {toShowFullBody ? "  Свернуть" : "  Читать ещё"}
      </span>

      <!-- Authors and bibliopraphic sht -->
      <div style="margin-top: 1rem;">
        {#each articleOverview.authors as author}
          <!-- using {', '} cause using ,&#32; doesn't work -->
          <a href={author.url.toString()} target="_blank">{author.name}</a>{', '}
        {/each}
        {articleOverview.bibliographicData}
      </div>

      <!-- Toggle translation -->
      <Fab on:click={() => toggleTranslation()} mini touch>
        <Icon class="material-icons">translate</Icon>
      </Fab>

    </Content>
  </Card>
</div>

<script lang="ts">
  import Card, {Content} from '@smui/card'
  import { Icon } from '@smui/common'
  import Fab from '@smui/fab'

  import type { ArticleOverview } from './web_dbs/article' 
  import { ARTICLE_OVERVIEW_BODY_LIMIT } from "./web_dbs/constants";
  import translationApiClient from './web_dbs/transtation_api_client';

  export let articleOverview: ArticleOverview

  let toShowFullBody = false
  let translatedArticleOverview: string
  let toShowTranslation = false

  $: showingText = toShowTranslation && translatedArticleOverview ? translatedArticleOverview : articleOverview.body
  $: articleOverviewBody = toShowFullBody 
    ? showingText
    : `${showingText.slice(0, ARTICLE_OVERVIEW_BODY_LIMIT)}...`

  async function toggleTranslation() {
    console.log(toShowTranslation)
    if (toShowTranslation) {
      toShowTranslation = false
      return
    }

    if (!translatedArticleOverview) {
      translatedArticleOverview = await translationApiClient.translate(articleOverview.body)
    }

    toShowTranslation = true
  }
</script>

<style>
  .card-wrapper {
    margin: 1rem 10%;
    min-width: 300px;
    width: 60%;
    max-width: 1000px;
  }

  .readmore-toggle {
    color: #575757;
  }
  .readmore-toggle:hover {
    color: #979797;
    cursor: pointer;
  }
</style>

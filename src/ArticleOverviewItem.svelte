<div class="card-wrapper">
  <Card elevation={4}>
    <Content class="mdc-typography--body2">
      <h2 class="mdc-typography--headline6" style="margin-top: 0; font-size: 1.2rem;">
        <a href={articleOverview.url.toString()}>{articleOverview.title}</a>
      </h2>

      {articleOverviewBody} 
      <span class="readmore-toggle" on:click={() => toShowFullBody = !toShowFullBody}>
        {toShowFullBody ? "  Свернуть" : "  Читать ещё"}
      </span>

      <h3
        class="mdc-typography--subtitle2"
        style="margin-bottom: 0; color: #888; font-size: 1rem;"
      >
        Здесь должны быть авторы
      </h3>

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
    width: 500px;
  }

  .readmore-toggle {
    color: #575757;
  }
  .readmore-toggle:hover {
    color: #979797;
    cursor: pointer;
  }
</style>

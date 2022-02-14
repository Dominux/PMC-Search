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
    </Content>
  </Card>
</div>

<script lang="ts">
  import Card, {Content} from '@smui/card'

  import type { ArticleOverview } from './web_dbs/article' 
  import { ARTICLE_OVERVIEW_BODY_LIMIT } from "./web_dbs/constants";

  export let articleOverview: ArticleOverview

  let toShowFullBody = false

  $: articleOverviewBody = toShowFullBody 
    ? articleOverview.body
    : `${articleOverview.body.slice(0, ARTICLE_OVERVIEW_BODY_LIMIT)}...`
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

<div>
  {#if searchingState === SearchingState.GettingIds}
    <CircularProgress
      style="height: 32px; width: 32px;"
      indeterminate
    />
  {:else if searchingState === SearchingState.GettingAndParsingAndQueryMatchingArticles}
    {originalArticlesAmount}/{reviewArticlesAmount}/{buffer}
    <LinearProgress {progress} buffer={progress}/>
  {/if}
</div>
 
<script lang="ts">
  import CircularProgress from '@smui/circular-progress'
  import LinearProgress from '@smui/linear-progress'

  import SearchingState from './web_dbs/states'

  export let buffer
  export let originalArticlesAmount
  export let reviewArticlesAmount
  export let searchingState

  $: progress = (originalArticlesAmount + reviewArticlesAmount) / buffer
</script>

<div>
  <CircularProgress
    class="my-four-colors"
    style="height: 32px; width: 32px;"
    indeterminate
  />
  {originalArticlesAmount}
  {reviewArticlesAmount}
</div>
 
<script lang="ts">
  import CircularProgress from '@smui/circular-progress';

  export let originalArticlesAmount
  export let reviewArticlesAmount
  export let searchingState
</script>

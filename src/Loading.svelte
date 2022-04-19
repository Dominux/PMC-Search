<script lang="ts">
	import CircularProgress from '@smui/circular-progress'
	import LinearProgress from '@smui/linear-progress'

	import SearchingState from './web_dbs/states'

	export let buffer: number
	export let originalArticlesAmount: number
	export let reviewArticlesAmount: number
	export let searchingState: SearchingState

	$: progress = (originalArticlesAmount + reviewArticlesAmount) / buffer
</script>

<div style="text-align: center; margin: 0 8rem;">
	{#if searchingState === SearchingState.GettingIds}
		<CircularProgress style="height: 50px; width: 50px;" indeterminate />
	{:else if searchingState === SearchingState.Processing}
		Оригинальные: {originalArticlesAmount}&emsp;Обзорные: {reviewArticlesAmount}
		<LinearProgress {progress} buffer={progress} style="text-align: left;" />
	{/if}
</div>

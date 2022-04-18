<script lang="ts">
	import Slider from '@smui/slider'
	import FormField from '@smui/form-field'

	import { MAX_ARTICLES_AMOUNT } from './web_dbs/constants'

	const minPubDateLimit = 1900
	const maxPubDateLimit = new Date().getFullYear()

	export let minPubDate = minPubDateLimit
	export let maxPubDate = maxPubDateLimit
	export let articlesLimit = 100
	export let originalArticlesLimit = 0

	// Auto making original articles limit not bigger than all articles limit
	$: if (originalArticlesLimit > articlesLimit)
		originalArticlesLimit = articlesLimit
</script>

<!-- Publication date -->
<FormField align="end" style="display: flex;">
	<Slider
		style="flex-grow: 1;"
		range
		bind:start={minPubDate}
		bind:end={maxPubDate}
		min={minPubDateLimit}
		max={maxPubDateLimit}
		input$aria-label="Range slider"
	/>
	<span
		slot="label"
		style="padding-right: 12px; width: max-content; display: block;"
	>
		Дата публикации: {minPubDate} - {maxPubDate}
	</span>
</FormField>

<!-- Articles limit -->
<FormField align="end" style="display: flex;">
	<Slider
		style="flex-grow: 1;"
		bind:value={articlesLimit}
		max={MAX_ARTICLES_AMOUNT}
		step={100}
	/>
	<span
		slot="label"
		style="padding-right: 12px; width: max-content; display: block;"
	>
		Максимальное количество статей: {articlesLimit}
	</span>
</FormField>

<!-- Original articles limit -->
<FormField align="end" style="display: flex;">
	<Slider
		style="flex-grow: 1;"
		bind:value={originalArticlesLimit}
		max={articlesLimit}
	/>
	<span
		slot="label"
		style="padding-right: 12px; width: max-content; display: block;"
		title="Отбор статей завершится, если будет набрано заданное число оригинальных статей"
	>
		Максимальное количество оригинальных статей: {originalArticlesLimit}
	</span>
</FormField>

<script lang="ts">
	import Fab from '@smui/fab'
	import { Icon } from '@smui/common'

	import buildDataTable, { DataTableArticle } from './web_dbs/results_to_datatable'

  export let articles

	function exportToDataTable() {
    // Creating datatable itself
    const dataTableArticles = articles.map(a => new DataTableArticle(a.id, a.title, a.keywords))
    const dataTable = buildDataTable(dataTableArticles)

    // Creating file
    const filename = `PMC_SEARCH__${Date.now()}`
    const file = new File([dataTable], `${filename}.csv`, {
      type: 'text/csv',
    })

    // Downloading
    const link = document.createElement('a')
    const url = URL.createObjectURL(file)

    link.href = url
    link.download = file.name
    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }
</script>

<Fab on:click={() => exportToDataTable()} touch>
	<Icon class="material-icons">file_table</Icon>
</Fab>

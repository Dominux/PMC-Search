<main>
  <Paper class="solo-paper" elevation={6}>
    <Autocomplete
      combobox 
      bind:value={query}
      bind:text={query}
    >
      <Textfield class="shaped-outlined" label="Поиск" bind:value={query} variant="outlined">
        <Fab slot="trailingIcon" color="primary" on:click={search}> 
          <Icon class="material-icons">search</Icon>
        </Fab>
      </Textfield>
    </Autocomplete>
  </Paper>
</main>

<script lang="ts">
  import Autocomplete from '@smui-extra/autocomplete'
  import Textfield from '@smui/textfield'
  import Paper from '@smui/paper'
  import { Icon } from '@smui/common'
  import Fab from '@smui/fab'

  import searcher from './web_dbs/searcher'

  let query: string = ''

  async function search() {
    await searcher.search(query)
  }
</script>

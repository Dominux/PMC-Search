<Dialog
  bind:open
  aria-labelledby="large-scroll-title"
  aria-describedby="large-scroll-content"
  surface$style="width: 850px; max-width: calc(100vw - 32px);"
>
  <Title align="center" id="large-scroll-title">История</Title>

  <Content id="large-scroll-content">
    <List>
      {#each historyRecords as record}
        
        <Item>
          <Graphic 
            class="material-icons" 
            on:click={() => removeRecord(record)}
          >
            delete
          </Graphic>
          <Text on:click={() => useRecord(record)}>{record.rawQuery}</Text>
        </Item> 

      {/each}
    </List>
  </Content>
</Dialog>

<!-- TODO: change button to fab with icon -->
<Fab color="primary" on:click={() => open = true}> 
  <Icon class="material-icons">history</Icon>
</Fab>

<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte'

  import Dialog, { Title, Content } from '@smui/dialog'
  import { Icon } from '@smui/common'
  import List, { Item, Text, Graphic } from '@smui/list'
  import Fab from '@smui/fab'

  import history, { HistoryRecord } from './stores/history_store'

  const dispatch = createEventDispatcher()

  let open = false
  let historyRecords = history.get()

  // Auto updating local history
  onMount(() => {
    setInterval(() => historyRecords = history.get(), 5000)
  })

  function removeRecord(record: HistoryRecord) {
    history.removeRecord(record.rawQuery)
    historyRecords = history.get()
  }

  function useRecord(record: HistoryRecord) {
    dispatch('useRecord', record)
    open = false
  }
</script>

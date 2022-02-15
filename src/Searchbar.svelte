<div style="width: 60%;" on:keydown={handleKeyPress}>
  <Textfield 
    class="shaped-outlined" 
    variant="outlined"
    label="Поиск" 
    style="width: 100%;"
    bind:this={textField}
    bind:value={rawQuery} 
    on:focus={() => menu.setOpen(true)}
    on:blur={() => menu.setOpen(false)}
  >
    <Fab slot="trailingIcon" color="primary" on:click={runSearch}> 
      <Icon class="material-icons">search</Icon>
    </Fab>
  </Textfield>

  <!-- Options -->
  <Menu bind:this={menu} style="min-width: 100%; position: relative;">
    <List>
      {#each options as option}
        <Item on:SMUI:action={() => onSelectOption(option)}>
          <Text>{option}</Text>
        </Item>
      {/each}
    </List>
  </Menu>
</div>

<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'

  import Textfield, { TextfieldComponentDev } from '@smui/textfield'
  import { Icon } from '@smui/common'
  import Fab from '@smui/fab'
  import Menu, { MenuComponentDev } from '@smui/menu';
  import List, { Item, Text } from '@smui/list';
  
  import QueryBuilder from './web_dbs/query/query_builder'
  import RuQueryOperator from './web_dbs/query/ru_query_operator'
  import { SEARCHBAR_ONMOUNT_FOCUSING_TIMEOUT } from './web_dbs/constants'
 
  ///////////////////////////////////////////////////////////////////
  //  Variables
  ///////////////////////////////////////////////////////////////////

  const dispatch = createEventDispatcher()

  let menu: MenuComponentDev;
  let textField: TextfieldComponentDev
  let rawQuery = ''
  let options = []

  ///////////////////////////////////////////////////////////////////
  //  Reactive declarations
  ///////////////////////////////////////////////////////////////////

  $: {
    // Checking user raw query while he's typing
    const query = QueryBuilder.parseToTokens(rawQuery)
    const lastWord = query[query.length - 1]

    if (!lastWord || [...Object.values<string>(RuQueryOperator), '['].includes(lastWord)) {
      options = ['[', ']']
    } else {
      options = [...Object.values(RuQueryOperator), '[', ']']
    }
  }

  ///////////////////////////////////////////////////////////////////
  //  Lifecycle hooks
  ///////////////////////////////////////////////////////////////////
  
  onMount(() => {
    // running focusing on search bar
    setTimeout(() => {
      textField.focus()
    }, SEARCHBAR_ONMOUNT_FOCUSING_TIMEOUT)
  })

  ///////////////////////////////////////////////////////////////////
  //  Functions
  ///////////////////////////////////////////////////////////////////

  function handleKeyPress(event: CustomEvent | KeyboardEvent) {
    // Handling keypress
    event = event as KeyboardEvent
    if (event.key === 'Enter') {
      // Unfocusing element
      const target = event.target as HTMLElement 
      target.blur()

      // Running search
      runSearch()
    }
  }

  function onSelectOption(option: string) {
    console.log(option)
    rawQuery = `${rawQuery} ${option} `
    textField.focus()
  }

  function runSearch() {
    dispatch('search', {
      rawQuery: rawQuery
    })
  }
</script>

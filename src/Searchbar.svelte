<div id="searchbar">
  {#key hotLoader}
    <Autocomplete
      combobox 
      options={options}
      style="width: 100%;"
      bind:value={autocompleteValue}
      bind:text={autocompleteValue}
      on:SMUIAutocomplete:selected={onSelectAutocompleteOption}
    >
      <Textfield 
        class="shaped-outlined" 
        variant="outlined"
        label="Поиск" 
        style="width: 100%;"
        bind:this={textField}
        bind:value={rawQuery}
      >
        <Fab slot="trailingIcon" color="primary" on:click={runSearch}> 
          <Icon class="material-icons">search</Icon>
        </Fab>
      </Textfield>
    </Autocomplete>
  {/key}
</div>

<script lang="ts">
  import { createEventDispatcher, onMount, tick } from 'svelte'

  import Textfield, { TextfieldComponentDev } from '@smui/textfield'
  import { Icon } from '@smui/common'
  import Fab from '@smui/fab'
  import Autocomplete from '@smui-extra/autocomplete'
  
  import QueryBuilder from './web_dbs/query/query_builder'
  import RuQueryOperator from './web_dbs/query/ru_query_operator'
  import { SEARCHBAR_ONMOUNT_FOCUSING_TIMEOUT } from './web_dbs/constants'
 
  ///////////////////////////////////////////////////////////////////
  //  Variables
  ///////////////////////////////////////////////////////////////////

  const dispatch = createEventDispatcher()

  let textField: TextfieldComponentDev
  let autocompleteValue = ''
  let rawQuery = ''
  let oldRawQuery = ''
  let options = []
  let oldOptions = []
  let hotLoader = {}

  ///////////////////////////////////////////////////////////////////
  //  Reactive declarations
  ///////////////////////////////////////////////////////////////////

  // Watching raw query changing
  $: if (rawQuery !== oldRawQuery) {
    oldRawQuery = rawQuery

    // Checking user raw query while he's typing
    const query = QueryBuilder.parseToTokens(rawQuery)
    const lastWord = query[query.length - 1]

    if (!lastWord || [...Object.values<string>(RuQueryOperator), '['].includes(lastWord)) {
      options = ['[', ']']
    } else {
      options = [...Object.values(RuQueryOperator), '[', ']']
    }

    // console.log(getCursorPosition())

    // reloading components only when options have changed
    if (JSON.stringify(options) !== JSON.stringify(oldOptions)) {
      console.log(options, oldOptions)
      oldOptions = options
      reloadComponent().then(() => setCursorPosition())
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

  function handleEnter(event: CustomEvent | KeyboardEvent) {
    console.log("lol")
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
  
  function onSelectAutocompleteOption() {
    // Consuming autocomplete value
    rawQuery = `${rawQuery} ${autocompleteValue} `
    autocompleteValue = ''
  }

  function getCursorPosition(): number {
    return textField
      .$$
      .root
      .querySelector("#searchbar")
      .querySelector("input")
      .selectionStart
  } 

  function setCursorPosition() {
    textField
      .$$
      .root
      .querySelector("#searchbar")
      .querySelector("input")
      .setSelectionRange(1, 1)
  } 

  /**
  *  reloading whole component cause Autocomplete component
  *  does not caches options prop
  */
  async function reloadComponent() {
    hotLoader = {}
    await tick()
    textField.focus()
  }

  function runSearch() {
    dispatch('search', {
      rawQuery: rawQuery
    })
  }
</script>

<div id="searchbar">
  {#key hotLoader}
    <Autocomplete
      combobox 
      options={suggestions}
      style="width: 100%;"
      bind:value={autocompleteValue}
      bind:text={autocompleteValue}
      on:SMUIAutocomplete:selected={onSelectSuggestion}
    >
      <Textfield 
        class="shaped-outlined" 
        variant="outlined"
        label="Поиск" 
        style="width: 100%;"
        bind:this={textField}
        bind:value={rawQuery}
        on:keyup={updateCursorPosition}
        on:click={updateCursorPosition}
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
  
  import createSuggestions from './web_dbs/suggestions'
  import { SEARCHBAR_ONMOUNT_FOCUSING_TIMEOUT } from './web_dbs/constants'
 
  ///////////////////////////////////////////////////////////////////
  //  Variables
  ///////////////////////////////////////////////////////////////////

  const dispatch = createEventDispatcher()

  let textField: TextfieldComponentDev
  let autocompleteValue = ''
  let cursorPosition: number
  let rawQuery = ''
  let suggestions = []
  let oldsuggestions = []
  let hotLoader = {}

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

  // TODO: use it
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
  
  function onSelectSuggestion() {
    // Inserting suggestion after cursor position
		const leftPart = rawQuery.substring(0, cursorPosition).trim()
		const rigthPart = rawQuery.substring(cursorPosition).trim()

    rawQuery = `${leftPart} ${autocompleteValue} ${rigthPart}`

    // Putting cursor after suggestion
    setCursorPosition(leftPart.length + 1 + autocompleteValue.length)

    // Consuming autocomplete value
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

  function setCursorPosition(position: number) {
    textField
      .$$
      .root
      .querySelector("#searchbar")
      .querySelector("input")
      .setSelectionRange(position, position)

    updateCursorPosition()
  } 

  function updateCursorPosition() {
    cursorPosition = getCursorPosition()
    onUpdateCursorPosition()
  }

  function onUpdateCursorPosition() {
    suggestions = createSuggestions(rawQuery, cursorPosition)

    // Reloading components only when suggestions have changed
    if (JSON.stringify(suggestions) !== JSON.stringify(oldsuggestions)) {
      oldsuggestions = suggestions
      reloadComponent().then(() => setCursorPosition(cursorPosition))
    }
  }

  /**
  *  reloading whole component cause Autocomplete component caches suggestions prop
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

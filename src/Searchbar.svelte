<div id="searchbar">
  {#key reloader}
    <Autocomplete
      combobox 
      options={suggestions}
      style="width: 89%;"
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
        on:keyup={handleOnKeyUp}
        on:click={updateCursorPosition}
      />
    </Autocomplete>
  {/key}

  <Fab color="primary" on:click={runSearch}> 
    <Icon class="material-icons">search</Icon>
  </Fab>
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
  let autocompleteValue = ''    // value to consume suggestions from SMUI Autocomplete at the right place
  let cursorPosition: number    // value to control where cursor should be and to generate proper suggestions
  let rawQuery = ''
  let suggestions = []
  let oldSuggestions = []
  let reloader = {}             // value to reload components, cause SMUI Autocomplete use options prop as const
  let isAfterSelection = false  // value to use after selection hook (to set cursor at right position)
  let isSearchOnEnterDisabled = false

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

  function handleOnKeyUp(event: CustomEvent | KeyboardEvent) {
    event = event as KeyboardEvent
    
    switch (event.key) {
      case 'Enter':

        if (!isSearchOnEnterDisabled) {
          // Unfocusing element
          textField.blur()

          // Running search
          runSearch()
        }

        isSearchOnEnterDisabled = false
        break
      default:
        updateCursorPosition()
    }
  }
  
  function onSelectSuggestion() {
    // Inserting suggestion after cursor position
		const leftPart = rawQuery.substring(0, cursorPosition).trim()
		const rigthPart = rawQuery.substring(cursorPosition).trim()

    rawQuery = `${leftPart} ${autocompleteValue} ${rigthPart}`

    // Putting cursor after suggestion
    const position = leftPart.length + 1 + autocompleteValue.length
    setCursorPosition(position)
    updateSuggestions()

    // Consuming autocomplete value
    autocompleteValue = ''

    isAfterSelection = true
    
    // Setting this cause we can't set event.stopPropagation() right in SMUI Autocomplete
    isSearchOnEnterDisabled = true
  }

  function updateSuggestions() {
    suggestions = createSuggestions(rawQuery, cursorPosition)

    // Reloading components only when suggestions have changed
    if (JSON.stringify(suggestions) !== JSON.stringify(oldSuggestions)) {
      oldSuggestions = suggestions
      reloadComponent().then(() => {
        textField.focus()
        setCursorPosition(cursorPosition)
      })
    }
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

    cursorPosition = position
  } 

  function updateCursorPosition() {
    if (isAfterSelection) {
      // Suppresing keyup after selection
      setCursorPosition(cursorPosition)
      isAfterSelection = false
      return
    }

    cursorPosition = getCursorPosition()
    updateSuggestions()
  }

  function isUserInMenu(): boolean {
    const lol = document
      .querySelectorAll('.smui-autocomplete__menu > ul > li.mdc-deprecated-list-item--activated')
    console.log(lol)
    return lol.length > 0
  }

  /**
  *  reloading whole component cause Autocomplete component caches suggestions prop
  */
  async function reloadComponent() {
    reloader = {}
    await tick()
  }

  function runSearch() {
    dispatch('search', {
      rawQuery: rawQuery
    })
  }
</script>

<style>
  #searchbar {
    display: flex;
  }
</style>

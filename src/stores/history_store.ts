import type { ID } from '../web_dbs/article'
import { MAX_HISTORY_RECORDS_AMOUNT } from '../web_dbs/constants'

export type HistoryRecord = {
	rawQuery: string
	results: {
		original: Array<ID>
		review: Array<ID>
	}
}

/**
 * Class to work with history
 */
class History {
	private localStorageKey = 'history'

	createRecord(newRecord: HistoryRecord) {
		let history = this.get()

		// Cleaning old history records with the same raw query
		history = history.filter((record) => record.rawQuery !== newRecord.rawQuery)

		// Saving it
		history.push(newRecord)

    // Removing the oldest record if history has achived the limit
    if (history.length === MAX_HISTORY_RECORDS_AMOUNT) {
      history.pop()
    }

		localStorage.setItem(this.localStorageKey, JSON.stringify(history))
	}

	get(): Array<HistoryRecord> {
		const storedHistory = localStorage.getItem(this.localStorageKey) || '[]'
		return JSON.parse(storedHistory)
	}

	removeRecord(rawQuery: string) {
		const history = this.get().filter((record) => record.rawQuery !== rawQuery)
		localStorage.setItem(this.localStorageKey, JSON.stringify(history))
	}
}

const history = new History()
export default history

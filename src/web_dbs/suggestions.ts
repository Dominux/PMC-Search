import RuQueryOperator from './query/ru_query_operator'

export class SuggestionCreater {
	private wordRegex = /[\w\dЁёА-я]/

	create(rawQuery: string, cursorPosition: number): Array<string> {
		// Splitting raw query into two parts, by cursor position
		const leftPart = rawQuery.substring(0, cursorPosition)
		const rigthPart = rawQuery.substring(cursorPosition)

		// Getting previous and next chars
		const previousChar = leftPart.slice(-1) || ''
		const nextChar = rigthPart[0] || ''

		// Checking whether cursor within a word
		if (previousChar.match(this.wordRegex) && nextChar.match(this.wordRegex)) {
			return []
		}

		// Getting words between cursor
		const previousWord = leftPart.trim().split(/\s+/).slice(-1)[0] || ''
		const nextWord = rigthPart.trim().split(/\s+/)[0] || ''

		const operators = Object.values<string>(RuQueryOperator)

		// If query operator is near the cursor
		if (
			operators.includes(previousWord) ||
			operators.includes(nextWord) ||
			nextWord.startsWith(']')
		) {
			return ['[', ']']
		}

		return [...operators, '[', ']']
	}
}

export default function createSuggestions(
	rawQuery: string,
	cursorPosition: number
): Array<string> {
	const creater = new SuggestionCreater()
	return creater.create(rawQuery, cursorPosition)
}

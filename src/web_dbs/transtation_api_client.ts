import apiClient from './api_client'

import translate from '../../libs/google-translate-api'

export class TranslationApiClient {
	textLimit = 5000

	async translate(text: string): Promise<string> {
		text = text.slice(0, this.textLimit)

		const response = await translate(text, {'to': 'ru'}, {}, apiClient)
		return response.text
	}
}

const translationApiClient = new TranslationApiClient()
export default translationApiClient

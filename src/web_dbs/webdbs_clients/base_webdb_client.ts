import { EUTILS_BASEURL } from '../constants'
import apiClient from '../api_client'
import type {ID} from '../article'

interface EsearchResponseJson {
	esearchresult: {
		idlist: Array<string>
	}
}

export default class BaseWebDBClient {
	private baseUrl = EUTILS_BASEURL

	protected db: string
	protected articleBaseUrl: string

	readonly esearch = new URL('esearch.fcgi', this.baseUrl)
	readonly efetch = new URL('efetch.fcgi', this.baseUrl)
	readonly MAX_RETMAX = 100000
	readonly apiClient = apiClient
	readonly articlePart = 'results'

	async getIds(term: string): Promise<Array<ID>> {
		const esearch = new URL(this.esearch)
		esearch.searchParams.append('db', this.db) // setting db to pmc
		esearch.searchParams.append('retmode', 'json') // setting retmode to json
		esearch.searchParams.append('retmax', this.MAX_RETMAX.toString()) // setting retmax to max value
		esearch.searchParams.append('term', term) // setting searching term itself

		const response = await this.apiClient.get(esearch.toString())
		const json: EsearchResponseJson = await response.json()
		return json.esearchresult.idlist
	}
}

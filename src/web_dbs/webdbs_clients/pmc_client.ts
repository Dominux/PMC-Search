import BaseWebDBClient from './base_webdb_client'
import Article from '../article'

export class PMCClient extends BaseWebDBClient {
	protected db = 'pmc'

  public async getArticles(articlesIds: Array<string>): Promise<string> {
		const efetch = new URL(this.efetch)
		efetch.searchParams.append('db', this.db) // setting db to pmc
		efetch.searchParams.append('id', articlesIds.join(',')) // setting articles ids

		const response = await this.apiClient.get(efetch.toString())
		return await response.text()
  }
}

const pmcClient = new PMCClient()
export default pmcClient

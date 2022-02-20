import BaseWebDBClient from './base_webdb_client'

export class PubmedClient extends BaseWebDBClient {
	protected db = 'pubmed'
	protected articleBaseUrl = 'https://pubmed.ncbi.nlm.nih.gov/'

	async getArticleById(id: string): Promise<string> {
		const url = new URL(id, this.articleBaseUrl)
		const response = await this.apiClient.get(url.toString())
		return await response.text()
	}
}

const pubmedClient = new PubmedClient()
export default pubmedClient

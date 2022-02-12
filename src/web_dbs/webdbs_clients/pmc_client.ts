import { PMC_ARTICLE_BASEURL } from '../constants'
import BaseWebDBClient from './base_webdb_client'
import Article, { ID } from '../article'

export class PMCClient extends BaseWebDBClient {
	protected db = 'pmc'
	protected articleBaseUrl = PMC_ARTICLE_BASEURL

	async getArticleById(id: ID): Promise<Article> {
		const url = `${this.articleBaseUrl}${id}`
		const response = await this.apiClient.get(url)
		return new Article(id, await response.text())
	}
}

const pmcClient = new PMCClient()
export default pmcClient

import BaseWebDBClient from './base_webdb_client'

export class PubmedClient extends BaseWebDBClient {
	protected db = 'pubmed'
	protected articleBaseUrl = 'https://pubmed.ncbi.nlm.nih.gov/'
}

const pubmedClient = new PubmedClient()
export default pubmedClient

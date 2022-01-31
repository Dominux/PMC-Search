import BaseWebDBClient from './base_webdb_client'

export class PubmedClient extends BaseWebDBClient {
	protected db = 'pubmed'
}

const pubmedClient = new PubmedClient()
export default pubmedClient

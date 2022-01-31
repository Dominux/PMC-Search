import BaseWebDBClient from './base_webdb_client'

export class PMCClient extends BaseWebDBClient {
	protected db = 'pmc'
}

const pmcClient = new PMCClient()
export default pmcClient

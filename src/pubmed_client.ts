import ApiClient from './api_client'

export default class PubmedClient {
  private baseUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils'
  private esearch = new URL('esearch.fcgi', this.baseUrl)
  private esummary = new URL('esummary.fcgi', this.baseUrl)
  private db = 'pubmed'

  async search(term: string) {
    const esearch = new URL(this.esearch)
    esearch.searchParams.append('db', this.db)
    esearch.searchParams.append('term', term)

    const api_client = new ApiClient(esearch.toString())
    const response = await api_client.get()
  }
}

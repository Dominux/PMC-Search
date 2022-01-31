import apiClient from '../api_client'

interface EsearchResponseJson {
  esearchresult: {
    idlist: Array<string>
  },
}

export default class BaseWebDBClient {
  private baseUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/'
  private esearch = new URL('esearch.fcgi', this.baseUrl)
  private MAX_RETMAX = 100000

  protected db: string
  protected articleBaseUrl: string

  async getIds(term: string): Promise<Array<string>> {
    const esearch = new URL(this.esearch)
    esearch.searchParams.append('db', this.db) // setting db to pmc
    esearch.searchParams.append('retmode', 'json') // setting retmode to json
    esearch.searchParams.append('retmax', this.MAX_RETMAX.toString()) // setting retmax to max value
    esearch.searchParams.append('term', term) // setting searching term itself

    const response = await apiClient.get(esearch.toString())
    const json: EsearchResponseJson = await response.json()
    return json.esearchresult.idlist
  }

  async getArticleById(id: string): Promise<string> {
    const url = new URL(id, this.articleBaseUrl)
    const response = await apiClient.get(url.toString())
    return await response.text()
  }
}

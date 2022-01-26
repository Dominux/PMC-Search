export default class ApiClient {
  private proxyUrl = "https://cors-anywhere.herokuapp.com/"
  baseUrl: URL

	constructor(baseUrl: string) {
    this.baseUrl = new URL(baseUrl, new URL(this.proxyUrl))
	}

	async get(query: string): Promise<Response> {
    const innerUrl = new URL(this.baseUrl)
		return await fetch(innerUrl.toString())
	}
}

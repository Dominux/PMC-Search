/** Abstraction to make requests */ 
export class ApiClient {
	private proxyUrl = 'https://fast-cors.herokuapp.com'
	// private proxyUrl = 'http://localhost:8000'

	async get(url: string): Promise<Response> {
		return await fetch(`${this.proxyUrl}/${url}`)
	}
}

const apiClient = new ApiClient()

export default apiClient

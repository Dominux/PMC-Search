/** Abstraction to make requests */
export class ApiClient {
	private proxyUrl = 'https://fast-cors.herokuapp.com'
	// private proxyUrl = 'http://localhost:8000'

	async get(url: string, headers?: Headers): Promise<Response> {
		return await fetch(`${this.proxyUrl}/${url}`, { headers: headers })
	}

	async post(
		url: string,
		body: object | string,
		headers?: Headers
	): Promise<Response> {
		body = typeof body === 'string' ? body : JSON.stringify(body)
		return await fetch(`${this.proxyUrl}/${url}`, {
			method: 'POST',
			body: body,
			headers: headers,
		})
	}
}

const apiClient = new ApiClient()

export default apiClient

import { Axios, AxiosResponse } from "axios"

export class ApiClient {
  private client: Axios

  constructor(baseUrl: string) {
    this.client = new Axios({baseURL: baseUrl})
  }

  async get(url: string): Promise<AxiosResponse> {
    return await this.client.get(url)
  }
}

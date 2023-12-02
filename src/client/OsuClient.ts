import { AuthDetails } from '@/types';
import axios, { AxiosError } from 'axios';
const baseUrl = 'https://osu.ppy.sh/api/v2';
const authUrl = ' https://osu.ppy.sh/oauth/token';

export default class OsuClient {
  private authToken = '';
  constructor(private readonly authDetails: AuthDetails) {}

  private async getRequest(requestUrl: string): Promise<unknown> {
    try {
      const response = await axios.get(`${baseUrl}/${requestUrl}`, {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      });
      console.log(response.status);
      console.log(response.data);
      return response.data;
    } catch (err: unknown) {
      const error = err as AxiosError;
      console.log(error.response?.status);
      if (error.response?.status === 401) {
        await this.authenticate();
        return await this.getRequest(requestUrl);
      }
    }
    throw new Error('Unexpected error');
  }

  private async authenticate() {
    const data = JSON.stringify({
      client_id: this.authDetails.clientId,
      client_secret: this.authDetails.clientSecret,
      grant_type: 'client_credentials',
      scope: 'public',
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: authUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };
    const response = await axios.request(config);
    this.authToken = response.data.access_token;
  }

  public async getUserById(id: string) {
    return await this.getRequest(`users/${id}`);
  }
}

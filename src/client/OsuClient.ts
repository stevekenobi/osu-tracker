import { createQuery, delay } from '../utils';
import axios from 'axios';
const baseUrl = 'https://osu.ppy.sh/api/v2';
const authUrl = ' https://osu.ppy.sh/oauth/token';

export default class OsuClient {
  private authToken = '';

  constructor(private readonly authDetails) {
  }

  /**
   * @private
   * @param {string} requestUrl
   * @returns {Promise<Object|undefined>}
   */
  async getRequest(requestUrl) {
    try {
      const response = await axios.get(`${baseUrl}/${requestUrl}`, {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        await this.authenticate();
        return await this.getRequest(requestUrl);
      } else if (error.response?.status === 404) {
        return undefined;
      } else if (error.response?.status === 429) {
        console.log(`osu returned a 429 on ${requestUrl}`);
        await delay(60000);
        return await this.getRequest(requestUrl);
      } else if (error.response?.status === 502 || error.response?.status === 504) {
        await delay(1000);
        return await this.getRequest(requestUrl);
      }
      console.log(error);
      throw error;
    }
  }

  async authenticate() {
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

  async getUserById(id) {
    return await this.getRequest(`users/${id}`);
  }

  async getBeatmapsetById(id) {
    return await this.getRequest(`beatmapsets/${id}`);
  }

  async getBeatmapById(id) {
    return await this.getRequest(`beatmaps/${id}`);
  }

  async getBeatmapsetSearch(query) {
    return await this.getRequest(`beatmapsets/search${createQuery(query)}`);
  }

  async getCountryLeaderboard(query) {
    return await this.getRequest(`rankings/osu/performance${createQuery(query)}`);
  }

  async getUserBeamaps(id, type, query) {
    return await this.getRequest(`users/${id}/beatmapsets/${type}${createQuery(query)}`);
  }

  async getUserScoreOnBeatmap(beatmap, user) {
    return await this.getRequest(`beatmaps/${beatmap}/scores/users/${user}`);
  }
}

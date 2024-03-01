import { createQuery, delay } from '../utils';
import type { AxiosError } from 'axios';
import axios from 'axios';
import type { OsuLeaderboardResponse, OsuLeaderboardQuery, OsuBeatmapsetSearchResponse, OsuBeatmap, OsuBeatmapset, OsuUserBeatmap, OsuScore, OsuRecentScore, OsuUser, AuthDetails } from '../types';

const baseUrl = 'https://osu.ppy.sh/api/v2';
const authUrl = ' https://osu.ppy.sh/oauth/token';

export default class OsuClient {
  private authToken = '';

  constructor(private readonly authDetails: AuthDetails) {
  }

  private async getRequest<T>(requestUrl: string): Promise<T | undefined> {
    try {
      const response = await axios.get<T>(`${baseUrl}/${requestUrl}`, {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      });
      return response.data;
    } catch (err: unknown) {
      const error = err as AxiosError;
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

  async authenticate(): Promise<void> {
    const data = JSON.stringify({
      client_id: this.authDetails.client_id,
      client_secret: this.authDetails.client_secret,
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
    const response = await axios.request<{access_token: string}>(config);
    this.authToken = response.data.access_token;
  }

  async getUserById(id: number): Promise<OsuUser | undefined> {
    return await this.getRequest(`users/${id}`);
  }

  async getBeatmapsetById(id: number | string): Promise<OsuBeatmapset | undefined> {
    return await this.getRequest(`beatmapsets/${id}`);
  }

  async getBeatmapById(id: number | string): Promise<OsuBeatmap | undefined> {
    return await this.getRequest(`beatmaps/${id}`);
  }

  async getBeatmapsetSearch(query?: {cursor_string: string}): Promise<OsuBeatmapsetSearchResponse | undefined> {
    return await this.getRequest(`beatmapsets/search${createQuery(query)}`);
  }

  async getCountryLeaderboard(query?: Partial<OsuLeaderboardQuery>): Promise<OsuLeaderboardResponse | undefined> {
    return await this.getRequest<OsuLeaderboardResponse>(`rankings/osu/performance${createQuery(query)}`);
  }

  async getScoreLeaderboard(query?: Partial<OsuLeaderboardQuery>): Promise<OsuLeaderboardResponse | undefined> {
    return await this.getRequest(`rankings/osu/score${createQuery(query)}`);
  }

  async getUserBeatmaps(id: number, type: 'most_played', query?: Partial<{ limit: number, offset: number }>): Promise<OsuUserBeatmap[] | undefined> {
    return await this.getRequest(`users/${id}/beatmapsets/${type}${createQuery(query)}`);
  }

  async getUserRecentScores(id: number): Promise<OsuRecentScore[] | undefined> {
    return await this.getRequest(`users/${id}/scores/recent`);
  }

  async getUserScoreOnBeatmap(beatmapId: number, userId: number): Promise<OsuScore | undefined> {
    return await this.getRequest(`beatmaps/${beatmapId}/scores/users/${userId}`);
  }
}

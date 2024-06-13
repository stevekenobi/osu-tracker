import { createQuery, delay } from '../utils';
import type { AxiosError } from 'axios';
import axios from 'axios';
import type {
  OsuLeaderboardResponse,
  OsuLeaderboardQuery,
  OsuBeatmapsetSearchResponse,
  OsuBeatmap,
  OsuBeatmapset,
  OsuUserBeatmap,
  OsuScore,
  OsuRecentScore,
  OsuUser,
  AuthDetails,
  OsuBeatmapPacksResponse,
} from '../types';

const baseUrl = 'https://osu.ppy.sh/api/v2';
const authUrl = ' https://osu.ppy.sh/oauth/token';

export default class OsuClient {
  private authToken = '';

  constructor(private readonly authDetails: AuthDetails) {}

  private async getRequest<T>(requestUrl: string): Promise<T | null> {
    try {
      const response = await axios.get<T>(`${baseUrl}/${requestUrl}`, {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
          'x-api-version': '20240130',
        },
      });
      return response.data;
    } catch (err: unknown) {
      const error = err as AxiosError;
      if (error.response?.status === 401) {
        await this.authenticate();
        const response = await this.getRequest<T>(requestUrl);
        return response;
      } else if (error.response?.status === 404) {
        return null;
      } else if (error.response?.status === 429) {
        console.log(`osu returned a 429 on ${requestUrl}`);
        await delay(60000);
        const response = await this.getRequest<T>(requestUrl);
        return response;
      } else if (error.response?.status === 502 || error.response?.status === 504) {
        await delay(1000);
        const response = await this.getRequest<T>(requestUrl);
        return response;
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
    const response = await axios.request<{ access_token: string }>(config);
    this.authToken = response.data.access_token;
  }

  async getUserById(id: number): Promise<OsuUser | null> {
    const response = await this.getRequest<OsuUser>(`users/${id}`);
    return response;
  }

  async getBeatmapsetById(id: number | string): Promise<OsuBeatmapset | null> {
    const response = await this.getRequest<OsuBeatmapset>(`beatmapsets/${id}`);
    return response;
  }

  async getBeatmapById(id: number | string): Promise<OsuBeatmap | null> {
    const response = await this.getRequest<OsuBeatmap>(`beatmaps/${id}`);
    return response;
  }

  async getBeatmapsetSearch(query?: { cursor_string: string }): Promise<OsuBeatmapsetSearchResponse | null> {
    const response = await this.getRequest<OsuBeatmapsetSearchResponse>(`beatmapsets/search${createQuery(query)}`);
    return response;
  }

  async getCountryLeaderboard(query?: Partial<OsuLeaderboardQuery>): Promise<OsuLeaderboardResponse | null> {
    const response = await this.getRequest<OsuLeaderboardResponse>(`rankings/osu/performance${createQuery(query)}`);
    return response;
  }

  async getScoreLeaderboard(query?: Partial<OsuLeaderboardQuery>): Promise<OsuLeaderboardResponse | null> {
    const response = await this.getRequest<OsuLeaderboardResponse>(`rankings/osu/score${createQuery(query)}`);
    return response;
  }

  async getUserBeatmaps(id: number, type: 'most_played', query?: Partial<{ limit: number; offset: number }>): Promise<OsuUserBeatmap[] | null> {
    const response = await this.getRequest<OsuUserBeatmap[]>(`users/${id}/beatmapsets/${type}${createQuery(query)}`);
    return response;
  }

  async getUserRecentScores(id: number): Promise<OsuRecentScore[] | null> {
    const response = await this.getRequest<OsuRecentScore[]>(`users/${id}/scores/recent`);
    return response;
  }

  async getUserScoreOnBeatmap(beatmapId: number, userId: number): Promise<OsuScore | null> {
    const response = await this.getRequest<OsuScore>(`beatmaps/${beatmapId}/scores/users/${userId}`);
    return response;
  }

  async getOsuBeatmapPacks(query?: { cursor_string: string }): Promise<OsuBeatmapPacksResponse | null> {
    const response = await this.getRequest<OsuBeatmapPacksResponse>(`beatmaps/packs${createQuery(query)}`);
    return response;
  }
}

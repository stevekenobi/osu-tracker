import { AuthDetails, Beatmapset, BeatmapsetSearch, LeaderboardSearch, RequestQuery, User, UserPlayedBeatmaps, UserScore } from '@/types';
import { createQuery, delay } from '../utils';
import axios, { AxiosError } from 'axios';
const baseUrl = 'https://osu.ppy.sh/api/v2';
const authUrl = ' https://osu.ppy.sh/oauth/token';

export class OsuClient {
  private authToken = '';
  constructor(private readonly authDetails: AuthDetails) {}

  private async getRequest<T>(requestUrl: string): Promise<T | null> {
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
        return await this.getRequest<T>(requestUrl);
      } else if (error.response?.status === 404) {
        return null;
      } else if (error.response?.status === 429) {
        await delay(60000);
        return await this.getRequest<T>(requestUrl);
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

  public async getUserById(id: number): Promise<User | null> {
    return await this.getRequest(`users/${id}`);
  }

  public async getBeatmapsetById(id: number): Promise<Beatmapset | null> {
    return await this.getRequest<Beatmapset>(`beatmapsets/${id}`);
  }

  public async getBeatmapsetSearch(query: Partial<RequestQuery>): Promise<BeatmapsetSearch | null> {
    return await this.getRequest<BeatmapsetSearch>(`beatmapsets/search${createQuery(query)}`);
  }

  public async getCountryLeaderboard(query: Partial<RequestQuery>): Promise<LeaderboardSearch | null> {
    return await this.getRequest<LeaderboardSearch>(`rankings/osu/performance${createQuery(query)}`);
  }

  public async getUserBeamaps(id: number, type: string, query: Partial<RequestQuery>): Promise<UserPlayedBeatmaps[] | null> {
    return await this.getRequest<UserPlayedBeatmaps[]>(`users/${id}/beatmapsets/${type}${createQuery(query)}`);
  }

  public async getUserScoreOnBeatmap(beatmap: number, user: number): Promise<UserScore | null> {
    return await this.getRequest<UserScore>(`beatmaps/${beatmap}/scores/users/${user}`);
  }
}

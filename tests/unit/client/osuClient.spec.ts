import axios from 'axios';
import OsuClient from '../../../src/client/OsuClient';
import type { Mock } from 'vitest';
import * as exported from '../../../src/utils';

const client = new OsuClient({
  client_id: '12375044',
  client_secret: 'some secret',
});

vi.mock('axios');
const axiosRequestMock = axios.request as Mock;
const axiosGetMock = axios.get as Mock;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getRequest = vi.spyOn(OsuClient.prototype as any, 'getRequest');
getRequest.mockImplementation(() => {});

describe('osu client', () => {
  describe('authenticate', () => {
    test('calls getRequest with correct url', async () => {
      axiosRequestMock.mockResolvedValue({
        data: { access_token: 'Angular Developer' },
      });
      await client.authenticate();
      expect(axios.request).toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    test('calls getRequest with correct url', async () => {
      await client.getUserById(123);
      expect(getRequest).toHaveBeenCalledWith('users/123');
    });
  });

  describe('getBeatmapsetById', () => {
    test('calls getRequest with correct url', async () => {
      await client.getBeatmapsetById(123);
      expect(getRequest).toHaveBeenCalledWith('beatmapsets/123');
    });
  });

  describe('getBeatmapById', () => {
    test('calls getRequest with correct url', async () => {
      await client.getBeatmapById(123);
      expect(getRequest).toHaveBeenCalledWith('beatmaps/123');
    });
  });

  describe('getBeatmapsetSearch', () => {
    test('calls getRequest with correct url', async () => {
      await client.getBeatmapsetSearch();
      expect(getRequest).toHaveBeenCalledWith('beatmapsets/search');
    });
  });

  describe('getCountryLeaderboard', () => {
    test('calls getRequest with correct url', async () => {
      await client.getCountryLeaderboard();
      expect(getRequest).toHaveBeenCalledWith('rankings/osu/performance');
    });
  });

  describe('getScoreLeaderboard', () => {
    test('calls getRequest with correct url', async () => {
      await client.getScoreLeaderboard();
      expect(getRequest).toHaveBeenCalledWith('rankings/osu/score');
    });
  });

  describe('getUserBeatmaps', () => {
    test('calls getRequest with correct url', async () => {
      await client.getUserBeatmaps(123, 'most_played');
      expect(getRequest).toHaveBeenCalledWith('users/123/beatmapsets/most_played');
    });
  });

  describe('getUserRecentScores', () => {
    test('returns Null user', async () => {
      await client.getUserRecentScores(4171323);
      expect(getRequest).toHaveBeenCalledWith('users/4171323/scores/recent');
    });
  });

  describe('getUserScoreOnBeatmap', () => {
    test('calls getRequest with correct url', async () => {
      await client.getUserScoreOnBeatmap(123, 456);
      expect(getRequest).toHaveBeenCalledWith('beatmaps/123/scores/users/456');
    });
  });

  describe('getOsuBeatmapPacks', () => {
    test('calls getRequest with correct url', async () => {
      await client.getOsuBeatmapPacks();
      expect(getRequest).toHaveBeenCalledWith('beatmaps/packs');
    });

    test('calls getRequest with correct query', async () => {
      await client.getOsuBeatmapPacks({ cursor_string: 'some_string' });
      expect(getRequest).toHaveBeenCalledWith('beatmaps/packs?cursor_string=some_string');
    });
  });

  describe('getRequest', () => {
    const getClient = new OsuClient({
      client_id: '12375044',
      client_secret: 'some secret',
    });
    const authRequest = vi.spyOn(OsuClient.prototype, 'authenticate');
    vi.spyOn(exported, 'delay').mockImplementation(async () => Promise.resolve());

    beforeAll(async () => {
      getRequest.mockRestore();
      axiosGetMock.mockResolvedValue({ data: { access_token: 'token' } });
      await getClient.authenticate();
    });

    test('returns correct data', async () => {
      axiosGetMock.mockResolvedValue({ data: { ranking: [] } });
      const result = await getClient.getCountryLeaderboard();
      expect(authRequest).toHaveBeenCalled();
      expect(result).toStrictEqual({ ranking: [] });
    });

    test('returns 401', async () => {
      axiosGetMock.mockRejectedValueOnce({ response: { status: 401 } }).mockResolvedValueOnce({ data: { ranking: [] } });
      const result = await getClient.getCountryLeaderboard();
      expect(result).toStrictEqual({ ranking: [] });
    });

    test('returns 404', async () => {
      axiosGetMock.mockRejectedValue({ response: { status: 404 } });
      const result = await getClient.getCountryLeaderboard();
      expect(result).toBeNull();
    });

    test('returns 429', async () => {
      axiosGetMock.mockRejectedValueOnce({ response: { status: 429 } }).mockResolvedValueOnce({ data: { ranking: [] } });
      const result = await getClient.getCountryLeaderboard();
      expect(result).toStrictEqual({ ranking: [] });
    });

    test('returns 502', async () => {
      axiosGetMock.mockRejectedValueOnce({ response: { status: 502 } }).mockResolvedValueOnce({ data: { ranking: [] } });
      const result = await getClient.getCountryLeaderboard();
      expect(result).toStrictEqual({ ranking: [] });
    });
    test('returns 504', async () => {
      axiosGetMock.mockRejectedValueOnce({ response: { status: 504 } }).mockResolvedValueOnce({ data: { ranking: [] } });
      const result = await getClient.getCountryLeaderboard();
      expect(result).toStrictEqual({ ranking: [] });
    });

    test('throws error', async () => {
      axiosGetMock.mockRejectedValue({ response: { status: 500 } });
      expect(async () => await getClient.getCountryLeaderboard()).rejects.toThrow();
    });
  });
});

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
getRequest.mockImplementation(() => { });

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

  describe('getUserBeatmaps', () => {
    test('calls getRequest with correct url', async () => {
      await client.getUserBeatmaps(123, 'most_played');
      expect(getRequest).toHaveBeenCalledWith('users/123/beatmapsets/most_played');
    });
  });

  describe('getUserScoreOnBeatmap', () => {
    test('calls getRequest with correct url', async () => {
      await client.getUserScoreOnBeatmap(123, 456);
      expect(getRequest).toHaveBeenCalledWith('beatmaps/123/scores/users/456');
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
      expect(result).toBeUndefined();
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

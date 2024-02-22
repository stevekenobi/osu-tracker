import OsuClient from '../../src/client/OsuClient';

const client = new OsuClient({
  client_id: process.env['CLIENT_ID'] ?? '',
  client_secret: process.env['CLIENT_SECRET'] ?? '',
});

describe('osu client', () => {
  describe('getBeatmapsetById', () => {
    test('returns correct beatmapset', async () => {
      const response = await client.getBeatmapsetById(89810);
      expect(response?.artist).toBe('Masayoshi Minoshima');
      expect(response?.creator).toBe('Shinxyn');
      expect(response?.id).toBe(89810);
      expect(response?.status).toBe('ranked');
      expect(response?.title).toBe('Necro Fantasia');
      expect(response?.bpm).toBe(175);
      expect(response?.ranked_date).toBe('2013-05-13T06:05:03Z');

      expect(response?.beatmaps.length).toBe(3);
    });

    test('returns undefined beatmapset', async () => {
      const response = await client.getBeatmapsetById(212357);
      expect(response);
    });
  });

  describe('getBeatmapById', () => {
    test('returns correct beatmap', async () => {
      const response = await client.getBeatmapById(1158162);
      expect (response?.beatmapset_id).toBe(546794);
      expect (response?.difficulty_rating).toBe(4.87);
      expect (response?.id).toBe(1158162);
      expect (response?.mode).toBe('osu');
      expect (response?.status).toBe('ranked');
      expect (response?.total_length).toBe(228);
      expect (response?.user_id).toBe(270377);
      expect (response?.version).toBe('Countless');
      expect (response?.accuracy).toBe(8);
      expect (response?.ar).toBe(9);
      expect (response?.bpm).toBe(82);
      expect (response?.cs).toBe(4);
      expect (response?.drain).toBe(6.7);
    });

    test('returns undefined beatmap', async () => {
      const response = await client.getBeatmapById(1158662);
      expect(response);
    });
  });

  describe('getBeatmapsetSearch', () => {
    test('returns recent array', async () => {
      const response = await client.getBeatmapsetSearch();
      expect(response?.beatmapsets.length).toBe(50);
    });
  });

  describe('getCountryLeaderboard', () => {
    test('returns the first 50 users of a country', async () => {
      const response = await client.getCountryLeaderboard({ country: 'GR' });
      expect(response?.ranking.length).toBe(50);
    });

    test('returns users of the same country', async () => {
      const response = await client.getCountryLeaderboard({ country: 'GR' });
      expect(response?.ranking.every((u) => u.user.country.code === 'GR'));
    });
  });

  describe('getUserBeatmaps', () => {
    test('returns undefined user', async () => {
      const response = await client.getUserBeatmaps(4171323, 'most_played');
      expect(response).toBe(undefined);
    });

    test('returns most_played beatmaps', async () => {
      const response = await client.getUserBeatmaps(12375044, 'most_played');
      expect(response?.length).toBe(5);
    });

    test('returns most_played beatmaps with correct length', async () => {
      const response = await client.getUserBeatmaps(12375044, 'most_played', {limit: 100});
      expect(response?.length).toBe(100);
    });
  });

  describe('getUserScoreOnBeatmap', () => {
    test('returns correct score', async () => {
      const response = await client.getUserScoreOnBeatmap(243983, 12375044);
      expect(response?.score.accuracy).toBe(0.9948119325551232);
      expect(response?.score.created_at).toBe('2024-02-10T08:29:05Z');
      expect(response?.score.id).toBe(4582637925);
      expect(response?.score.max_combo).toBe(657);
      expect(response?.score.mode).toBe('osu');
      expect(response?.score.mods).toEqual(['HD', 'SD']);
      expect(response?.score.perfect).toBe(true);
      expect(response?.score.pp).toBe(202.276);
      expect(response?.score.rank).toBe('SH');
      expect(response?.score.score).toBe(11150569);
      expect(response?.score.user_id).toBe(12375044);
    });
  });
});

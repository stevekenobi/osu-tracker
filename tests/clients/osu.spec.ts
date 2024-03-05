import OsuClient from '../../src/client/OsuClient';

const client = new OsuClient({
  client_id: process.env['CLIENT_ID'] ?? '',
  client_secret: process.env['CLIENT_SECRET'] ?? '',
});

describe('osu client', () => {
  describe('getUserById', () => {
    test('returns correct user', async () => {
      const response = await client.getUserById(12375044);
      expect(response?.country_code).toBe('GR');
      expect(response?.id).toBe(12375044);
      expect(response?.username).toBe('Steve Kenobi');
      expect(response?.country.code).toBe('GR');
      expect(response?.country.name).toBe('Greece');
    });

    test('returns Null user', async () => {
      const response = await client.getUserById(4171323);
      expect(response).toBeNull();
    });
  });

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

    test('returns Null beatmapset', async () => {
      const response = await client.getBeatmapsetById(212357);
      expect(response).toBeNull();
    });
  });

  describe('getBeatmapById', () => {
    test('returns correct beatmap', async () => {
      const response = await client.getBeatmapById(1158162);
      expect(response?.beatmapset_id).toBe(546794);
      expect(response?.difficulty_rating).toBe(4.87);
      expect(response?.id).toBe(1158162);
      expect(response?.mode).toBe('osu');
      expect(response?.status).toBe('ranked');
      expect(response?.total_length).toBe(228);
      expect(response?.user_id).toBe(270377);
      expect(response?.version).toBe('Countless');
      expect(response?.accuracy).toBe(8);
      expect(response?.ar).toBe(9);
      expect(response?.bpm).toBe(82);
      expect(response?.cs).toBe(4);
      expect(response?.drain).toBe(6.7);
    });

    test('returns Null beatmap', async () => {
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

  describe('getScoreLeaderboard', () => {
    test('returns the first 50 users', async () => {
      const response = await client.getScoreLeaderboard();
      expect(response?.ranking.length).toBe(50);
    });
  });

  describe('getUserBeatmaps', () => {
    test('returns Null user', async () => {
      const response = await client.getUserBeatmaps(4171323, 'most_played');
      expect(response).toBeNull();
    });

    test('returns most_played beatmaps', async () => {
      const response = await client.getUserBeatmaps(12375044, 'most_played');
      expect(response?.length).toBe(5);
    });

    test('returns most_played beatmaps with correct length', async () => {
      const response = await client.getUserBeatmaps(12375044, 'most_played', { limit: 100 });
      expect(response?.length).toBe(100);
    });
  });

  describe('getUserRecentScores', () => {
    test('returns Null user', async () => {
      const response = await client.getUserRecentScores(4171323);
      expect(response).toBeNull();
    });

    test('return correct response', async () => {
      const response = await client.getUserRecentScores(12375044);
      expect(response?.length).greaterThanOrEqual(0);
    });
  });

  describe('getUserScoreOnBeatmap', () => {
    test('returns Null user', async () => {
      const response = await client.getUserScoreOnBeatmap(243983, 4171323);
      expect(response).toBeNull();
    });

    test('returns correct legacy score', async () => {
      const response = await client.getUserScoreOnBeatmap(243983, 12375044);
      expect(response?.score.accuracy).toBe(0.994812);
      expect(response?.score.ended_at).toBe('2024-02-10T08:29:05Z');
      expect(response?.score.id).toBe(2320392923);
      expect(response?.score.max_combo).toBe(657);
      expect(response?.score.ruleset_id).toBe(0);
      expect(response?.score.mods).toEqual([
        { acronym: 'SD' },
        { acronym: 'HD' },
        { acronym: 'CL' },
      ]);
      expect(response?.score.is_perfect_combo).toBe(true);
      expect(response?.score.pp).toBe(202.276);
      expect(response?.score.rank).toBe('SH');
      expect(response?.score.total_score).toBe(1003528);
      expect(response?.score.user_id).toBe(12375044);
    });

    test('returns correct lazer score', async () => {
      const response = await client.getUserScoreOnBeatmap(3704686, 12375044);
      expect(response?.score.accuracy).toBe(0.981059);
      expect(response?.score.ended_at).toBe('2024-01-30T18:28:05Z');
      expect(response?.score.id).toBe(2262693566);
      expect(response?.score.max_combo).toBe(1262);
      expect(response?.score.ruleset_id).toBe(0);
      expect(response?.score.mods).toEqual([
        { acronym: 'SD' },
        {
          acronym: 'NC',
          settings: {
            speed_change: 1.33,
          },
        },
        { acronym: 'HD' },
      ]);
      expect(response?.score.is_perfect_combo).toBe(false);
      expect(response?.score.pp).toBe(null);
      expect(response?.score.rank).toBe('SH');
      expect(response?.score.total_score).toBe(1061280);
      expect(response?.score.user_id).toBe(12375044);
    });
  });
});

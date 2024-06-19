import OsuClient from '../../src/client/OsuClient';

const client = new OsuClient({
  client_id: process.env['CLIENT_ID'] ?? '',
  client_secret: process.env['CLIENT_SECRET'] ?? '',
});

describe('osu client', () => {
  describe('getBeatmapById', () => {
    test('returns correct beatmap', async () => {
      const beatmap = await client.getBeatmapById(4183347);

      expect(beatmap?.beatmapset_id).toBe(2010488);
      expect(beatmap?.difficulty_rating).toBe(5.22);
      expect(beatmap?.id).toBe(4183347);
      expect(beatmap?.mode).toBe('osu');
      expect(beatmap?.status).toBe('graveyard');
      expect(beatmap?.total_length).toBe(263);
      expect(beatmap?.user_id).toBe(12375044);
      expect(beatmap?.version).toBe('Larry');
      expect(beatmap?.accuracy).toBe(8);
      expect(beatmap?.ar).toBe(9);
      expect(beatmap?.bpm).toBe(168);
      expect(beatmap?.cs).toBe(4);
      expect(beatmap?.drain).toBe(7);
      expect(beatmap?.checksum).toBe('1ca66af58609586c9aee9bab4323bc15');
      expect(beatmap?.beatmapset.artist).toBe('frederic');
      expect(beatmap?.beatmapset.creator).toBe('Steve Kenobi');
      expect(beatmap?.beatmapset.id).toBe(2010488);
      expect(beatmap?.beatmapset.title).toBe('ONLYWONDER');
      expect(beatmap?.beatmapset.bpm).toBe(168);
    });

    test('returns not found', async () => {
      const beatmap = await client.getBeatmapById(12375044);
      expect(beatmap).toBeNull();
    });
  });

  describe('getBeatmapsetById', () => {
    test('returns beatmapset', async () => {
      const beatmapset = await client.getBeatmapsetById(147177);
      expect(beatmapset?.id).toBe(147177);
      expect(beatmapset?.artist).toBe('Himeringo');
      expect(beatmapset?.title).toBe('Idola no Circus');
      expect(beatmapset?.creator).toBe('HelloSCV');
      expect(beatmapset?.ranked_date).toBe('2015-01-21T14:21:11Z');
      expect(beatmapset?.submitted_date).toBe('2014-02-02T06:45:44Z');
      expect(beatmapset?.bpm).toBe(181);
      expect(beatmapset?.status).toBe('ranked');

      expect(beatmapset?.beatmaps.length).toBe(5);

      expect(beatmapset?.beatmaps[0]?.beatmapset_id).toBe(147177);
      expect(beatmapset?.beatmaps[0]?.difficulty_rating).toBe(5.24);
      expect(beatmapset?.beatmaps[0]?.id).toBe(364473);
      expect(beatmapset?.beatmaps[0]?.mode).toBe('osu');
      expect(beatmapset?.beatmaps[0]?.status).toBe('ranked');
      expect(beatmapset?.beatmaps[0]?.total_length).toBe(209);
      expect(beatmapset?.beatmaps[0]?.user_id).toBe(798743);
      expect(beatmapset?.beatmaps[0]?.version).toBe('Expert');
      expect(beatmapset?.beatmaps[0]?.accuracy).toBe(8);
      expect(beatmapset?.beatmaps[0]?.ar).toBe(9);
      expect(beatmapset?.beatmaps[0]?.bpm).toBe(181);
      expect(beatmapset?.beatmaps[0]?.cs).toBe(4);
      expect(beatmapset?.beatmaps[0]?.drain).toBe(7);
      expect(beatmapset?.beatmaps[0]?.checksum).toBe('f3d2e0cdc10e59c09a0474f64b691c9c');

      expect(beatmapset?.beatmaps[1]?.beatmapset_id).toBe(147177);
      expect(beatmapset?.beatmaps[1]?.difficulty_rating).toBe(3.6);
      expect(beatmapset?.beatmaps[1]?.id).toBe(365060);
      expect(beatmapset?.beatmaps[1]?.mode).toBe('osu');
      expect(beatmapset?.beatmaps[1]?.status).toBe('ranked');
      expect(beatmapset?.beatmaps[1]?.total_length).toBe(209);
      expect(beatmapset?.beatmaps[1]?.user_id).toBe(685229);
      expect(beatmapset?.beatmaps[1]?.version).toBe('W h i t e\'s Hard');
      expect(beatmapset?.beatmaps[1]?.accuracy).toBe(6);
      expect(beatmapset?.beatmaps[1]?.ar).toBe(8);
      expect(beatmapset?.beatmaps[1]?.bpm).toBe(181);
      expect(beatmapset?.beatmaps[1]?.cs).toBe(4);
      expect(beatmapset?.beatmaps[1]?.drain).toBe(6);
      expect(beatmapset?.beatmaps[1]?.checksum).toBe('0d4590ec4c5829ba5de3100341777579');

      expect(beatmapset?.beatmaps[2]?.beatmapset_id).toBe(147177);
      expect(beatmapset?.beatmaps[2]?.difficulty_rating).toBe(4.57);
      expect(beatmapset?.beatmaps[2]?.id).toBe(366241);
      expect(beatmapset?.beatmaps[2]?.mode).toBe('osu');
      expect(beatmapset?.beatmaps[2]?.status).toBe('ranked');
      expect(beatmapset?.beatmaps[2]?.total_length).toBe(209);
      expect(beatmapset?.beatmaps[2]?.user_id).toBe(1683740);
      expect(beatmapset?.beatmaps[2]?.version).toBe('Gurvy\'s Insane');
      expect(beatmapset?.beatmaps[2]?.accuracy).toBe(7);
      expect(beatmapset?.beatmaps[2]?.ar).toBe(8.5);
      expect(beatmapset?.beatmaps[2]?.bpm).toBe(181);
      expect(beatmapset?.beatmaps[2]?.cs).toBe(4);
      expect(beatmapset?.beatmaps[2]?.drain).toBe(7);
      expect(beatmapset?.beatmaps[2]?.checksum).toBe('de8e252f51f8edf5c41484b2f12bf77c');

      expect(beatmapset?.beatmaps[3]?.beatmapset_id).toBe(147177);
      expect(beatmapset?.beatmaps[3]?.difficulty_rating).toBe(2.45);
      expect(beatmapset?.beatmaps[3]?.id).toBe(376612);
      expect(beatmapset?.beatmaps[3]?.mode).toBe('osu');
      expect(beatmapset?.beatmaps[3]?.status).toBe('ranked');
      expect(beatmapset?.beatmaps[3]?.total_length).toBe(208);
      expect(beatmapset?.beatmaps[3]?.user_id).toBe(87546);
      expect(beatmapset?.beatmaps[3]?.version).toBe('0920\'s Normal');
      expect(beatmapset?.beatmaps[3]?.accuracy).toBe(4);
      expect(beatmapset?.beatmaps[3]?.ar).toBe(5.3);
      expect(beatmapset?.beatmaps[3]?.bpm).toBe(181);
      expect(beatmapset?.beatmaps[3]?.cs).toBe(3.3);
      expect(beatmapset?.beatmaps[3]?.drain).toBe(4);
      expect(beatmapset?.beatmaps[3]?.checksum).toBe('8c6a528e6bf0866f64053e9274094f0a');

      expect(beatmapset?.beatmaps[4]?.beatmapset_id).toBe(147177);
      expect(beatmapset?.beatmaps[4]?.difficulty_rating).toBe(1.68);
      expect(beatmapset?.beatmaps[4]?.id).toBe(376716);
      expect(beatmapset?.beatmaps[4]?.mode).toBe('osu');
      expect(beatmapset?.beatmaps[4]?.status).toBe('ranked');
      expect(beatmapset?.beatmaps[4]?.total_length).toBe(209);
      expect(beatmapset?.beatmaps[4]?.user_id).toBe(798743);
      expect(beatmapset?.beatmaps[4]?.version).toBe('Easy');
      expect(beatmapset?.beatmaps[4]?.accuracy).toBe(2);
      expect(beatmapset?.beatmaps[4]?.ar).toBe(3);
      expect(beatmapset?.beatmaps[4]?.bpm).toBe(181);
      expect(beatmapset?.beatmaps[4]?.cs).toBe(3);
      expect(beatmapset?.beatmaps[4]?.drain).toBe(2);
      expect(beatmapset?.beatmaps[4]?.checksum).toBe('f55ad9b48fd1a53eccbde112e43090b2');
    });

    test('returns not found', async () => {
      const beatmapset = await client.getBeatmapsetById(12375044);
      expect(beatmapset).toBeNull();
    });
  });

  describe('getBeatmapsetSearch', () => {
    test('returns result', async () => {
      const search = await client.getBeatmapsetSearch();
      expect(search?.beatmapsets.length).toBe(50);
      expect(search?.cursor_string).not.toBeNull();
      expect(search?.beatmapsets.find(b => b.status === 'qualified' || b.status === 'wip' || b.status === 'graveyard' || b.status === 'pending')).toBeUndefined();
    });
  });

  describe('getCountryLeaderboard', () => {
    test('returns result', async () => {
      const search = await client.getCountryLeaderboard({ country: 'GR' });
      expect(search?.cursor).not.toBeNull();
      expect(search?.ranking.length).toBe(50);
      expect(search?.ranking.find(user => user.user.country.code !== 'GR')).toBeUndefined();
    });
  });

  describe('getScoreLeaderboard', () => {
    test('returns leaderboard', async () => {
      const leaderboard = await client.getScoreLeaderboard();
      expect(leaderboard?.ranking.length).toBe(50);
      expect(leaderboard?.ranking.find(user => user.ranked_score < 100000000000)).toBeUndefined();
    });
  });

  describe('getUserById', () => {
    test('returns correct user', async () => {
      const user = await client.getUserById(12375044);
      expect(user?.country_code).toBe('GR');
      expect(user?.id).toBe(12375044);
      expect(user?.username).toBe('Steve Kenobi');
      expect(user?.country).toStrictEqual({
        code: 'GR',
        name: 'Greece',
      });

      expect(user?.statistics.count_100).toBeGreaterThan(0);
      expect(user?.statistics.count_300).toBeGreaterThan(0);
      expect(user?.statistics.count_50).toBeGreaterThan(0);
      expect(user?.statistics.count_miss).toBeGreaterThan(0);
      expect(user?.statistics.level.current).toBeGreaterThan(0);
      expect(user?.statistics.level.progress).toBeGreaterThan(0);

      expect(user?.statistics.global_rank).toBeGreaterThan(1);
      expect(user?.statistics.pp).toBeGreaterThan(5000);
      expect(user?.statistics.ranked_score).toBeGreaterThan(100000000000);
      expect(user?.statistics.hit_accuracy).toBeGreaterThan(90);
      expect(user?.statistics.play_count).toBeGreaterThan(10000);
      expect(user?.statistics.play_time).toBeGreaterThan(3000000);
      expect(user?.statistics.total_score).toBeGreaterThan(150000000000);
      expect(user?.statistics.total_hits).toBeGreaterThan(10000000);
      expect(user?.statistics.maximum_combo).toBeGreaterThan(5900);
      expect(user?.statistics.grade_counts.ss).toBeGreaterThan(10);
      expect(user?.statistics.grade_counts.ssh).toBeGreaterThan(5000);
      expect(user?.statistics.grade_counts.s).toBeGreaterThan(100);
      expect(user?.statistics.grade_counts.sh).toBeGreaterThan(10000);
      expect(user?.statistics.grade_counts.a).toBeGreaterThan(-30);
      expect(user?.statistics.country_rank).toBeGreaterThan(1);
    });

    test('returns not found', async () => {
      const user = await client.getUserById(4171323);
      expect(user).toBeNull();
    });
  });

  describe('getUserBeatmaps', () => {
    test('returns correct result', async () => {
      const beatmaps = await client.getUserBeatmaps(12375044, 'most_played');
      expect(beatmaps?.length).toBe(5);
    });   
    
    test('returns correct result size', async () => {
      const beatmaps = await client.getUserBeatmaps(12375044, 'most_played', {limit: 100});
      expect(beatmaps?.length).toBe(100);
    });

    test('returns null result', async () => {
      const result = await client.getUserBeatmaps(4171323, 'most_played');
      expect(result).toBeNull();
    });
  });
});

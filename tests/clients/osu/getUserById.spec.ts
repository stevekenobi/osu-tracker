import OsuClient from '../../../src/client/OsuClient';

const client = new OsuClient({
  client_id: process.env['CLIENT_ID'] ?? '',
  client_secret: process.env['CLIENT_SECRET'] ?? '',
});

describe('osu client test', () => {
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
});

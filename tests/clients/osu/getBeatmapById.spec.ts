import OsuClient from '../../../src/client/OsuClient';

const client = new OsuClient({
  client_id: process.env['CLIENT_ID'] ?? '',
  client_secret: process.env['CLIENT_SECRET'] ?? '',
});

describe('osu client test', () => {
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
});

import OsuClient from '../../../src/client/OsuClient';

const client = new OsuClient({
  client_id: process.env['CLIENT_ID'] ?? '',
  client_secret: process.env['CLIENT_SECRET'] ?? '',
});

describe('osu client test', () => {
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
});

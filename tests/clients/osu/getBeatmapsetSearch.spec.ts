import OsuClient from '../../../src/client/OsuClient';

const client = new OsuClient({
  client_id: process.env['CLIENT_ID'] ?? '',
  client_secret: process.env['CLIENT_SECRET'] ?? '',
});

describe('getBeatmapById', () => {
  describe('getBeatmapsetSearch', () => {
    test('returns result', async () => {
      const search = await client.getBeatmapsetSearch();
      expect(search?.beatmapsets.length).toBe(50);
      expect(search?.cursor_string).not.toBeNull();
      expect(search?.beatmapsets.find(b => b.status === 'qualified' || b.status === 'wip' || b.status === 'graveyard' || b.status === 'pending')).toBeUndefined();
    });
  });
});

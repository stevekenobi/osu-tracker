import { OsuCollection } from '../../../src/client/OsuCollection';
import fs from 'fs/promises';
import { collection } from '../../data/collection';
import path from 'path';

describe('osuCollection', () => {
  describe('read', () => {
    test('returns correct object', async () => {
      const osuCollection = new OsuCollection();
      await osuCollection.read(await fs.readFile(path.join(__dirname, '../../data/collection.db')));

      expect(osuCollection.version).toBe(collection.version);
      expect(osuCollection.collectionCount).toBe(collection.collectionCount);
      expect(osuCollection.collections).toStrictEqual(collection.collections);
    });
  });
});

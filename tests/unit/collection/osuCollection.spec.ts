import { OsuCollectionFile } from '../../../src/client/OsuCollection';
import fs from 'fs/promises';
import { collection } from '../../data/collection';
import path from 'path';

describe('osuCollection', () => {
  describe('read', () => {
    test('returns correct object', async () => {
      const osuCollection = new OsuCollectionFile();
      await osuCollection.read(await fs.readFile(path.join(__dirname, '../../data/collection.db')));

      expect(osuCollection.version).toBe(collection.version);
      expect(osuCollection.collectionCount).toBe(collection.collectionCount);
      expect(osuCollection.collections).toStrictEqual(collection.collections);
    });
  });

  describe('write', () => {
    test('produces correct file', async () => {
      const osuCollection = new OsuCollectionFile(20240123);
      collection.collections.forEach((c) => osuCollection.addCollection(c));
      const result = await osuCollection.write();

      const buffer = await fs.readFile(path.join(__dirname, '../../data/collection.db'));

      expect(result).toStrictEqual(buffer);
      expect(result.length).toBe(buffer.length);
    });
  });
});

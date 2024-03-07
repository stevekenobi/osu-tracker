import type DatabaseClient from '../../client/DatabaseClient';
import type { OsuCollection } from '../../client/OsuCollection';

export async function getCollections(databaseClient: DatabaseClient): Promise<OsuCollection[]> {
  const collections: OsuCollection[] = [];

  collections.push(await getCollection(databaseClient, 'a-ranks'));
  collections.push(await getCollection(databaseClient, 'no-score'));
  collections.push(await getCollection(databaseClient, 'problematic'));
  collections.push(await getCollection(databaseClient, 'non-sd'));
  collections.push(await getCollection(databaseClient, 'dt'));
  collections.push(await getCollection(databaseClient, 'sub-optimal'));

  return collections;
}

export async function getCollection(databaseClient: DatabaseClient, option: 'no-score' | 'a-ranks' | 'problematic' | 'non-sd' | 'dt' | 'sub-optimal'): Promise<OsuCollection> {
  const beatmaps = await databaseClient.getUnfinishedBeatmaps(option);
  return {
    name: option,
    beatmapCount: beatmaps.length,
    beatmaps: beatmaps.map(b => b.checksum),
  };
}

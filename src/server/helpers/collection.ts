import type { OsuCollection } from '../../client/OsuCollection';
import TrackerServer from '../server';

export async function getCollections(): Promise<OsuCollection[]> {
  const collections: OsuCollection[] = [];

  collections.push(await getCollection('a-ranks'));
  collections.push(await getCollection('no-score'));
  collections.push(await getCollection('problematic'));
  collections.push(await getCollection('non-sd'));
  collections.push(await getCollection('dt'));
  collections.push(await getCollection('sub-optimal'));

  return collections;
}

export async function getCollection(option: 'no-score' | 'a-ranks' | 'problematic' | 'non-sd' | 'dt' | 'sub-optimal'): Promise<OsuCollection> {
  const beatmaps = await TrackerServer.getDatabaseClient().getUnfinishedBeatmaps(option);
  return {
    name: option,
    beatmapCount: beatmaps.length,
    beatmaps: beatmaps.map((b) => b.checksum),
  };
}

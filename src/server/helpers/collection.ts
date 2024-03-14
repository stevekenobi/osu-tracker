import type { OsuCollection } from '../../client/OsuCollection';
import { getYearsUntilToday } from '../../utils';
import TrackerServer from '../server';

export async function getCollections(): Promise<OsuCollection[]> {
  const collections: OsuCollection[] = [];

  collections.push(await getUnfinishedCollection('a-ranks'));
  collections.push(await getUnfinishedCollection('no-score'));
  collections.push(await getUnfinishedCollection('problematic'));
  collections.push(await getUnfinishedCollection('non-sd'));
  collections.push(await getUnfinishedCollection('dt'));
  collections.push(await getUnfinishedCollection('sub-optimal'));

  for (const year of getYearsUntilToday()) {
    collections.push(await getYearlyCollection(year));
  }

  return collections;
}

export async function getUnfinishedCollection(option: 'no-score' | 'a-ranks' | 'problematic' | 'non-sd' | 'dt' | 'sub-optimal'): Promise<OsuCollection> {
  const beatmaps = await TrackerServer.getDatabaseClient().getUnfinishedBeatmaps(option);
  return {
    name: option,
    beatmapCount: beatmaps.length,
    beatmaps: beatmaps.map((b) => b.checksum),
  };
}

export async function getYearlyCollection(year: string): Promise<OsuCollection> {
  const beatmaps = (await TrackerServer.getDatabaseClient().getBeatmapsOfYear(year)).filter(b => !b.score);
  return {
    name: year,
    beatmapCount: beatmaps.length,
    beatmaps: beatmaps.map((b) => b.checksum),
  };
}

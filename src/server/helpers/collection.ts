import type DatabaseClient from '../../client/DatabaseClient';
import type { OsuCollection } from '../../client/OsuCollection';

export async function getCollections(databaseClient: DatabaseClient): Promise<OsuCollection[]> {
  const collections: OsuCollection[] = [];

  const dtBeatmaps = await databaseClient.getUnfinishedBeatmaps('dt');
  collections.push({
    name: 'DT',
    beatmapCount: dtBeatmaps.length,
    beatmaps: dtBeatmaps.map(b => b.checksum),
  });

  const nonSdBeatmaps = await databaseClient.getUnfinishedBeatmaps('non-sd');
  collections.push({
    name: 'Non SD',
    beatmapCount: nonSdBeatmaps.length,
    beatmaps: nonSdBeatmaps.map(b => b.checksum),
  });

  const nonFcBeatmaps = await databaseClient.getUnfinishedBeatmaps('problematic');
  collections.push({
    name: 'Non FC',
    beatmapCount: nonFcBeatmaps.length,
    beatmaps: nonFcBeatmaps.map(b => b.checksum),
  });

  const aRankBeatmaps = await databaseClient.getUnfinishedBeatmaps('a-ranks');
  collections.push({
    name: 'A ranks',
    beatmapCount: aRankBeatmaps.length,
    beatmaps: aRankBeatmaps.map(b => b.checksum),
  });

  const suboptimalBeatmaps = await databaseClient.getUnfinishedBeatmaps('sub-optimal');
  collections.push({
    name: 'Sub-Optimal',
    beatmapCount: suboptimalBeatmaps.length,
    beatmaps: suboptimalBeatmaps.map(b => b.checksum),
  });

  const unfinishedBeatmaps = await databaseClient.getUnfinishedBeatmaps('no-score');
  collections.push({
    name: 'Unfinished',
    beatmapCount: unfinishedBeatmaps.length,
    beatmaps: unfinishedBeatmaps.map(b => b.checksum),
  });

  return collections;
}

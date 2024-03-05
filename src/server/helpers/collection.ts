import type DatabaseClient from '../../client/DatabaseClient';
import type SheetClient from '../../client/SheetClient';
import type { OsuCollection } from '../../client/OsuCollection';
import { extractIdFromLink } from '../../utils';
import { Op } from 'sequelize';

export async function getCollections(databaseClient: DatabaseClient, sheetClient: SheetClient): Promise<OsuCollection[]> {
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

  const unfinishedBeatmaps = await sheetClient.getNoScoreBeatmaps();
  const beatmaps = await databaseClient.getBeatmaps({where: {id: {[Op.in]: unfinishedBeatmaps.map(u => extractIdFromLink(u.Link))}}});
  collections.push({
    name: 'Unfinished',
    beatmapCount: beatmaps.length,
    beatmaps: beatmaps.map(b => b.checksum),
  });

  return collections;
}

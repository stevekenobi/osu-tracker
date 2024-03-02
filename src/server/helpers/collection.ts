import type DatabaseClient from '../../client/DatabaseClient';
import type SheetClient from '../../client/SheetClient';
import type { OsuCollectionBeatmap } from '../../client/OsuCollection';
import { extractIdFromLink } from '../../utils';
import { Op } from 'sequelize';

export async function getCollections(databaseClient: DatabaseClient, sheetClient: SheetClient): Promise<OsuCollectionBeatmap[]> {
  const collections: OsuCollectionBeatmap[] = [];

  const dtBeatmaps = await databaseClient.getDTBeatmaps();
  collections.push({
    name: 'DT',
    beatmapCount: dtBeatmaps.length,
    beatmaps: dtBeatmaps.map(b => b.checksum),
  });

  const nonSdBeatmaps = await databaseClient.getNonSDBeatmaps();
  collections.push({
    name: 'Non SD',
    beatmapCount: nonSdBeatmaps.length,
    beatmaps: nonSdBeatmaps.map(b => b.checksum),
  });

  const nonFcBeatmaps = await databaseClient.getProblematicBeatmaps();
  collections.push({
    name: 'Non FC',
    beatmapCount: nonFcBeatmaps.length,
    beatmaps: nonFcBeatmaps.map(b => b.checksum),
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

import type DatabaseClient from '../../client/DatabaseClient';
import type OsuClient from '../../client/OsuClient';
import type SheetClient from '../../client/SheetClient';
import { importLatestBeatmaps, syncBeatmapsSheet } from './beatmaps';
import { updateRecentScores } from './scores';

export async function importNewScoresJob(osuClient: OsuClient, databaseClient: DatabaseClient, sheetClient: SheetClient): Promise<void> {
  await importLatestBeatmaps(osuClient, databaseClient);
  await updateRecentScores(osuClient, databaseClient);
  await syncBeatmapsSheet(databaseClient, sheetClient);
}

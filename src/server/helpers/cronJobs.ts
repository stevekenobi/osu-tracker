import { syncAgesSheet } from './ages';
import { importLatestBeatmaps, syncBeatmapsSheet } from './beatmaps';
import { updateRecentScores } from './scores';

export async function importNewScoresJob(): Promise<void> {
  await importLatestBeatmaps();
  await updateRecentScores();
  await syncBeatmapsSheet();
  await syncAgesSheet();
}

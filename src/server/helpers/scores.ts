import { OsuClient, SheetClient } from '../../client';

export async function updateAllUserScores(osuClient: OsuClient, sheetClient: SheetClient, year: string) {
  const beatmaps = await sheetClient.readBeatmaps(year);

  for (const b of beatmaps) {
    const score = await osuClient.getUserScoreOnBeatmap(Number.parseInt(b.Link?.split('/').at(-1) ?? ''), 12375044);

    if (!score) continue;

    await sheetClient.updateScoreOnBeatmap(year, b.Link ?? '', score);
  }
}

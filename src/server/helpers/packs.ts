import numeral from 'numeral';
import type { OsuBeatmapPack } from '../../types';
import type { SheetBeatmapPack } from '../../types/sheets/packs';
import TrackerServer from '../server';

export async function getOsuBeatmapPacks(): Promise<OsuBeatmapPack[] | undefined> {
  let response = await TrackerServer.getOsuClient().getOsuBeatmapPacks();

  if (!response) {
    return [];
  }
  const result = response.beatmap_packs;

  do {
    response = await TrackerServer.getOsuClient().getOsuBeatmapPacks({ cursor_string: response.cursor_string });
    if (!response) {
      break;
    }
    result.push(...response.beatmap_packs);
  } while (response.cursor_string);

  // 'osu! B' for osu!
  // 'Loved Beatmap Pack (osu!)' for loved
  // 'Approved' for approved

  return result.filter((p) => p.name.startsWith('osu! B') || p.name.startsWith('Loved Beatmap Pack (osu!)') || p.name.startsWith('Approved'));
}

export async function updateBeatmapPacks(): Promise<void> {
  console.log('starting finding packs');
  const beatmapPacks = await getOsuBeatmapPacks();
  if (!beatmapPacks) {
    console.log('Failed to find beatmap packs');
    return;
  }

  const stats: SheetBeatmapPack[] = [];

  for (const pack of beatmapPacks) {
    const packFound = await TrackerServer.getOsuClient().getOsuBeatmapPackById(pack.tag);
    if (!packFound) {
      console.log(`Did not find ${pack.name}`);
      continue;
    }
    const beatmaps = await TrackerServer.getDatabaseClient().getBeatmapsOfBeatmapsets(packFound.beatmapsets.map((s) => s.id));
    console.log(`${packFound.tag}: ${beatmaps.length}`);

    const beatmapPercentage = (beatmaps.filter((b) => b.score).length / beatmaps.length) * 100;

    stats.push({
      Name: packFound.name,
      'Download Link': packFound.url,
      'Beatmap Completion': `${beatmaps.filter((b) => b.score).length}/${beatmaps.length}`,
      'Completion (%)': numeral(beatmapPercentage).format('0.00'),
    });
  }

  stats.reverse();

  await TrackerServer.getSheetClient().updateBeatmapPackStats(stats);

  console.log('finished updating packs');
}

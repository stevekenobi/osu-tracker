import type { OsuBeatmapPack } from '../../types';
import TrackerServer from '../server';

export async function getOsuBeatmapPacks(): Promise<OsuBeatmapPack[] | undefined> {
  let response = await TrackerServer.getOsuClient().getOsuBeatmapPacks();

  if (!response) return [];
  const result = response.beatmap_packs;

  do {
    console.log(response?.cursor_string);
    response = await TrackerServer.getOsuClient().getOsuBeatmapPacks({ cursor_string: response.cursor_string });
    if (!response) break;
    result.push(...response.beatmap_packs);
  } while (response.cursor_string);

  // 'osu! B' for osu!
  // 'Loved Beatmap Pack (osu!)' for loved
  // 'Approved' for approved

  return result.filter(p =>
    p.name.startsWith('osu! B') ||
    p.name.startsWith('Loved Beatmap Pack (osu!)') ||
    p.name.startsWith('Approved')
  );
}

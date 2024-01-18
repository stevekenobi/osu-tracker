import { Beatmaps, DatabaseClient, OsuClient } from '../../client';
import { AppBeatmap, AppBeatmapset, Beatmapset } from '@/types';
import { getSequelizeSingleton } from '../../client/models/initialize';

export async function importLatestBeatmaps(databaseClient: DatabaseClient, osuClient: OsuClient) {
  const beatmapsetResult = await osuClient.getBeatmapsetSearch({});

  if (!beatmapsetResult)
    return {
      success: false,
      message: 'No recent beatmaps found',
    };

  const beatmapsets = beatmapsetResult.beatmapsets.filter((beatmapset) => beatmapset.status === 'ranked' || beatmapset.status === 'approved' || beatmapset.status === 'loved');

  const beatmaps = beatmapsets.flatMap((b) => createAppBeatmapsFromBeatmapset(b));

  await databaseClient.updateBeatmaps(beatmaps);

  return {
    success: true,
    message: 'Recent beatmaps added successfully',
  };
}

export async function updateBeatmaps(databaseClient: DatabaseClient, osuClient: OsuClient) {
  const transaction = await getSequelizeSingleton().transaction();
  let cursor_string = '';
  try {
    do {
      const beatmapsetResult = await osuClient.getBeatmapsetSearch(cursor_string === '' ? {} : { cursor_string });

      if (!beatmapsetResult) break;

      const beatmapsets = beatmapsetResult.beatmapsets.filter((beatmapset) => beatmapset.status === 'ranked' || beatmapset.status === 'approved' || beatmapset.status === 'loved');
      cursor_string = beatmapsetResult.cursor_string;

      for (const b of beatmapsets) {
        const beatmaps = createAppBeatmapsFromBeatmapset(b);

        await databaseClient.updateBeatmaps(beatmaps, { transaction });
      }
    } while (cursor_string);
    await transaction.commit();

    console.log('Background work finished');
  } catch {
    await transaction.rollback();
  }
}

function createAppBeatmapsFromBeatmapset(beatmapset: Beatmapset): AppBeatmap[] {
  return beatmapset.beatmaps
    .filter((b) => b.mode === 'osu')
    .map((b) => ({
      artist: beatmapset.artist,
      title: beatmapset.title,
      creator: beatmapset.creator,
      beatmapset_id: beatmapset.id,
      ar: b.ar,
      bpm: b.bpm,
      cs: b.cs,
      hp: b.drain,
      length: b.hit_length,
      difficulty_rating: b.difficulty_rating,
      link: `https://osu.ppy.sh/b/${b.id}`,
      od: b.accuracy,
      ranked_date: new Date(beatmapset.ranked_date),
      status: b.status,
      version: b.version,
    }));
}

export function createAppBeatmapsetFromAppBeatmaps(beatmaps: Beatmaps[]): AppBeatmapset[] {
  const result: AppBeatmapset[] = [];
  const ids = new Set(beatmaps.flatMap((b) => b.beatmapset_id));
  ids.forEach((id) => {
    const maps = beatmaps.filter((m) => m.beatmapset_id === id);

    result.push({
      id,
      link: `https://osu.ppy.sh/beatmapsets/${id}`,
      artist: maps[0].artist,
      title: maps[0].title,
      creator: maps[0].creator,
      status: maps[0].status,
      beatmaps: maps
        .sort((a, b) => (a.difficulty_rating > b.difficulty_rating ? 1 : -1))
        .map((m) => ({
          link: `https://osu.ppy.sh/beatmapsets/${m.id}`,
          ...m,
        })),
      date: new Date(maps[0].ranked_date),
    });
  });
  return result.sort((a, b) => (a.date < b.date ? 1 : -1));
}

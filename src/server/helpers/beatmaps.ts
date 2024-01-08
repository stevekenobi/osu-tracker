import { OsuClient, SheetClient } from '@/client';
import { AppBeatmap, Beatmapset } from '@/types';
import { delay } from '../../utils';
import { AxiosError } from 'axios';

export async function importLatestBeatmaps(osuClient: OsuClient, sheetClient: SheetClient) {
  const beatmapsetResult = await osuClient.getBeatmapsetSearch({});
  const years: {
    [key: string]: AppBeatmap[];
  } = {};

  if (!beatmapsetResult)
    return {
      success: false,
      message: 'No recent beatmaps found',
    };

  const beatmapsets = beatmapsetResult.beatmapsets.filter((beatmapset) => beatmapset.status === 'ranked' || beatmapset.status === 'approved' || beatmapset.status === 'loved');

  beatmapsets.forEach((b) => {
    const beatmaps = createAppBeatmapsFromBeatmapset(b);
    if (years[b.ranked_date.substring(0, 4)]) {
      years[b.ranked_date.substring(0, 4)].push(...beatmaps);
    } else {
      years[b.ranked_date.substring(0, 4)] = beatmaps;
    }
  });

  for (const year of Object.keys(years)) {
    if (years[year].length === 0) continue;

    await addRowsToSheet(sheetClient, years, year);
  }

  return {
    success: true,
    message: 'Recent beatmaps added successfully',
  };
}

export async function updateBeatmaps(osuClient: OsuClient, sheetClient: SheetClient) {
  let years: {
    [key: string]: AppBeatmap[];
  } = {};
  let cursor_string = '';
  do {
    const beatmapsetResult = await osuClient.getBeatmapsetSearch(cursor_string === '' ? {} : { cursor_string });

    if (!beatmapsetResult) break;

    const beatmapsets = beatmapsetResult.beatmapsets.filter((beatmapset) => beatmapset.status === 'ranked' || beatmapset.status === 'approved' || beatmapset.status === 'loved');
    cursor_string = beatmapsetResult.cursor_string;

    beatmapsets.forEach((b) => {
      const beatmaps = createAppBeatmapsFromBeatmapset(b);
      if (years[b.ranked_date.substring(0, 4)]) {
        years[b.ranked_date.substring(0, 4)].push(...beatmaps);
      } else {
        years[b.ranked_date.substring(0, 4)] = beatmaps;
      }
    });

    for (const year of Object.keys(years)) {
      if (years[year].length === 0) continue;

      await addRowsToSheet(sheetClient, years, year);
    }

    years = {};
  } while (cursor_string);

  console.log('Background work finished');
}

async function addRowsToSheet(
  sheetClient: SheetClient,
  years: {
    [key: string]: AppBeatmap[];
  },
  year: string,
) {
  try {
    const beatmapsFromSheet = await sheetClient.getRows<AppBeatmap>('19yENPaqMxN41X7bU9QpAylYc3RZfctt9a1oVE6lUqI0', year);
    const beatmapsToAdd = years[year].filter((b) => !beatmapsFromSheet.some((x) => x.Link === b.Link));

    if (beatmapsToAdd.length === 0) return;
    await sheetClient.addRows('19yENPaqMxN41X7bU9QpAylYc3RZfctt9a1oVE6lUqI0', year, beatmapsToAdd);

    console.log(`Added ${beatmapsToAdd.length} new beatmaps in ${year}`);
  } catch (err: unknown) {
    const error = err as AxiosError;
    if (error.response?.status === 429) {
      console.log(error.response.status);
      await delay(10000);

      await addRowsToSheet(sheetClient, years, year);
    }
  }
}

function createAppBeatmapsFromBeatmapset(beatmapset: Beatmapset): AppBeatmap[] {
  return beatmapset.beatmaps
    .filter((b) => b.mode === 'osu')
    .map((b) => ({
      Link: `https://osu.ppy.sh/beatmaps/${b.id}`,
      Artist: beatmapset.artist,
      Title: beatmapset.title,
      Creator: beatmapset.creator,
      Version: b.version,
      Status: b.status,
      Difficulty: b.difficulty_rating,
      BPM: b.bpm,
      AR: b.ar,
      CS: b.cs,
      HP: b.drain,
      OD: b.accuracy,
      Date: beatmapset.ranked_date,
      BeatmapsetId: beatmapset.id.toString(),
    }));
}

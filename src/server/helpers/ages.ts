import numeral from 'numeral';
import type { SheetAgeStats } from '../../types';
import { createBeatmapsetLinkFromId, getDaysFromDate, getYearsUntilToday } from '../../utils';
import TrackerServer from '../server';
import { createBeatmapsetsFromBeatmaps } from './beatmaps';

export async function syncAgesSheet(): Promise<void> {
  const years = getYearsUntilToday();
  const ages: SheetAgeStats[] = [];
  for (const year of years) {
    const beatmaps = await TrackerServer.getDatabaseClient().getBeatmapsOfYear(year);
    const beatmapsets = createBeatmapsetsFromBeatmaps(beatmaps.filter((b) => b.status === 'ranked'));
    const beatmapAges = beatmapsets
      .map((b) => ({
        age: getDaysFromDate(b.submittedDate, b.rankedDate),
        artist: b.beatmaps[0]!.artist,
        title: b.beatmaps[0]!.title,
        creator: b.beatmaps[0]!.creator,
        id: b.id,
      }))
      .sort((a, b) => (a.age > b.age ? 1 : -1));
    const beatmapsOfYoungestAge = beatmapsOfSameAge(beatmapAges, 'youngest');
    const beatmapsOfOldestAge = beatmapsOfSameAge(beatmapAges, 'oldest');
    ages.push({
      Year: year,
      'Average Age': numeral(beatmapAges.reduce((sum, x) => sum + x.age, 0) / beatmapAges.length).format('0,0'),
      'Oldest Age': numeral(beatmapAges.at(-1)!.age).format('0,0'),
      'Youngest Age': numeral(beatmapAges[0]!.age).format('0,0'),
      'Oldest Map': beatmapsOfYoungestAge > 1 ? 'multiple beatmapsets' : createBeatmapsetLinkFromId(beatmapAges.at(-1)!.id),
      'Youngest Map': beatmapsOfOldestAge > 1 ? 'multiple beatmapsets' : createBeatmapsetLinkFromId(beatmapAges[0]!.id),
    });

    await TrackerServer.getSheetClient().updateAges(beatmapAges.map(b => ({
      Link: createBeatmapsetLinkFromId(b.id),
      Artist: b.artist,
      Title: b.title,
      Creator: b.creator,
      Age: numeral(b.age).format('0,0'),
    })), year);
  }
  await TrackerServer.getSheetClient().updateAgeStats(ages);
}

export function beatmapsOfSameAge(beatmaps: { age: number}[], type: 'youngest' | 'oldest'): number {
  return beatmaps.filter(b => b.age === beatmaps.at(type === 'youngest' ? -1 : 0)!.age).length;
}

import numeral from 'numeral';
import type { SheetAges } from '../../types';
import { createBeatmapsetLinkFromId, getDaysFromDate, getYearsUntilToday } from '../../utils';
import TrackerServer from '../server';
import { createBeatmapsetsFromBeatmaps } from './beatmaps';

export async function syncAgesSheet(): Promise<void> {
  const years = getYearsUntilToday();
  const ages: SheetAges[] = [];
  for (const year of years) {
    const beatmaps = await TrackerServer.getDatabaseClient().getBeatmapsOfYear(year);
    const beatmapsets = createBeatmapsetsFromBeatmaps(beatmaps.filter(b => b.status === 'ranked'));
    const beatmapAges = beatmapsets.map(b =>({
      age: getDaysFromDate(b.submittedDate, b.rankedDate),
      id: b.id,
    })).sort((a,b) => a.age > b.age ? 1 : -1);
    ages.push({
      Year: year,
      'Average Age': numeral(beatmapAges.reduce((sum, x) => sum + x.age, 0) / beatmapAges.length).format('0,0'),
      'Oldest Age': numeral(beatmapAges.at(-1)!.age).format('0,0'),
      'Youngest Age': numeral(beatmapAges[0]!.age).format('0,0'),
      'Oldest Map': createBeatmapsetLinkFromId(beatmapAges.at(-1)!.id),
      'Youngest Map': createBeatmapsetLinkFromId(beatmapAges[0]!.id),
    });
  }
  await TrackerServer.getSheetClient().updateAges(ages);
}

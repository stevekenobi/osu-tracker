import moment from 'moment';
import type { AppBeatmap, OsuMod } from '../types';

export function delay(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

export function range(start: number, stop: number, step = 1): number[] {
  return Array<number>(Math.ceil((stop - start + 1) / step))
    .fill(start)
    .map((x, y) => x + y * step);
}

export function createQuery(query?: { [key: string]: string | number }): string {
  if (query) {
    return `?${Object.keys(query)
      .map((x) => `${x}=${query[x]}`)
      .join('&')}`;
  }

  return '';
}

export function getYearsUntilToday(): string[] {
  const endDate = new Date().getFullYear();
  const years = [];

  for (let i = 2007; i <= endDate; i++) {
    years.push(i.toString());
  }
  return years;
}

export function getDaysFromToday(firstDate: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  const secondDate = new Date();

  return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay));
}

export function getDaysFromDate(firstDate: string, secondDate: string): number {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((new Date(firstDate).getTime() - new Date(secondDate).getTime()) / oneDay));
}

export function getDiffDataFromDays(firstDate: string, secondDate: string): string {
  const diff = moment.duration(moment(firstDate).diff(moment(secondDate)));
  const result: string[] = [];
  if (diff.years()) {
    result.push(`${diff.years()} year${diff.years() > 1 ? 's' : ''}`);
  }
  if (diff.months()) {
    result.push(`${diff.months()} month${diff.months() > 1 ? 's' : ''}`);
  }
  if (diff.days()) {
    result.push(`${diff.days()} day${diff.days() > 1 ? 's' : ''}`);
  }

  return result.join(' ');
}

export function isBeatmapRankedApprovedOrLoved(beatmap: { status: string }): boolean {
  return beatmap.status === 'ranked' || beatmap.status === 'approved' || beatmap.status === 'loved';
}

export function getRulesetFromInt(i: number): string {
  return i === 0 ? 'osu' : 'unknown';
}

export function getModsString(mods: OsuMod[]): string {
  if (mods.length === 0) {
    return '';
  }

  const s = mods.map((m) => {
    if (m.settings) {
      return `${m.acronym}(${Object.keys(m.settings).map((x) => m.settings![x])})`;
    } else {
      return m.acronym;
    }
  });

  return s.join(',');
}

export function createBeatmapLinkFromId(id: number): string {
  return `https://osu.ppy.sh/b/${id}`;
}

export function createBeatmapsetLinkFromId(id: number): string {
  return `https://osu.ppy.sh/s/${id}`;
}

export function createUserLinkFromId(id: number): string {
  return `https://osu.ppy.sh/u/${id}`;
}

export function extractIdFromLink(link: string): number {
  const num = link.split('/').at(-1);
  if (!num) {
    return 0;
  }
  return Number.parseInt(num);
}

export function calculateClassicScore(score: { total_score: number; statistics: { great?: number; meh?: number; ok?: number; miss?: number } }): number {
  const classicScore =
    (score.total_score / 1000000) * (100000 + 32.57 * Math.pow((score.statistics.great ?? 0) + (score.statistics.meh ?? 0) + (score.statistics.ok ?? 0) + (score.statistics.miss ?? 0), 2));
  return Math.round(classicScore);
}

export function getNormalRank(rank: string): string {
  if (rank === 'X') {
    return 'SS';
  }
  if (rank === 'XH') {
    return 'SSH';
  }
  return rank;
}

export function calculateAverageAccuracy(scores: AppBeatmap[]): number {
  let totalCount_ok = 0;
  let totalCount_great = 0;
  let totalCount_meh = 0;
  let totalCount_miss = 0;

  for (const score of scores) {
    totalCount_ok += score.count_ok ?? 0;
    totalCount_great += score.count_great ?? 0;
    totalCount_meh += score.count_meh ?? 0;
    totalCount_miss += score.count_miss ?? 0;
  }

  return (300 * totalCount_great + 100 * totalCount_ok + 50 * totalCount_meh) / (300 * (totalCount_great + totalCount_ok + totalCount_meh + totalCount_miss));
}

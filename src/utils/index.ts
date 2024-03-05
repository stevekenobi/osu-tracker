import type { OsuMod } from '../types';

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

  const s = mods.map(m => {
    if (m.settings) {
      return `${m.acronym}(${Object.keys(m.settings).map(x => m.settings![x])})`;
    } else {
      return m.acronym;
    }
  });

  return s.join(',');
}

export function createBeatmapLinkFromId(id: number): string {
  return `https://osu.ppy.sh/b/${id}`;
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

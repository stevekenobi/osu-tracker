export function delay(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

export function range(start: number, stop: number, step = 1): number[] {
  return Array<number>(Math.ceil((stop - start + 1) / step))
    .fill(start)
    .map((x, y) => x + y * step);
}

export function createQuery(query: {[key: string]: string}): string {
  if (query)
    return `?${Object.keys(query)
      .map((x) => `${x}=${query[x]}`)
      .join('&')}`;

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

export function isBeatmapRankedApprovedOrLoved(beatmap: {status: string}): boolean {
  return beatmap.status === 'ranked' || beatmap.status === 'approved' || beatmap.status === 'loved';
}

export function createBeatmapLinkFromId(id: number): string {
  return `https://osu.ppy.sh/b/${id}`;
}

export function createUserLinkFromId(id: number): string {
  return `https://osu.ppy.sh/u/${id}`;
}

export function extractIdFromLink(link: string): number {
  return Number.parseInt(link.split('/').at(-1) ?? '');
}

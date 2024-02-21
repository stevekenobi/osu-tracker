export function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

export function range(start, stop, step = 1) {
  return Array(Math.ceil((stop - start + 1) / step))
    .fill(start)
    .map((x, y) => x + y * step);
}

export function createQuery(query) {
  if (query)
    return `?${Object.keys(query)
      .map((x) => `${x}=${query[x]}`)
      .join('&')}`;

  return '';
}

export function getYearsUntilToday() {
  const endDate = new Date().getFullYear();
  const years = [];

  for (let i = 2007; i <= endDate; i++) {
    years.push(i.toString());
  }
  return years;
}

export function isBeatmapRankedApprovedOrLoved(beatmap) {
  return beatmap.status === 'ranked' || beatmap.status === 'approved' || beatmap.status === 'loved';
}

export function createBeatmapLinkFromId(id) {
  return `https://osu.ppy.sh/b/${id}`;
}

export function createUserLinkFromId(id) {
  return `https://osu.ppy.sh/u/${id}`;
}

export function extractIdFromLink(link) {
  return Number.parseInt(link.split('/').at(-1) ?? '');
}

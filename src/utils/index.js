function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

function range(start, stop, step = 1) {
  return Array(Math.ceil((stop - start) / step))
    .fill(start)
    .map((x, y) => x + y * step);
}

function createQuery(query) {
  if (query)
    return `?${Object.keys(query)
      .map((x) => `${x}=${query[x]}`)
      .join('&')}`;

  return '';
}

function getYearsUntilToday() {
  const endDate = new Date().getFullYear();
  const years = [];

  for (let i = 2007; i <= endDate; i++) {
    years.push(i.toString());
  }
  return years;
}

function isBeatmapRankedApprovedOrLoved(beatmap) {
  return beatmap.status === 'ranked' || beatmap.status === 'approved' || beatmap.status === 'loved';
}

function createBeatmapLinkFromId(id) {
  return `https://osu.ppy.sh/b/${id}`;
}

function createUserLinkFromId(id) {
  return `https://osu.ppy.sh/u/${id}`;
}

function extractIdFromLink(link) {
  return Number.parseInt(link.split('/').at(-1) ?? '');
}

module.exports = { delay, range, createQuery, getYearsUntilToday, isBeatmapRankedApprovedOrLoved, createBeatmapLinkFromId, createUserLinkFromId, extractIdFromLink };

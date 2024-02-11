/**
 * @param {number} ms
 * @returns {Promise}
 */

/* c8 ignore start */
function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}
/* c8 ignore end */

/**
 * @param {number} start
 * @param {number} stop
 * @param {number} step
 * @returns {Array<number>}
 */
function range(start, stop, step = 1) {
  return Array(Math.ceil((stop - start + 1) / step))
    .fill(start)
    .map((x, y) => x + y * step);
}

/**
 * @param {Object} query
 * @returns {string}
 */

function createQuery(query) {
  if (query)
    return `?${Object.keys(query)
      .map((x) => `${x}=${query[x]}`)
      .join('&')}`;

  return '';
}

/**
 * @returns {Array<string>}
 */
function getYearsUntilToday() {
  const endDate = new Date().getFullYear();
  const years = [];

  for (let i = 2007; i <= endDate; i++) {
    years.push(i.toString());
  }
  return years;
}

/**
 * @param {Object} beatmap
 * @returns {boolean}
 */
function isBeatmapRankedApprovedOrLoved(beatmap) {
  return beatmap.status === 'ranked' || beatmap.status === 'approved' || beatmap.status === 'loved';
}

/**
 * @param {number} id
 * @returns {string}
 */
function createBeatmapLinkFromId(id) {
  return `https://osu.ppy.sh/b/${id}`;
}

/**
 * @param {number} id
 * @returns {string}
 */
function createUserLinkFromId(id) {
  return `https://osu.ppy.sh/u/${id}`;
}

/**
 * @param {string} link
 * @returns {number}
 */
function extractIdFromLink(link) {
  return Number.parseInt(link.split('/').at(-1) ?? '');
}

module.exports = { delay, range, createQuery, getYearsUntilToday, isBeatmapRankedApprovedOrLoved, createBeatmapLinkFromId, createUserLinkFromId, extractIdFromLink };

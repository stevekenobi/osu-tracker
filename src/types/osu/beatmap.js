/**
 * @typedef {Object} OsuBeatmapset
 * @property {string} artist
 * @property {string} creator
 * @property {number} id
 * @property {string} status
 * @property {string} title
 * @property {number} bpm
 * @property {string} ranked_date
 * @property {Array<OsuBeatmap>} beatmaps
 */

/**
 * @typedef {Object} OsuBeatmap
 * @property {number} beatmapset_id
 * @property {number} difficulty_rating
 * @property {number} id
 * @property {string} mode
 * @property {string} status
 * @property {number} total_length
 * @property {number} user_id
 * @property {string} version
 * @property {number} accuracy
 * @property {number} ar
 * @property {number} bpm
 * @property {number} cs
 * @property {number} drain
 */

/**
 * @typedef {Object} OsuBeatmapsetSearchResult
 * @property {Array<OsuBeatmapset>} beatmapsets
 */
     
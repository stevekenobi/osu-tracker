/**
 * @typedef {Object} OsuLeaderboardResponse
 * @property {OsuCursor} cursor
 * @property {Array<Ranking>} ranking
 */

/**
 * @typedef {Object} OsuCursor
 * @property {number} page
 */

/**
 * @typedef {Object} OsuRanking
 * @property {number} pp
 * @property {number} ranked_score
 * @property {number} hit_accuracy
 * @property {number} play_count
 * @property {number} total_score
 * @property {GradeCounts} grade_counts
 * @property {OsuUser} user
 */

/**
 * @typedef {Object} OsuUser
 * @property {number} id
 * @property {string} username
 */

/**
 * @typedef {Object} GradeCounts
 * @property {number} ss
 * @property {number} ssh
 * @property {number} s
 * @property {number} sh
 * @property {number} a
 */

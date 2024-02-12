/**
 * @typedef {Object} OsuUser
 * @property {string} country_code
 * @property {number} id
 * @property {string} username
 * @property {number} beatmap_playcounts_count
 * @property {OsuStatistics} statistics
 */

/**
 * @typedef {Object} OsuStatistics
 * @property {number} count_100
 * @property {number} count_300
 * @property {number} count_50
 * @property {number} count_miss
 * @property {OsuLevel} level
 * @property {number} global_rank
 * @property {number} global_rank_exp
 * @property {number} pp
 * @property {number} pp_exp
 * @property {number} ranked_score
 * @property {number} hit_accuracy
 * @property {number} play_count
 * @property {number} play_time
 * @property {number} total_score
 * @property {number} total_hits
 * @property {number} maximum_combo
 * @property {GradeCounts} grade_counts
 * @property {number} country_rank
 */

/**
 * @typedef {Object} OsuLevel
 * @property {number} current
 * @property {number} progress
 */

/**
 * @typedef {Object} GradeCounts
 * @property {number} ss
 * @property {number} ssh
 * @property {number} s
 * @property {number} sh
 * @property {number} a
 */

/**
 * @typedef {Object} OsuUserPlayedBeatmap
 * @property {number} beatmap_id
 * @property {number} count
 * @property {PlayedBeatmap} beatmap
 * @property {PlayedBeatmapset} beatmapset
 */

/**
 * @typedef {Object} PlayedBeatmap
 * @property {number} beatmapset_id
 * @property {number} difficulty_rating
 * @property {number} id
 * @property {string} mode
 * @property {string} status
 * @property {number} total_length
 * @property {number} user_id
 * @property {string} version
 */

/**
 * @typedef {Object} PlayedBeatmapset
 * @property {string} artist
 * @property {string} creator
 * @property {number} id
 * @property {string} status
 * @property {string} title
 * @property {number} user_id
 */

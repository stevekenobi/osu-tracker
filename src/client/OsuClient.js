const { createQuery, delay } = require('../utils');
const axios = require('axios');
const baseUrl = 'https://osu.ppy.sh/api/v2';
const authUrl = ' https://osu.ppy.sh/oauth/token';

class OsuClient {
  /**
   * @constructor
   * @param {AuthDetails} authDetails
   */
  constructor(authDetails) {
    this.authToken = '';
    this.authDetails = authDetails;
  }

  /**
   * @private
   * @param {string} requestUrl
   * @returns {Promise<Object|undefined>}
   */
  /* c8 ignore start */
  async getRequest (requestUrl) {
    try {
      const response = await axios.get(`${baseUrl}/${requestUrl}`, {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        await this.authenticate();
        return await this.getRequest(requestUrl);
      } else if (error.response?.status === 404) {
        return undefined;
      } else if (error.response?.status === 429) {
        console.log(`osu returned a 429 on ${requestUrl}`);
        await delay(60000);
        return await this.getRequest(requestUrl);
      } else if (error.response?.status === 502 || error.response?.status === 504) {
        await delay(1000);
        return await this.getRequest(requestUrl);
      }
      console.log(error);
      throw error;
    }
  }
  /* c8 ignore end */

  /**
   * @private
   * @param {string} requestUrl
   * @returns {Promise}
   */
  async authenticate() {
    const data = JSON.stringify({
      client_id: this.authDetails.clientId,
      client_secret: this.authDetails.clientSecret,
      grant_type: 'client_credentials',
      scope: 'public',
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: authUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };
    const response = await axios.request(config);
    this.authToken = response.data.access_token;
  }

  /**
   * @param {number} id
   * @returns {Promise<OsuUser|undefined>}
   */
  async getUserById(id) {
    return await this.getRequest(`users/${id}`);
  }

  /**
   * @param {number} id
   * @returns {Promise<OsuBeatmapset|undefined>}
   */
  async getBeatmapsetById(id) {
    return await this.getRequest(`beatmapsets/${id}`);
  }

  /**
   * @param {Object} query
   * @returns {Promise<OsuBeatmapsetSearchResult|undefined>}
   */
  async getBeatmapsetSearch(query) {
    return await this.getRequest(`beatmapsets/search${createQuery(query)}`);
  }

  /**
   * @param {Object} query
   * @returns {Promise<OsuLeaderboardResponse>}
   */
  async getCountryLeaderboard(query) {
    return await this.getRequest(`rankings/osu/performance${createQuery(query)}`);
  }

  /**
   * @param {number} id
   * @param {string} type
   * @param {Object} query
   * @returns {Promise<OsuUserPlayedBeatmap[]|undefined>}
   */
  async getUserBeamaps(id, type, query) {
    return await this.getRequest(`users/${id}/beatmapsets/${type}${createQuery(query)}`);
  }

  /**
   * @param {number} beatmap
   * @param {number} user
   * @returns {Promise<OsuUserScoreOnBeatmap|undefined>}
   */
  async getUserScoreOnBeatmap(beatmap, user) {
    return await this.getRequest(`beatmaps/${beatmap}/scores/users/${user}`);
  }
}

module.exports = OsuClient;

import { AppLeaderboardUser } from '@/types';
import { apiRequest } from '../api';
import { defineStore } from 'pinia';

export type UserState = {
  leaderboard: AppLeaderboardUser[];
};

export const userLeaderboardStore = defineStore('leaderboard', {
  state: (): UserState => ({
    leaderboard: [],
  }),
  getters: {
    getLeaderboard: (state) => state.leaderboard,
  },
  actions: {
    async fetchLeaderboard() {
      const beatmaps = await apiRequest<AppLeaderboardUser[]>('get', 'leaderboard');

      this.leaderboard = beatmaps;
    },
  },
});

import { SheetLeaderboardUser } from '@/types';
import { apiRequest } from '../api';
import { defineStore } from 'pinia';

export type UserState = {
  leaderboard: SheetLeaderboardUser[];
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
      const beatmaps = await apiRequest<SheetLeaderboardUser[]>('get', 'leaderboard');

      this.leaderboard = beatmaps;
    },
  },
});
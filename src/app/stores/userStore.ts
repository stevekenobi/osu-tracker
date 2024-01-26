import type { AppBeatmapset, AppUser } from '@/types';
import { defineStore } from 'pinia';
import { apiRequest } from '../api';

export type UserState = {
  user: AppUser | undefined;
  beatmaps: AppBeatmapset[] | undefined;
};

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: undefined,
    beatmaps: undefined,
  }),

  actions: {
    async fetchUser() {
      const user = await apiRequest<AppUser>('get', 'user');
      const beatmaps = await apiRequest<AppBeatmapset[]>('get', 'beatmaps/sets/2018');
      this.user = user;
      this.beatmaps = beatmaps;
    },

    async addSystemUser(id: string) {
      await apiRequest<AppUser>('post', 'user', { id });
    },

    async updateUserScores(id: string) {
      await apiRequest('post', 'scores', { id });
    },
  },
});

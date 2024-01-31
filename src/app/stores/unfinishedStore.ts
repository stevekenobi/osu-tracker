import { AppBeatmap, AppUnfinishedBeatmap } from '@/types';
import { defineStore } from 'pinia';
import { apiRequest } from '../api';

export type UserState = {
  unfinished: AppUnfinishedBeatmap[];
};

export const useUnfinishedStore = defineStore('unfinished', {
  state: (): UserState => ({
    unfinished: [],
  }),
  getters: {
    getUnfinished: (state) => state.unfinished.sort((a, b) => (a.play_count < b.play_count ? 1 : -1)),
  },
  actions: {
    async fetchUnfinishedBeatmaps() {
      const beatmaps = await apiRequest<AppUnfinishedBeatmap[]>('get', 'beatmaps/unfinished');

      this.unfinished = beatmaps;
    },
  },
});

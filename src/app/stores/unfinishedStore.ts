import { AppUnfinishedBeatmap } from '@/types';
import { defineStore } from 'pinia';
import { apiRequest } from '../api';

export type UserState = {
  availableValues: ('playcount' | 'artist' | 'title' | 'creator' | 'difficulty')[];
  selectedSort: 'playcount' | 'artist' | 'title' | 'creator' | 'difficulty';
  unfinished: AppUnfinishedBeatmap[];
};

export const useUnfinishedStore = defineStore('unfinished', {
  state: (): UserState => ({
    availableValues: ['playcount', 'artist', 'title', 'creator', 'difficulty'],
    selectedSort: 'playcount',
    unfinished: [],
  }),
  getters: {
    getUnfinished: (state) =>
      state.unfinished.sort((a, b) => {
        switch (state.selectedSort) {
          case 'artist':
            return a.Beatmap.artist > b.Beatmap.artist ? 1 : -1;
          case 'title':
            return a.Beatmap.title > b.Beatmap.title ? 1 : -1;
          case 'creator':
            return a.Beatmap.creator > b.Beatmap.creator ? 1 : -1;
          case 'playcount':
            return a.play_count > b.play_count ? 1 : -1;
          case 'difficulty':
            return a.Beatmap.difficulty_rating > b.Beatmap.difficulty_rating ? 1 : -1;
        }
      }),
  },
  actions: {
    async fetchUnfinishedBeatmaps() {
      const beatmaps = await apiRequest<AppUnfinishedBeatmap[]>('get', 'beatmaps/unfinished');

      this.unfinished = beatmaps;
    },
  },
});

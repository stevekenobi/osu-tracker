import { SheetUnfinishedBeatmaps } from '@/types';
import { defineStore } from 'pinia';
import { apiRequest } from '../api';

export type UserState = {
  availableValues: ('playcount' | 'artist' | 'title' | 'creator' | 'difficulty')[];
  selectedSort: 'playcount' | 'artist' | 'title' | 'creator' | 'difficulty';
  unfinished: SheetUnfinishedBeatmaps[];
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
            return a.Artist > b.Artist ? 1 : -1;
          case 'title':
            return a.Title > b.Title ? 1 : -1;
          case 'creator':
            return a.Creator > b.Creator ? 1 : -1;
          case 'playcount':
            return a.Playcount > b.Playcount ? 1 : -1;
          case 'difficulty':
            return a.Difficulty > b.Difficulty ? 1 : -1;
        }
      }),
  },
  actions: {
    async fetchUnfinishedBeatmaps() {
      const beatmaps = await apiRequest<SheetUnfinishedBeatmaps[]>('get', 'beatmaps/unfinished');

      this.unfinished = beatmaps;
    },
  },
});

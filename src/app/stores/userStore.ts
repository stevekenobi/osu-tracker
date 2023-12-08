import type { AppUser } from '@/types';
import { defineStore } from 'pinia';
import { apiRequest } from '../api';

export type UserState = {
  user: AppUser | undefined;
};

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: undefined,
  }),

  actions: {
    async fetchUser() {
      const user = await apiRequest<AppUser>('get', 'user');
      this.user = user;
    },

    async addSystemUser(id: string) {
      await apiRequest<AppUser>('post', 'user', { id });
    },
  },
});

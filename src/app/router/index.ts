import { createRouter, createWebHistory } from 'vue-router';

// import UserDetailsView from '@/app/views/UserDetailsView.vue';
import UnfinishedBeatmapsView from '../views/UnfinishedBeatmapsView.vue';
import LeaderboardView from '../views/LeaderboardView.vue';

const routes = [
  {
    path: '/',
    name: 'HomeView',
    component: UnfinishedBeatmapsView,
  },
  {
    path: '/leaderboard',
    name: 'LeaderboardView',
    component: LeaderboardView,
  },
  {
    path: '/unfinished',
    name: 'UnfinishedView',
    component: UnfinishedBeatmapsView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, left: 0, behavior: 'smooth' };
  },
});

export default router;

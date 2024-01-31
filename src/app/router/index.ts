import { createRouter, createWebHistory } from 'vue-router';

// import UserDetailsView from '@/app/views/UserDetailsView.vue';
import UnfinishedBeatmapsView from '../views/UnfinishedBeatmapsView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
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

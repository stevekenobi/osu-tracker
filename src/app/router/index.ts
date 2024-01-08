import { createRouter, createWebHistory } from 'vue-router';

import UserDetailsView from '@/app/views/UserDetailsView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: UserDetailsView,
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

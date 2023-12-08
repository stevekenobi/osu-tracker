import { createApp } from 'vue';
import App from './App.vue';

import { createPinia } from 'pinia';
import router from '@/app/router';

import './main.css';

const pinia = createPinia();

createApp(App).use(pinia).use(router).mount('#app');

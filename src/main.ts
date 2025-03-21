import { createApp } from 'vue';
import './global.scss';
import App from './App.vue';
import { router } from './router';
import { createPinia } from 'pinia';
import VueTippy from 'vue-tippy';
import 'tippy.js/dist/tippy.css';
import draggable from 'vuedraggable';
import { i18n } from './i18n/config';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.use(VueTippy);
app.use(i18n);
app.component('VueDraggable', draggable);
app.mount('#app');

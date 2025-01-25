import { createApp } from 'vue';
// import './global.scss';
import './assets/sass/app.scss';
import App from './App.vue';
import { router } from './router';
import { createPinia } from 'pinia';
import VueTippy from 'vue-tippy';
import 'tippy.js/dist/tippy.css';
import draggable from 'vuedraggable';

const app = createApp(App);
app.use(router);
app.use(createPinia());
app.use(VueTippy);
app.component('VueDraggable', draggable);
app.mount('#app');

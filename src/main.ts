import { createApp } from 'vue';
import './global.scss';
import App from './App.vue';
import { router } from './router';
import { createPinia } from 'pinia';
import VueTippy from 'vue-tippy';
import 'tippy.js/dist/tippy.css';
import draggable from 'vuedraggable';
import { createI18n } from 'vue-i18n';
import { frMessages } from './i18n/fr';

const i18n = createI18n({
    locale: 'fr',
    fallbackLocale: 'fr',
    messages: {
        fr: frMessages,
    },
});

const app = createApp(App);
app.use(router);
app.use(createPinia());
app.use(VueTippy);
app.use(i18n);
app.component('VueDraggable', draggable);
app.mount('#app');

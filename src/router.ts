import { createRouter, createWebHashHistory } from 'vue-router';

export const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            redirect: '/landingpage'
        },
        {
            path:'/landingpage',
            component: () => import('./views/LandingPage.vue')
        },
        {
            path:'/editor',
            component: () => import('./views/EditorPage.vue')
        }
    ]
});
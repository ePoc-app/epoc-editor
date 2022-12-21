import { createRouter, createWebHistory } from 'vue-router';

export const router = createRouter({
    history: createWebHistory(),
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
import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Index.vue') }],
  },
  {
    path: '/register',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Register.vue') }],
  },
   {
    path: '/login',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Login.vue') }],
  },
  {
    path: '/account',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Account.vue') }],
  },
  {
    path: '/descriptions/:coffeShop_id',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/CoffeShopDescription.vue') }],
  },
   {
    path: '/reviews/:coffeShop_id',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Reviews.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;

import { createRouter, createWebHistory } from 'vue-router';

import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import DashboardView from '../views/DashboardView.vue';
import ApplicationsView from '../views/ApplicationsView.vue';
import NotFoundView from '@/views/NotFoundView.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView, meta: { guestOnly: true, title: 'Login' } },
  { path: '/register', component: RegisterView, meta: { guestOnly: true, title: 'Register' } },
  { path: '/dashboard', component: DashboardView, meta: { requiresAuth: true, title: 'Dashboard' } },
  { path: '/applications', component: ApplicationsView, meta: { requiresAuth: true, title: 'My Applications' } },
  { path: '/:pathMatch(.*)*', component: NotFoundView, meta: { title: '404' } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation Guard
router.beforeEach((to, from) => {
  const token = localStorage.getItem('token');

  document.title = `${to.meta.title || 'Job Tracker'} | Job Tracker`;
  if (to.meta.requiresAuth && !token) {
    return '/login';
  } else if (to.meta.guestOnly && token) {
    return '/dashboard';
  }
});

export default router;
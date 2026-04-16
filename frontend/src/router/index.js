import { createRouter, createWebHistory } from 'vue-router';

import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import DashboardView from '../views/DashboardView.vue';
import ApplicationsView from '../views/ApplicationsView.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView, meta: { guestOnly: true } },
  { path: '/register', component: RegisterView, meta: { guestOnly: true } },
  { path: '/dashboard', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/applications', component: ApplicationsView, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  if (to.meta.requiresAuth && !token) {
    // Trying to access protected page without token → redirect to login
    next('/login');
  } else if (to.meta.guestOnly && token) {
    // Already logged in, trying to access login/register → redirect to dashboard
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
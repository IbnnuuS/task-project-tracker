import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/LoginView.vue')
        },
        {
            path: '/',
            name: 'dashboard',
            component: () => import('@/views/DashboardView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/projects',
            name: 'projects',
            component: () => import('@/views/ProjectsView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/projects/:id',
            name: 'project-detail',
            component: () => import('@/views/ProjectDetailView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/tasks',
            name: 'global-tasks',
            component: () => import('@/views/GlobalTasksView.vue'),
            meta: { requiresAuth: true }
        }
    ]
})

router.beforeEach(async (to, _from, next) => {
    const authStore = useAuthStore()

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next({ name: 'login' })
    } else if (to.name === 'login' && authStore.isAuthenticated) {
        next({ name: 'dashboard' })
    } else {
        next()
    }
})

export default router

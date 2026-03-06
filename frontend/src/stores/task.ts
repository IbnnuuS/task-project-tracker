import { defineStore } from 'pinia';
import api from '@/services/api';
import type { Task, Category } from '@/types';
import { useProjectStore } from './project';

interface TaskState {
    globalTasks: Task[];
    categories: Category[];
    loading: boolean;
    error: any;
}

export const useTaskStore = defineStore('task', {
    state: (): TaskState => ({
        globalTasks: [],
        categories: [],
        loading: false,
        error: null,
    }),
    actions: {
        async fetchCategories() {
            try {
                const response = await api.get('/categories');
                this.categories = response.data;
            } catch (error) {
                console.error('Failed to load categories', error);
            }
        },
        async fetchGlobalTasks(search?: string) {
            this.loading = true;
            try {
                const params = search ? { search } : {};
                const response = await api.get('/tasks', { params });
                this.globalTasks = response.data;
            } catch (error) {
                this.error = error;
            } finally {
                this.loading = false;
            }
        },
        async createTask(projectId: number, taskData: Partial<Task>) {
            try {
                const response = await api.post(`/projects/${projectId}/tasks`, taskData);
                const projectStore = useProjectStore();
                // If we are looking at this project's detail, push to its task list
                if (projectStore.currentProject && projectStore.currentProject.id === projectId) {
                    if (!projectStore.currentProject.tasks) {
                        projectStore.currentProject.tasks = [];
                    }
                    projectStore.currentProject.tasks.push(response.data);
                }
                return response.data;
            } catch (error) {
                throw error;
            }
        },
        async updateTask(taskId: number, taskData: Partial<Task>) {
            try {
                const response = await api.put(`/tasks/${taskId}`, taskData);
                const projectStore = useProjectStore();

                // Update in project detail view
                if (projectStore.currentProject && projectStore.currentProject.tasks) {
                    const index = projectStore.currentProject.tasks.findIndex(t => t.id === taskId);
                    if (index !== -1) {
                        projectStore.currentProject.tasks[index] = { ...projectStore.currentProject.tasks[index], ...response.data };
                    }
                }

                // Update in global view
                const globalIndex = this.globalTasks.findIndex(t => t.id === taskId);
                if (globalIndex !== -1) {
                    this.globalTasks[globalIndex] = { ...this.globalTasks[globalIndex], ...response.data };
                }

                return response.data;
            } catch (error) {
                throw error;
            }
        },
        async softDeleteTask(taskId: number) {
            try {
                await api.delete(`/tasks/${taskId}`);
                const projectStore = useProjectStore();

                // Remove from project detail view
                if (projectStore.currentProject && projectStore.currentProject.tasks) {
                    projectStore.currentProject.tasks = projectStore.currentProject.tasks.filter(t => t.id !== taskId);
                }

                // Remove from global view
                this.globalTasks = this.globalTasks.filter(t => t.id !== taskId);
            } catch (error) {
                throw error;
            }
        }
    }
});

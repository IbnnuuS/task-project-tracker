import { defineStore } from 'pinia';
import api from '@/services/api';
import type { Project } from '@/types';

interface ProjectState {
    projects: Project[];
    currentProject: Project | null;
    loading: boolean;
    error: any;
}

export const useProjectStore = defineStore('project', {
    state: (): ProjectState => ({
        projects: [],
        currentProject: null,
        loading: false,
        error: null,
    }),
    actions: {
        async fetchProjects(search?: string) {
            this.loading = true;
            try {
                const params = search ? { search } : {};
                const response = await api.get('/projects', { params });
                this.projects = response.data;
            } catch (error) {
                this.error = error;
            } finally {
                this.loading = false;
            }
        },
        async fetchProject(id: number) {
            this.loading = true;
            try {
                const response = await api.get(`/projects/${id}`);
                this.currentProject = response.data;
                return response.data;
            } catch (error) {
                this.error = error;
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async createProject(project: Partial<Project>) {
            try {
                const response = await api.post('/projects', project);
                this.projects.unshift(response.data);
                return response.data;
            } catch (error) {
                throw error;
            }
        },
        async updateProject(id: number, data: Partial<Project>) {
            try {
                const response = await api.put(`/projects/${id}`, data);
                if (this.currentProject && this.currentProject.id === id) {
                    this.currentProject = { ...this.currentProject, ...response.data };
                }
                const index = this.projects.findIndex(p => p.id === id);
                if (index !== -1) {
                    this.projects[index] = { ...this.projects[index], ...response.data };
                }
                return response.data;
            } catch (error) {
                throw error;
            }
        }
    }
});

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface Category {
    id: number;
    name: string;
    color: string | null;
}

export interface Project {
    id: number;
    name: string;
    description: string | null;
    due_date: string | null;
    status: 'active' | 'archived';
    tasks?: Task[];
    created_at: string;
    updated_at: string;
}

export interface Task {
    id: number;
    project_id: number;
    category_id: number | null;
    title: string;
    description: string | null;
    due_date: string | null;
    category?: Category;
    project?: Project;
    created_at: string;
    updated_at: string;
}

export interface DashboardStats {
    total_active_projects: number;
    total_pending_tasks: number;
    near_due_tasks: Task[];
}

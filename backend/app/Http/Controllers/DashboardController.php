<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $activeProjects = Project::where('status', 'active')->count();

        // Tasks not in the "Done" category (assume category 3 is "Done" based on our seeder, or check name)
        // Hardcoding ID 3 for simplicity based on seeder order.
        $pendingTasksCount = Task::where('category_id', '!=', 3)->count();

        // Tasks nearing due date (e.g. within next 3 days and not done)
        $nearDueDateTasks = Task::with(['project', 'category'])
            ->where('category_id', '!=', 3)
            ->whereNotNull('due_date')
            ->whereBetween('due_date', [now()->startOfDay(), now()->addDays(3)->endOfDay()])
            ->orderBy('due_date', 'asc')
            ->get();

        return response()->json([
            'total_active_projects' => $activeProjects,
            'total_pending_tasks' => $pendingTasksCount,
            'near_due_tasks' => $nearDueDateTasks
        ]);
    }
}

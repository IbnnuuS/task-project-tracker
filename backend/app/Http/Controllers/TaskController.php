<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function globalTasks(Request $request)
    {
        $query = Task::with(['project', 'category']);

        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        return response()->json($query->orderBy('due_date', 'asc')->get());
    }

    public function index(Project $project)
    {
        return response()->json($project->tasks()->with('category')->get());
    }

    public function store(Request $request, Project $project)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'due_date' => 'nullable|date',
        ]);

        $task = $project->tasks()->create($validated);
        $task->load('category');

        return response()->json($task, 201);
    }

    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'sometimes|required|exists:categories,id',
            'due_date' => 'nullable|date',
            'project_id' => 'sometimes|required|exists:projects,id'
        ]);

        $task->update($validated);
        $task->load(['category', 'project']);

        return response()->json($task);
    }

    public function destroy(Request $request, Task $task)
    {
        $task->deleted_by = $request->user()->id;
        $task->save();

        $task->delete(); // Soft delete

        return response()->json(['message' => 'Task deleted successfully.']);
    }
}

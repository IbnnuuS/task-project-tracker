<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Project;
use App\Models\Category;
use App\Models\Task;

class TaskTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_create_task_with_valid_data(): void
    {
        $user = User::factory()->create();
        $project = Project::factory()->create();
        $category = Category::create(['name' => 'To Do']);

        $response = $this->actingAs($user, 'sanctum')->postJson("/api/projects/{$project->id}/tasks", [
            'category_id' => $category->id,
            'title' => 'Implement API Call',
            'description' => 'Test task description',
            'due_date' => '2024-12-31'
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('title', 'Implement API Call');

        $this->assertDatabaseHas('tasks', [
            'title' => 'Implement API Call',
            'project_id' => $project->id
        ]);
    }

    public function test_task_creation_fails_without_title(): void
    {
        $user = User::factory()->create();
        $project = Project::factory()->create();
        $category = Category::create(['name' => 'To Do']);

        $response = $this->actingAs($user, 'sanctum')->postJson("/api/projects/{$project->id}/tasks", [
            'category_id' => $category->id,
            'description' => 'Test but missing title',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title']);
    }

    public function test_authenticated_user_can_soft_delete_task(): void
    {
        $user = User::factory()->create();
        $project = Project::factory()->create();
        $task = Task::factory()->create(['title' => 'Task to delete', 'project_id' => $project->id]);

        $response = $this->actingAs($user, 'sanctum')->deleteJson("/api/tasks/{$task->id}");

        $response->assertStatus(200);

        $this->assertSoftDeleted('tasks', [
            'id' => $task->id,
            'deleted_by' => $user->id
        ]);
    }
}

<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Admin User
        User::factory()->create([
            'name' => 'Admin TaskTracker',
            'email' => 'admin@track.er',
            'password' => Hash::make('password123'),
        ]);

        // 2. Categories
        $categories = [
            ['name' => 'To Do', 'color' => '#fbbf24'],
            ['name' => 'In Progress', 'color' => '#3b82f6'],
            ['name' => 'Testing', 'color' => '#8b5cf6'],
            ['name' => 'Done', 'color' => '#10b981'],
            ['name' => 'Pending', 'color' => '#64748b'],
        ];

        foreach ($categories as $cat) {
            Category::create($cat);
        }
    }
}

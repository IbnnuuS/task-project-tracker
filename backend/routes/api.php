<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::post('/login', [AuthController::class , 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class , 'logout']);
    Route::get('/user', [AuthController::class , 'user']);

    Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class , 'index']);

    Route::apiResource('projects', \App\Http\Controllers\ProjectController::class)->except(['destroy']);
    Route::get('/categories', [\App\Http\Controllers\CategoryController::class , 'index']);

    Route::get('/tasks', [\App\Http\Controllers\TaskController::class , 'globalTasks']);
    Route::get('/projects/{project}/tasks', [\App\Http\Controllers\TaskController::class , 'index']);
    Route::post('/projects/{project}/tasks', [\App\Http\Controllers\TaskController::class , 'store']);
    Route::put('/tasks/{task}', [\App\Http\Controllers\TaskController::class , 'update']);
    Route::delete('/tasks/{task}', [\App\Http\Controllers\TaskController::class , 'destroy']);
});

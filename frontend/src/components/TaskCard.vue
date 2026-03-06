<script setup lang="ts">
import type { Task } from '@/types'

defineProps<{
    task: Task
}>()

const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString()
}
</script>

<template>
  <div class="task-card-mini">
    <h4 class="title">{{ task.title }}</h4>
    <p v-if="task.description" class="desc">{{ task.description }}</p>
    <div v-if="task.due_date" class="due">
        Due: {{ formatDate(task.due_date) }}
    </div>
  </div>
</template>

<style scoped>
.task-card-mini {
    padding: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    background: white;
}
.title { margin: 0 0 0.5rem 0; font-weight: 600; color: #111827;}
.desc { margin: 0 0 0.5rem 0; font-size: 0.875rem; color: #4b5563;}
.due { font-size: 0.75rem; color: #dc2626; font-weight: 500;}
</style>

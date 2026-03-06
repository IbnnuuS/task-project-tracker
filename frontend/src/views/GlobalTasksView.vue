<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTaskStore } from '@/stores/task'
import { useRouter } from 'vue-router'

const taskStore = useTaskStore()
const router = useRouter()

const searchQuery = ref('')
const loading = ref(false)
const errorMsg = ref('')

const getErrorMessage = (error: any) => {
  if (error.response?.status === 422) {
    return "Validasi gagal: Harap periksa kembali isian formulir Anda.";
  }
  if (error.response?.status >= 500) {
    return "Terjadi masalah pada server. Silakan coba beberapa saat lagi.";
  }
  return error.response?.data?.message || "Terjadi kesalahan yang tidak terduga. Periksa koneksi Anda.";
};

const loadTasks = async () => {
    loading.value = true
    errorMsg.value = ''
    try {
        await taskStore.fetchGlobalTasks(searchQuery.value)
    } catch (e: any) {
        errorMsg.value = "Gagal memuat task: " + getErrorMessage(e)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    loadTasks()
})

const handleSearch = () => {
    loadTasks()
}

const goToProject = (projectId: number) => {
    router.push({ name: 'project-detail', params: { id: projectId } })
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
}
</script>

<template>
  <div class="pagetitle">
    <h1>All Tasks Directory</h1>
    <nav>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Home</a></li>
        <li class="breadcrumb-item active">All Tasks</li>
      </ol>
    </nav>
  </div><!-- End Page Title -->

  <section class="section">
    <div class="row">
      <div class="col-lg-12">

        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Browse globally across all projects</h5>
            
            <!-- Error Alert -->
            <div v-if="errorMsg" class="alert alert-danger alert-dismissible fade show" role="alert">
              <i class="bi bi-exclamation-triangle me-1"></i>
              {{ errorMsg }}
              <button type="button" class="btn-close" @click="errorMsg = ''" aria-label="Close"></button>
            </div>

            <div class="row mb-4">
              <div class="col-12 col-md-6 col-lg-4">
                <div class="input-group">
                  <input 
                      v-model="searchQuery" 
                      @keyup.enter="handleSearch"
                      type="text" 
                      class="form-control" 
                      placeholder="Search tasks by title..." 
                  />
                  <button class="btn btn-outline-secondary" type="button" @click="handleSearch">
                    <i class="bi bi-search"></i> Search
                  </button>
                </div>
              </div>
            </div>

            <!-- Global Tasks Table -->
            <div v-if="loading" class="text-center p-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            
            <div v-else-if="taskStore.globalTasks.length === 0" class="alert alert-secondary text-center" role="alert">
                No tasks match your criteria.
            </div>
            
            <div v-else class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Task Core</th>
                            <th scope="col">Project</th>
                            <th scope="col">Category</th>
                            <th scope="col">Due</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="task in taskStore.globalTasks" :key="task.id" class="align-middle">
                            <td>
                                <div class="fw-bold text-primary">{{ task.title }}</div>
                                <div class="small text-muted text-truncate" style="max-width: 300px;">
                                  {{ task.description || '-' }}
                                </div>
                            </td>
                            <td>
                                <a href="#" @click.prevent="goToProject(task.project_id)" class="text-decoration-none fw-semibold">
                                    {{ task.project?.name || 'Unknown Project' }}
                                </a>
                            </td>
                            <td>
                                <span class="badge" :style="{ backgroundColor: task.category?.color || '#cbd5e1', color: '#fff' }">
                                    {{ task.category?.name || 'Uncategorized' }}
                                </span>
                            </td>
                            <td :class="{'text-danger fw-bold': task.due_date && new Date(task.due_date) < new Date(), 'text-secondary': !task.due_date || new Date(task.due_date) >= new Date()}">
                                <i class="bi bi-calendar me-1" v-if="task.due_date"></i>
                                {{ task.due_date ? formatDate(task.due_date) : 'No due date' }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

          </div>
        </div>

      </div>
    </div>
  </section>
</template>

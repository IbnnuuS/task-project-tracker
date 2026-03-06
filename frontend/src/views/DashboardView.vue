<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "@/services/api";
import type { DashboardStats, Task } from "@/types";

const stats = ref<DashboardStats | null>(null);
const loading = ref(true);

const fetchDashboardStats = async () => {
  loading.value = true;
  try {
    const response = await api.get("/dashboard");
    stats.value = response.data;
  } catch (error) {
    console.error("Error fetching dashboard stats", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDashboardStats();
});

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
</script>

<template>
  <div class="pagetitle">
    <h1>Dashboard Overview</h1>
    <nav>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Home</a></li>
        <li class="breadcrumb-item active">Dashboard</li>
      </ol>
    </nav>
  </div>
  <!-- End Page Title -->

  <section class="section dashboard">
    <div v-if="loading" class="text-center p-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="stats" class="row">
      <!-- Left side columns -->
      <div class="col-lg-8">
        <div class="row">
          <!-- Active Projects Card -->
          <div class="col-xxl-6 col-md-6">
            <div class="card info-card sales-card">
              <div class="card-body">
                <h5 class="card-title">Projects <span>| Active</span></h5>

                <div class="d-flex align-items-center">
                  <div
                    class="card-icon rounded-circle d-flex align-items-center justify-content-center"
                  >
                    <i class="bi bi-folder-check"></i>
                  </div>
                  <div class="ps-3">
                    <h6>{{ stats.total_active_projects }}</h6>
                    <span class="text-success small pt-1 fw-bold">Active</span>
                    <span class="text-muted small pt-2 ps-1">Projects</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- End Sales Card -->

          <!-- Pending Tasks Card -->
          <div class="col-xxl-6 col-md-6">
            <div class="card info-card revenue-card">
              <div class="card-body">
                <h5 class="card-title">Tasks <span>| Pending</span></h5>

                <div class="d-flex align-items-center">
                  <div
                    class="card-icon rounded-circle d-flex align-items-center justify-content-center"
                  >
                    <i class="bi bi-list-task"></i>
                  </div>
                  <div class="ps-3">
                    <h6>{{ stats.total_pending_tasks }}</h6>
                    <span class="text-warning small pt-1 fw-bold"
                      >In-Progress</span
                    >
                    <span class="text-muted small pt-2 ps-1">or Todo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- End Pending Card -->

          <!-- Urgent Tasks Table -->
          <div class="col-12">
            <div class="card recent-sales overflow-auto">
              <div class="card-body">
                <h5 class="card-title">
                  Urgent Tasks <span>| Next 3 Days</span>
                </h5>

                <div
                  v-if="stats.near_due_tasks.length === 0"
                  class="alert alert-success bg-success text-light border-0 alert-dismissible fade show"
                  role="alert"
                >
                  No tasks are due soon. Awesome work!
                </div>

                <table v-else class="table table-borderless datatable">
                  <thead>
                    <tr>
                      <th scope="col">Task</th>
                      <th scope="col">Project</th>
                      <th scope="col">Category</th>
                      <th scope="col">Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="task in stats.near_due_tasks" :key="task.id">
                      <td>
                        <a href="#" class="text-primary fw-bold">{{
                          task.title
                        }}</a>
                      </td>
                      <td>{{ task.project?.name }}</td>
                      <td>
                        <span
                          class="badge"
                          :style="{
                            backgroundColor: task.category?.color || '#cbd5e1',
                          }"
                        >
                          {{ task.category?.name || "Uncategorized" }}
                        </span>
                      </td>
                      <td class="text-danger fw-bold">
                        <i class="bi bi-exclamation-circle me-1"></i>
                        {{ formatDate(task.due_date!) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <!-- End Urgent Tasks -->
        </div>
      </div>
      <!-- End Left side columns -->

      <!-- Right side columns -->
      <div class="col-lg-4">
        <!-- System Activity (Placeholder for symmetry) -->
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Tasks <span>| Near Due Date</span></h5>
            <div class="activity">
              <!-- Empty state activity -->
              <div
                v-if="stats.near_due_tasks.length === 0"
                class="activity-item d-flex"
              >
                <div class="activite-label" style="min-width: 60px">-</div>
                <i
                  class="bi bi-circle-fill activity-badge text-success align-self-start"
                ></i>
                <div class="activity-content text-muted">
                  No urgent tasks right now.
                </div>
              </div>

              <!-- Loop for near due tasks -->
              <div
                v-for="task in stats.near_due_tasks"
                :key="task.id"
                class="activity-item d-flex pb-3"
              >
                <div
                  class="activite-label fw-bold"
                  style="min-width: 60px"
                  :class="{
                    'text-danger': new Date(task.due_date) < new Date(),
                    'text-warning': new Date(task.due_date) >= new Date(),
                  }"
                >
                  {{ formatDate(task.due_date!) }}
                </div>
                <i
                  class="bi bi-circle-fill activity-badge align-self-start"
                  :class="
                    new Date(task.due_date) < new Date()
                      ? 'text-danger'
                      : 'text-warning'
                  "
                ></i>
                <div class="activity-content">
                  <span class="text-primary fw-bold">{{ task.title }}</span>
                  <div class="small text-muted mt-1">
                    {{ task.project?.name || "No Project" }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- End Activity -->
      </div>
      <!-- End Right side columns -->
    </div>
  </section>
</template>

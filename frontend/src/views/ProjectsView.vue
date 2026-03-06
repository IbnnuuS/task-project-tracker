<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useProjectStore } from "@/stores/project";
import { useRouter } from "vue-router";

const projectStore = useProjectStore();
const router = useRouter();

const searchQuery = ref("");
const newProjectName = ref("");
const newProjectDesc = ref("");
const newProjectDueDate = ref("");
const submitting = ref(false);
const errorMsg = ref("");

const getErrorMessage = (error: any) => {
  if (error.response?.status === 422) {
    return "Validasi gagal: Harap periksa kembali isian formulir Anda.";
  }
  if (error.response?.status >= 500) {
    return "Terjadi masalah pada server. Silakan coba beberapa saat lagi.";
  }
  return error.response?.data?.message || "Terjadi kesalahan yang tidak terduga. Periksa koneksi Anda.";
};

const loadProjects = async () => {
  errorMsg.value = "";
  try {
    await projectStore.fetchProjects(searchQuery.value);
  } catch (error: any) {
    errorMsg.value = "Gagal memuat daftar project: " + getErrorMessage(error);
  }
};

onMounted(() => {
  loadProjects();
});

const handleSearch = () => {
  loadProjects();
};

const handleCreateProject = async () => {
  if (!newProjectName.value.trim()) return;
  submitting.value = true;
  try {
    await projectStore.createProject({
      name: newProjectName.value,
      description: newProjectDesc.value,
      due_date: newProjectDueDate.value || null,
    });
    newProjectName.value = "";
    newProjectDesc.value = "";
    newProjectDueDate.value = "";

    // Hide Bootstrap modal programmatically
    const modalElement = document.getElementById("createProjectModal");
    if (modalElement && (window as any).bootstrap) {
      const modalInstance = (window as any).bootstrap.Modal.getInstance(
        modalElement,
      );
      if (modalInstance) modalInstance.hide();
    }
  } catch (error: any) {
    errorMsg.value = "Gagal membuat project baru: " + getErrorMessage(error);
    console.error("Error creating project", error);
  } finally {
    submitting.value = false;
  }
};

const goToProject = (id: number) => {
  router.push({ name: "project-detail", params: { id } });
};
</script>

<template>
  <div class="pagetitle d-flex justify-content-between align-items-center flex-wrap gap-2">
    <div>
      <h1>Projects</h1>
      <nav>
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="#">Home</a></li>
          <li class="breadcrumb-item active">Projects</li>
        </ol>
      </nav>
    </div>
    <button
      class="btn btn-primary"
      data-bs-toggle="modal"
      data-bs-target="#createProjectModal"
    >
      <i class="bi bi-plus-lg me-1"></i> New Project
    </button>
  </div>
  <!-- End Page Title -->

  <section class="section">
    <!-- Error Alert -->
    <div v-if="errorMsg" class="alert alert-danger alert-dismissible fade show" role="alert">
      <i class="bi bi-exclamation-triangle me-1"></i>
      {{ errorMsg }}
      <button type="button" class="btn-close" @click="errorMsg = ''" aria-label="Close"></button>
    </div>

    <!-- Actions Bar -->
    <div class="row mb-4">
      <div class="col-12 col-md-6 col-lg-4">
        <div class="input-group">
          <input
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            type="text"
            class="form-control"
            placeholder="Search projects by name..."
          />
          <button
            class="btn btn-outline-secondary"
            type="button"
            @click="handleSearch"
          >
            <i class="bi bi-search"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Projects Grid -->
    <div v-if="projectStore.loading" class="text-center p-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div
      v-else-if="projectStore.projects.length === 0"
      class="alert alert-secondary text-center"
      role="alert"
    >
      No projects found. Create one to get started!
    </div>

    <div v-else class="row align-items-stretch">
      <div
        v-for="project in projectStore.projects"
        :key="project.id"
        class="col-md-6 col-xl-4 mb-4"
      >
        <div
          class="card h-100 project-card"
          @click="goToProject(project.id)"
          style="cursor: pointer"
        >
          <div class="card-body">
            <div
              class="d-flex justify-content-between align-items-start mb-2 mt-3"
            >
              <h5
                class="card-title p-0 m-0 text-truncate"
                style="max-width: 70%"
                :title="project.name"
              >
                {{ project.name }}
              </h5>
              <span
                class="badge"
                :class="
                  project.status === 'active' ? 'bg-success' : 'bg-secondary'
                "
              >
                {{ project.status }}
              </span>
            </div>

            <p class="card-text text-muted small mt-3 slide-desc">
              {{ project.description || "No description provided." }}
            </p>
          </div>

          <div
            class="card-footer bg-white border-top-0 pt-0 d-flex justify-content-between align-items-center"
          >
            <small class="text-muted"
              ><i class="bi bi-calendar3 me-1"></i> Created
              {{ new Date(project.created_at).toLocaleDateString() }}</small
            >
            <small
              v-if="project.due_date"
              :class="{
                'text-danger fw-bold': new Date(project.due_date) < new Date(),
                'text-primary': new Date(project.due_date) >= new Date(),
              }"
            >
              <i class="bi bi-clock me-1"></i> Due:
              {{ new Date(project.due_date).toLocaleDateString() }}
            </small>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Create Project Modal -->
  <div
    class="modal fade"
    id="createProjectModal"
    tabindex="-1"
    aria-labelledby="createProjectModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="createProjectModalLabel">
            Create New Project
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <form @submit.prevent="handleCreateProject">
          <div class="modal-body">
            <div class="mb-3">
              <label for="projectName" class="form-label"
                >Project Name <span class="text-danger">*</span></label
              >
              <input
                type="text"
                class="form-control"
                id="projectName"
                v-model="newProjectName"
                required
                placeholder="e.g. Website Redesign"
              />
            </div>
            <div class="mb-3">
              <label for="projectDesc" class="form-label">Description</label>
              <textarea
                class="form-control"
                id="projectDesc"
                v-model="newProjectDesc"
                rows="3"
                placeholder="Optional details..."
              ></textarea>
            </div>
            <div class="mb-3">
              <label for="projectDueDate" class="form-label">Due Date</label>
              <input
                type="date"
                class="form-control"
                id="projectDueDate"
                v-model="newProjectDueDate"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="submitting || !newProjectName.trim()"
            >
              <span
                v-if="submitting"
                class="spinner-border spinner-border-sm me-1"
                role="status"
                aria-hidden="true"
              ></span>
              {{ submitting ? "Creating..." : "Create Project" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.project-card {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  border: 1px solid rgba(0, 0, 0, 0.125);
}
.project-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  border-color: #4154f1;
}
.slide-desc {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProjectStore } from "@/stores/project";
import { useTaskStore } from "@/stores/task";
import type { Task } from "@/types";

const route = useRoute();
const router = useRouter();
const projectStore = useProjectStore();
const taskStore = useTaskStore();

const projectId = Number(route.params.id);

// UI State
const editingTask = ref<Task | null>(null);
const taskTitle = ref("");
const taskDesc = ref("");
const taskCategoryId = ref<number | null>(null);
const taskDueDate = ref("");
const submittingTask = ref(false);
const draggedTask = ref<Task | null>(null);

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

// Load Data
onMounted(async () => {
  await taskStore.fetchCategories();
  await projectStore.fetchProject(projectId).catch(() => {
    router.push({ name: "projects" });
  });
});

const project = computed(() => projectStore.currentProject);
const categories = computed(() => taskStore.categories);

// Task Groups mapped to columns
const tasksByCategory = computed(() => {
  const grouped: Record<number, Task[]> = {};
  // Initialize groups for all categories to ensure empty columns show
  categories.value.forEach((c) => (grouped[c.id] = []));

  if (project.value && project.value.tasks) {
    project.value.tasks.forEach((t) => {
      const catId = t.category_id || categories.value[0]?.id;
      if (catId && grouped[catId]) {
        grouped[catId].push(t);
      }
    });
  }
  return grouped;
});

// Edit Project
const editingProject = ref(false);
const pName = ref("");
const pDesc = ref("");
const pDueDate = ref("");
const pStatus = ref<"active" | "archived">("active");

const startEditProject = () => {
  if (project.value) {
    pName.value = project.value.name;
    pDesc.value = project.value.description || "";
    pDueDate.value = project.value.due_date
      ? (project.value.due_date.split("T")[0] || "")
      : "";
    pStatus.value = project.value.status;
    editingProject.value = true;
  }
};

const saveProject = async () => {
  try {
    await projectStore.updateProject(projectId, {
      name: pName.value,
      description: pDesc.value,
      due_date: pDueDate.value || null,
      status: pStatus.value,
    });
    editingProject.value = false;
    errorMsg.value = "";
  } catch (e: any) {
    errorMsg.value = "Gagal memperbarui project: " + getErrorMessage(e);
    console.error(e);
  }
};

// Manage Tasks
const getModalInstance = () => {
  const modalEl = document.getElementById("taskModal");
  if (modalEl && (window as any).bootstrap) {
    return (window as any).bootstrap.Modal.getOrCreateInstance(modalEl);
  }
  return null;
};

const openNewTaskModal = (catId: number) => {
  editingTask.value = null;
  taskTitle.value = "";
  taskDesc.value = "";
  taskCategoryId.value = catId;
  taskDueDate.value = "";
  getModalInstance()?.show();
};

const editExistingTask = (t: Task) => {
  editingTask.value = t;
  taskTitle.value = t.title;
  taskDesc.value = t.description || "";
  taskCategoryId.value = t.category_id;
  taskDueDate.value = t.due_date ? (t.due_date.split("T")[0] || "") : "";
  getModalInstance()?.show();
};

const saveTask = async () => {
  if (!taskTitle.value.trim() || !taskCategoryId.value) return;
  submittingTask.value = true;
  try {
    const payload = {
      title: taskTitle.value,
      description: taskDesc.value,
      category_id: taskCategoryId.value,
      due_date: taskDueDate.value || null,
    };
    if (editingTask.value) {
      await taskStore.updateTask(editingTask.value.id, payload);
    } else {
      await taskStore.createTask(projectId, payload);
    }
    getModalInstance()?.hide();
    errorMsg.value = "";
  } catch (e: any) {
    errorMsg.value = "Gagal menyimpan task: " + getErrorMessage(e);
    console.error(e);
  } finally {
    submittingTask.value = false;
  }
};

const deleteTask = async (t: Task) => {
  if (confirm(`Are you sure you want to delete "${t.title}"?`)) {
    try {
      await taskStore.softDeleteTask(t.id);
      errorMsg.value = "";
    } catch (e: any) {
       errorMsg.value = "Gagal menghapus task: " + getErrorMessage(e);
    }
  }
};

// Drag and Drop Logic
const onDragStart = (e: DragEvent, task: Task) => {
  draggedTask.value = task;
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("taskId", task.id.toString());
  }
};

const onDrop = async (e: DragEvent, targetCategoryId: number) => {
  e.preventDefault();
  const t = draggedTask.value;
  if (t && t.category_id !== targetCategoryId) {
    try {
      await taskStore.updateTask(t.id, { category_id: targetCategoryId });
      errorMsg.value = "";
    } catch (e: any) {
      errorMsg.value = "Gagal memindahkan task: " + getErrorMessage(e);
    }
  }
  draggedTask.value = null;
};
</script>

<template>
  <div v-if="projectStore.loading && !project" class="text-center p-5">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading Project...</span>
    </div>
  </div>

  <div v-else-if="project" class="project-detail-wrap">
    <div
      class="pagetitle d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2"
    >
      <div>
        <h1 class="mb-2">
          <a
            href="#"
            @click.prevent="router.push({ name: 'projects' })"
            class="text-primary me-2"
            ><i class="bi bi-arrow-left-short"></i
          ></a>
          {{ project.name }}
          <span
            class="badge ms-2 align-middle"
            style="font-size: 0.5em"
            :class="project.status === 'active' ? 'bg-success' : 'bg-secondary'"
          >
            {{ project.status }}
          </span>
          <span
            v-if="project.due_date"
            class="badge ms-2 align-middle border bg-light"
            style="font-size: 0.5em"
            :class="{
              'text-danger border-danger':
                new Date(project.due_date) < new Date(),
              'text-dark': new Date(project.due_date) >= new Date(),
            }"
          >
            <i class="bi bi-calendar me-1"></i> Due
            {{ new Date(project.due_date).toLocaleDateString() }}
          </span>
        </h1>
        <nav>
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="#">Home</a></li>
            <li class="breadcrumb-item">
              <a href="#" @click.prevent="router.push({ name: 'projects' })"
                >Projects</a
              >
            </li>
            <li class="breadcrumb-item active">Detail</li>
          </ol>
        </nav>
      </div>
      <div>
        <button
          v-if="!editingProject"
          @click="startEditProject"
          class="btn btn-outline-primary btn-sm"
        >
          <i class="bi bi-pencil me-1"></i> Edit Project
        </button>
      </div>
    </div>

    <section class="section">
      <!-- Error Alert -->
      <div v-if="errorMsg" class="alert alert-danger alert-dismissible fade show" role="alert">
        <i class="bi bi-exclamation-triangle me-1"></i>
        {{ errorMsg }}
        <button type="button" class="btn-close" @click="errorMsg = ''" aria-label="Close"></button>
      </div>

      <!-- Edit Project Form Inline -->
      <div v-if="editingProject" class="card mb-4">
        <div class="card-body pt-3">
          <h5 class="card-title">Edit Project Settings</h5>
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Project Name</label>
              <input v-model="pName" type="text" class="form-control" />
            </div>
            <div class="col-md-3 col-6">
              <label class="form-label">Due Date</label>
              <input v-model="pDueDate" type="date" class="form-control" />
            </div>
            <div class="col-md-3 col-6">
              <label class="form-label">Status</label>
              <select v-model="pStatus" class="form-select">
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div class="col-12">
              <label class="form-label">Description</label>
              <textarea
                v-model="pDesc"
                class="form-control"
                rows="2"
              ></textarea>
            </div>
            <div class="col-12 mt-3">
              <button @click="saveProject" class="btn btn-primary me-2">
                Save Changes
              </button>
              <button @click="editingProject = false" class="btn btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!editingProject && project.description" class="card mb-4">
        <div class="card-body pt-3 pb-3">
          <p class="mb-0 text-muted">{{ project.description }}</p>
        </div>
      </div>

      <!-- Kanban Board Layout -->
      <div class="kanban-scroll-container">
        <div class="kanban-board">
          <div
            v-for="category in categories"
            :key="category.id"
            class="kanban-col card"
            @dragover.prevent
            @dragenter.prevent
            @drop="onDrop($event, category.id)"
          >
            <div
              class="card-header bg-white border-bottom-0 pb-0 pt-3 d-flex justify-content-between align-items-center column-accent"
              :style="{ borderTopColor: category.color || '#ccc' }"
            >
              <h6 class="mb-0 fw-bold">{{ category.name }}</h6>
              <span class="badge bg-light text-dark rounded-pill border">{{
                tasksByCategory[category.id]?.length || 0
              }}</span>
            </div>

            <div class="card-body p-2 kanban-cards-container">
              <div class="d-grid gap-2">
                <div
                  v-for="task in tasksByCategory[category.id]"
                  :key="task.id"
                  class="card mb-0 task-card border"
                  draggable="true"
                  @dragstart="onDragStart($event, task)"
                  @click="editExistingTask(task)"
                >
                  <div class="card-body p-3">
                    <h6 class="card-title p-0 mb-1 fs-6">{{ task.title }}</h6>
                    <p
                      v-if="task.description"
                      class="small text-muted mb-2 text-truncate"
                    >
                      {{ task.description }}
                    </p>

                    <div
                      class="d-flex justify-content-between align-items-center mt-2"
                    >
                      <div
                        class="small"
                        :class="{
                          'text-danger fw-bold':
                            task.due_date &&
                            new Date(task.due_date) < new Date(),
                          'text-muted':
                            !task.due_date ||
                            new Date(task.due_date) >= new Date(),
                        }"
                      >
                        <i class="bi bi-clock me-1" v-if="task.due_date"></i
                        >{{
                          task.due_date
                            ? new Date(task.due_date).toLocaleDateString()
                            : ""
                        }}
                      </div>
                      <div class="d-flex gap-2 align-items-center" @click.stop>
                        <a
                          href="#"
                          class="text-secondary"
                          title="Edit"
                          @click.prevent="editExistingTask(task)"
                          ><i class="bi bi-pencil-square"></i
                        ></a>
                        <a
                          href="#"
                          class="text-danger"
                          title="Delete"
                          @click.prevent="deleteTask(task)"
                          ><i class="bi bi-trash"></i
                        ></a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-2 d-grid">
                <button
                  @click="openNewTaskModal(category.id)"
                  class="btn btn-sm btn-outline-secondary border-dashed"
                >
                  <i class="bi bi-plus"></i> Add Task
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Task Modal -->
    <div class="modal fade" id="taskModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ editingTask ? "Edit Task" : "New Task" }}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <form @submit.prevent="saveTask">
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label"
                  >Task Title <span class="text-danger">*</span></label
                >
                <input
                  v-model="taskTitle"
                  type="text"
                  required
                  class="form-control"
                  placeholder="e.g. Design Wireframes"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea
                  v-model="taskDesc"
                  rows="3"
                  class="form-control"
                  placeholder="Context or criteria..."
                ></textarea>
              </div>
              <div class="row">
                <div class="col-sm-6 mb-3">
                  <label class="form-label"
                    >Status Category <span class="text-danger">*</span></label
                  >
                  <select v-model="taskCategoryId" required class="form-select">
                    <option
                      v-for="cat in categories"
                      :key="cat.id"
                      :value="cat.id"
                    >
                      {{ cat.name }}
                    </option>
                  </select>
                </div>
                <div class="col-sm-6 mb-3">
                  <label class="form-label">Due Date</label>
                  <input
                    v-model="taskDueDate"
                    type="date"
                    class="form-control"
                  />
                </div>
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
                :disabled="submittingTask || !taskTitle.trim()"
              >
                <span
                  v-if="submittingTask"
                  class="spinner-border spinner-border-sm me-1"
                ></span>
                {{ submittingTask ? "Saving..." : "Save Task" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kanban-scroll-container {
  overflow-x: auto;
  padding-bottom: 1rem;
}
.kanban-board {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  min-width: min-content;
}
.kanban-col {
  min-width: 320px;
  width: 320px;
  background-color: #f6f9ff;
  box-shadow: 0 0px 4px rgba(0, 0, 0, 0.05);
}
.column-accent {
  border-top: 4px solid transparent;
}
.kanban-cards-container {
  max-height: 60vh;
  overflow-y: auto;
}

/* Custom Scrollbar for inner column */
.kanban-cards-container::-webkit-scrollbar {
  width: 6px;
}
.kanban-cards-container::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 4px;
}

.task-card {
  cursor: grab;
  transition:
    transform 0.15s,
    box-shadow 0.15s;
}
.task-card:active {
  cursor: grabbing;
}
.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-color: #aeb5fe !important;
}
.border-dashed {
  border-style: dashed;
  border-width: 2px;
}
.border-dashed:hover {
  border-style: solid;
  background-color: #e0e5fe;
  color: #4154f1;
  border-color: #4154f1;
}
</style>

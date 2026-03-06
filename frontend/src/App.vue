<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { useRouter, RouterLink } from "vue-router";
import { onMounted, ref } from "vue";

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = async () => {
  await authStore.logout();
  router.push({ name: "login" });
};

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  document.body.classList.toggle("toggle-sidebar");
  isSidebarOpen.value = document.body.classList.contains("toggle-sidebar");
};

const closeSidebar = () => {
  document.body.classList.remove("toggle-sidebar");
  isSidebarOpen.value = false;
};

// Initialize NiceAdmin sidebar toggle
onMounted(() => {
  const toggleBtn = document.querySelector(".toggle-sidebar-btn");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", toggleSidebar);
  }

  // Auto-close sidebar on mobile when a nav link is clicked
  const navLinks = document.querySelectorAll(".sidebar-nav .nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 1200) {
        closeSidebar();
      }
    });
  });
});
</script>

<template>
  <div v-if="authStore.isAuthenticated">
    <!-- ======= Header ======= -->
    <header id="header" class="header fixed-top d-flex align-items-center">
      <div class="d-flex align-items-center justify-content-between border-0">
        <a href="#" class="logo d-flex align-items-center text-decoration-none">
          <img src="/assets/img/logo.png" alt="" />
          <span class="d-none d-lg-block">Tracker</span>
        </a>
        <i class="bi bi-list toggle-sidebar-btn"></i>
      </div>
      <!-- End Logo -->

      <nav class="header-nav ms-auto">
        <ul class="d-flex align-items-center">
          <li class="nav-item dropdown pe-3">
            <a
              class="nav-link nav-profile d-flex align-items-center pe-0"
              href="#"
              data-bs-toggle="dropdown"
            >
              <img
                src="/assets/img/profile-img.jpg"
                alt="Profile"
                class="rounded-circle"
              />
              <span class="d-none d-md-block dropdown-toggle ps-2">{{
                authStore.user?.name
              }}</span> </a
            ><!-- End Profile Iamge Icon -->

            <ul
              class="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile"
            >
              <li class="dropdown-header">
                <h6>{{ authStore.user?.name }}</h6>
                <span>{{ authStore.user?.email }}</span>
              </li>
              <li>
                <hr class="dropdown-divider" />
              </li>
              <li>
                <a
                  class="dropdown-item d-flex align-items-center"
                  href="#"
                  @click.prevent="handleLogout"
                >
                  <i class="bi bi-box-arrow-right"></i>
                  <span>Sign Out</span>
                </a>
              </li>
            </ul>
            <!-- End Profile Dropdown Items -->
          </li>
          <!-- End Profile Nav -->
        </ul>
      </nav>
      <!-- End Icons Navigation -->
    </header>
    <!-- End Header -->

    <!-- Sidebar Overlay (mobile backdrop) -->
    <div
      class="sidebar-overlay"
      @click="closeSidebar"
    ></div>
    <!-- ======= Sidebar ======= -->
    <aside id="sidebar" class="sidebar">
      <ul class="sidebar-nav" id="sidebar-nav">
        <li class="nav-item">
          <RouterLink
            :to="{ name: 'dashboard' }"
            class="nav-link collapsed"
            active-class="active"
          >
            <i class="bi bi-grid"></i>
            <span>Dashboard</span>
          </RouterLink>
        </li>
        <!-- End Dashboard Nav -->

        <li class="nav-heading">Management</li>

        <li class="nav-item">
          <RouterLink
            :to="{ name: 'projects' }"
            class="nav-link collapsed"
            active-class="active"
          >
            <i class="bi bi-folder2-open"></i>
            <span>Projects</span>
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink
            :to="{ name: 'global-tasks' }"
            class="nav-link collapsed"
            active-class="active"
          >
            <i class="bi bi-card-checklist"></i>
            <span>All Tasks</span>
          </RouterLink>
        </li>
      </ul>
    </aside>
    <!-- End Sidebar-->

    <main id="main" class="main">
      <router-view></router-view>
    </main>

    <!-- ======= Footer ======= -->
    <footer id="footer" class="footer">
      <div class="copyright">
        &copy; Copyright
        <strong
          ><span
            ><a href="https://github.com/IbnnuuS" target="_blank"
              >IbnnuuS</a
            ></span
          ></strong
        >. All Rights Reserved
      </div>
    </footer>
    <!-- End Footer -->

    <a
      href="#"
      class="back-to-top d-flex align-items-center justify-content-center"
      ><i class="bi bi-arrow-up-short"></i
    ></a>
  </div>

  <!-- Content when NOT authenticated (like the Login page) -->
  <div v-else>
    <router-view></router-view>
  </div>
</template>

<style>
/* Remove old custom classes as NiceAdmin handles it */
.sidebar-nav .nav-link.active {
  color: #4154f1;
  background: #f6f9ff;
}
.sidebar-nav .nav-link.active i {
  color: #4154f1;
}
</style>

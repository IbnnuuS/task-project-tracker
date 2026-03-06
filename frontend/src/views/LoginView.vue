<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMsg = ref("");
const errors = ref<Record<string, string[]>>({});

const handleLogin = async () => {
  loading.value = true;
  errorMsg.value = "";
  errors.value = {};

  try {
    await authStore.login({ email: email.value, password: password.value });
    router.push({ name: "dashboard" });
  } catch (err: any) {
    if (err.response?.status === 422) {
      errors.value = err.response.data.errors;
      errorMsg.value = err.response.data.message || "Validation Error";
    } else if (err.response?.status === 401) {
      errorMsg.value = "Invalid credentials. Please try again.";
    } else {
      errorMsg.value = "An unexpected error occurred. Please try again later.";
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <main>
    <div class="container">
      <section
        class="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4"
      >
        <div class="container">
          <div class="row justify-content-center">
            <div
              class="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center"
            >
              <div class="d-flex justify-content-center py-4">
                <a
                  href="#"
                  class="logo d-flex align-items-center w-auto text-decoration-none"
                >
                  <img src="/assets/img/logo.png" alt="" />
                  <span class="d-none d-lg-block">Tracker Admin</span>
                </a>
              </div>
              <!-- End Logo -->

              <div class="card mb-3">
                <div class="card-body">
                  <div class="pt-4 pb-2">
                    <h5 class="card-title text-center pb-0 fs-4">
                      Login to Your Account
                    </h5>
                    <p class="text-center small">
                      Enter your email & password to login
                    </p>
                  </div>

                  <!-- Error Alert -->
                  <div
                    v-if="errorMsg"
                    class="alert alert-danger alert-dismissible fade show"
                    role="alert"
                  >
                    <i class="bi bi-exclamation-octagon me-1"></i>
                    {{ errorMsg }}
                    <button
                      type="button"
                      class="btn-close"
                      @click="errorMsg = ''"
                      aria-label="Close"
                    ></button>
                  </div>

                  <form
                    @submit.prevent="handleLogin"
                    class="row g-3 needs-validation"
                    novalidate
                  >
                    <div class="col-12">
                      <label for="yourEmail" class="form-label">Email</label>
                      <div class="input-group has-validation">
                        <input
                          type="email"
                          name="email"
                          class="form-control"
                          id="yourEmail"
                          v-model="email"
                          required
                          placeholder="Masukkan Email"
                          :class="{ 'is-invalid': errors.email }"
                        />
                        <div
                          v-if="errors.email"
                          class="invalid-feedback d-block"
                        >
                          {{ errors.email[0] }}
                        </div>
                      </div>
                    </div>

                    <div class="col-12">
                      <label for="yourPassword" class="form-label"
                        >Password</label
                      >
                      <input
                        type="password"
                        name="password"
                        class="form-control"
                        id="yourPassword"
                        v-model="password"
                        required
                        placeholder="Masukkan Password"
                        :class="{ 'is-invalid': errors.password }"
                      />
                      <div
                        v-if="errors.password"
                        class="invalid-feedback d-block"
                      >
                        {{ errors.password[0] }}
                      </div>
                    </div>

                    <div class="col-12">
                      <button
                        class="btn btn-primary w-100"
                        type="submit"
                        :disabled="loading"
                      >
                        <span
                          v-if="loading"
                          class="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        <span v-if="loading"> Logging in...</span>
                        <span v-else>Login</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>

                <div class="credits">
                Designed by
                <a href="https://github.com/IbnnuuS" target="_blank"
                  >IbnnuuS</a
                >
                </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

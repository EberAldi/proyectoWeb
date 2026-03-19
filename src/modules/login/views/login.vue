<template>
  <main
    class="min-vh-100 d-flex align-items-center justify-content-center py-5 px-3"
    style="background: linear-gradient(135deg, #685aff, #9ccfff)"
  >
    <section class="w-100" style="max-width: 420px">
      <!-- Header -->
      <header class="text-center mb-4">
        <div
          class="mx-auto rounded-circle d-flex align-items-center justify-content-center shadow"
          style="background: #f0ffc3; width: 64px; height: 64px"
        >
          <font-awesome-icon icon="gamepad" class="fs-2" style="color: #685aff" />
        </div>
        <h1 class="mt-4 fw-bolder text-white fs-2">Renta de Consolas</h1>
        <h2 class="mt-1 fs-6 text-white text-opacity-75">Iniciar sesión</h2>
      </header>

      <!-- Card -->
      <article class="bg-white rounded-4 shadow-lg p-4 p-sm-5">
        <div class="mb-4">
          <label class="form-label text-secondary fw-medium">
            <font-awesome-icon icon="envelope" class="me-2" style="color: #685aff" />
            Correo electrónico
          </label>
          <input
            v-model="email"
            type="email"
            placeholder="usuario@consolas.com"
            class="form-control py-2"
            :disabled="authStore.isLoading"
            @keyup.enter="handleLogin"
          />
        </div>

        <div class="mb-4">
          <label class="form-label text-secondary fw-medium">
            <font-awesome-icon icon="lock" class="me-2" style="color: #685aff" />
            Contraseña
          </label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            class="form-control py-2"
            :disabled="authStore.isLoading"
            @keyup.enter="handleLogin"
          />
        </div>

        <div class="d-grid">
          <button
            class="btn text-white fw-semibold py-2 d-flex justify-content-center align-items-center gap-2 shadow"
            style="background: #685aff"
            :disabled="authStore.isLoading"
            @click="handleLogin"
          >
            <span
              v-if="authStore.isLoading"
              class="spinner-border spinner-border-sm"
              role="status"
            />
            <template v-else>
              <font-awesome-icon icon="sign-in-alt" />
              Ingresar
            </template>
          </button>
        </div>
      </article>

      <!-- Footer -->
      <footer class="text-center text-white mt-4">
        <small>&copy; 2026 Renta de Consolas</small>
      </footer>
    </section>
  </main>
</template>

<script>
import { useAuthStore } from '../store/authStore';
import { useRouter } from 'vue-router';

export default {
  name: 'LoginView',

  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    return { authStore, router }
  },

  data() {
    return {
      email: '',
      password: '',
    }
  },

  methods: {
    async handleLogin() {
      await this.authStore.login(this.email, this.password, this.router)
    },
  },
}
</script>

<style scoped>
article {
  animation: slideUp 0.4s ease-out;
}
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.btn:disabled {
  opacity: 0.75;
  cursor: not-allowed;
}

.btn:not(:disabled):hover {
  opacity: 0.9;
}
</style>
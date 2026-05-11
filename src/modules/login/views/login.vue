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

        <!-- Botón login normal -->
        <div class="d-grid mb-3">
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

        <!-- Separador -->
        <div class="d-flex align-items-center gap-2 mb-3">
          <hr class="grow m-0" />
          <span class="text-secondary small">o</span>
          <hr class="grow m-0" />
        </div>

        <!-- Botón Google -->
        <div class="d-grid">
          <button
            class="btn btn-outline-secondary fw-semibold py-2 d-flex justify-content-center align-items-center gap-2"
            :disabled="authStore.isLoading || authStore.isGoogleLoading"
            @click="handleGoogleLogin"
          >
            <span
              v-if="authStore.isGoogleLoading"
              class="spinner-border spinner-border-sm"
              role="status"
            />
            <template v-else>
              <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Continuar con Google
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

    async handleGoogleLogin() {
      await this.authStore.loginWithGoogle(this.router)
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

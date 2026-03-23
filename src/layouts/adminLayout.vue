<template>
  <div class="d-flex vh-100 overflow-hidden" style="background-color: #f8f8ff">
    <!-- SIDEBAR -->
    <aside
      :class="sidebarOpen ? 'sidebar-open' : 'sidebar-closed'"
      class="sidebar d-flex flex-column shadow z-2 position-relative"
      style="background-color: #685aff"
    >
      <!-- Sidebar Header -->
      <header class="d-flex align-items-center justify-content-between px-3 py-4 border-bottom border-white border-opacity-25">
        <div v-if="sidebarOpen" class="d-flex align-items-center gap-3">
          <div class="sidebar-logo bg-white rounded-3 d-flex align-items-center justify-content-center shadow">
            <font-awesome-icon icon="gamepad" class="small" style="color: #685aff" />
          </div>
          <div class="lh-sm">
            <p class="fw-black text-white small mb-0">RENTA</p>
            <p class="text-white text-opacity-50 mb-0" style="font-size: 0.7rem">CONSOLAS</p>
          </div>
        </div>
        <div v-else class="w-100 d-flex justify-content-center">
          <div class="sidebar-logo bg-white rounded-3 d-flex align-items-center justify-content-center shadow">
            <font-awesome-icon icon="gamepad" class="small" style="color: #685aff" />
          </div>
        </div>
      </header>

      <!-- Sidebar Nav -->
      <nav class="flex-grow-1 py-3 px-2 overflow-auto d-flex flex-column gap-1">
        <router-link
          v-for="item in menuItems"
          :key="item.to"
          :to="item.to"
          class="nav-item-link d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-decoration-none position-relative nav-group"
          :class="$route.path === item.to ? 'nav-active fw-semibold' : 'text-white text-opacity-75 nav-inactive'"
          :style="$route.path === item.to ? 'background-color: #F0FFC3;' : ''"
        >
          <font-awesome-icon :icon="item.icon" class="flex-shrink-0" style="width: 20px" />
          <span v-if="sidebarOpen" class="small text-truncate">{{ item.label }}</span>
          <!-- Tooltip collapsed -->
          <div
            v-if="!sidebarOpen"
            class="nav-tooltip position-absolute text-white small px-2 py-1 rounded-2 text-nowrap shadow"
            style="background-color: #685aff; border: 1px solid rgba(255,255,255,0.2); left: 56px; z-index: 50"
          >
            {{ item.label }}
          </div>
        </router-link>
      </nav>

      <!-- Sidebar Footer -->
      <footer class="p-2 border-top border-white border-opacity-25">
        <div
          v-if="sidebarOpen"
          class="d-flex align-items-center gap-3 px-2 py-2 mb-2 rounded-3"
          style="background-color: rgba(255,255,255,0.1)"
        >
          <div
            class="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
            style="background-color: #9ccfff; width: 32px; height: 32px"
          >
            <font-awesome-icon icon="user" class="small" style="color: #685aff" />
          </div>
          <div class="overflow-hidden">
            <p class="small fw-bold text-white text-truncate mb-0">
              {{ authStore.user?.nombre ?? 'Usuario' }}
            </p>
            <p class="text-white text-opacity-50 text-capitalize mb-0" style="font-size: 0.7rem">
              {{ authStore.user?.role ?? '' }}
            </p>
          </div>
        </div>
        <button
          @click="authStore.logout($router)"
          class="btn w-100 d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-white text-opacity-75 btn-logout"
        >
          <font-awesome-icon icon="sign-out-alt" class="flex-shrink-0" style="width: 20px" />
          <span v-if="sidebarOpen" class="small fw-medium">Cerrar Sesión</span>
        </button>
      </footer>
    </aside>

    <!-- MAIN CONTENT -->
    <!-- ✅ FIX 1: flex-1 → flex-grow-1 (flex-1 es Tailwind, no Bootstrap) -->
    <div class="flex-grow-1 d-flex flex-column overflow-hidden">
      <!-- Top Header -->
      <header class="bg-white shadow-sm px-4 py-3 d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center gap-3">
          <button
            @click="sidebarOpen = !sidebarOpen"
            class="btn btn-link p-0 text-decoration-none"
            style="color: #685aff"
          >
            <font-awesome-icon :icon="sidebarOpen ? 'times' : 'bars'" class="fs-5" />
          </button>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0 small">
              <li class="breadcrumb-item">
                <router-link to="/dashboard" class="text-decoration-none text-secondary">
                  Inicio
                </router-link>
              </li>
              <li v-if="$route.meta?.title" class="breadcrumb-item active fw-semibold" style="color: #685aff">
                {{ $route.meta.title }}
              </li>
            </ol>
          </nav>
        </div>
        <div class="d-flex align-items-center gap-3">
          <time
            :datetime="currentTime"
            class="small font-monospace text-secondary d-none d-md-block px-3 py-1 rounded-2 bg-light"
          >
            {{ currentTime }}
          </time>
          <div
            class="d-flex align-items-center gap-2 px-3 py-1 rounded-pill"
            style="background-color: #f0ffc3"
          >
            <div
              class="rounded-circle d-flex align-items-center justify-content-center"
              style="background-color: #685aff; width: 24px; height: 24px"
            >
              <font-awesome-icon icon="user" class="text-white" style="font-size: 0.65rem" />
            </div>
            <span class="small fw-semibold d-none d-md-block" style="color: #685aff">
              {{ authStore.user?.nombre ?? 'Usuario' }}
            </span>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <!-- ✅ FIX 1: flex-1 → flex-grow-1 -->
      <main class="flex-grow-1 overflow-auto p-4">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/modules/login/store/authStore'

export default {
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  data() {
    return {
      sidebarOpen: true,
      currentTime: '',
      menuItems: [
        { to: '/dashboard', icon: 'chart-bar', label: 'Dashboard' },
        { to: '/consolas', icon: 'gamepad', label: 'Consolas' },
        { to: '/games', icon:'compact-disc', label : 'Juegos'}
      ],
    }
  },
  mounted() {
    this.updateTime()
    this.timer = setInterval(this.updateTime, 1000)
  },
  beforeUnmount() {
    clearInterval(this.timer)
  },
  methods: {
    updateTime() {
      this.currentTime = new Date().toLocaleTimeString()
    },
  },
}
</script>

<!-- ✅ FIX 2: Un solo bloque <style scoped> (se eliminó el duplicado con valores distintos) -->
<style scoped>
.sidebar {
  transition: width 0.3s ease;
  overflow: hidden;
}
.sidebar-open  { width: 256px; }
.sidebar-closed { width: 64px; }

.sidebar-logo {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
}

.nav-active { color: #685aff !important; }
.nav-inactive:hover {
  color: #fff !important;
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.nav-group .nav-tooltip {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
  top: 50%;
  transform: translateY(-50%);
}
.nav-group:hover .nav-tooltip { opacity: 1; }

.btn-logout { transition: background-color 0.2s, color 0.2s; }
.btn-logout:hover {
  background-color: rgba(255, 91, 91, 0.8) !important;
  color: #fff !important;
  opacity: 1;
}
</style>
<template>
  <div class="flex h-screen overflow-hidden" style="background-color: #f8f8ff">
    <!-- SIDEBAR -->
    <aside
      :class="sidebarOpen ? 'w-64' : 'w-16'"
      class="flex flex-col transition-all duration-300 shadow-2xl z-20 relative"
      style="background-color: #685aff"
    >
      <header class="flex items-center justify-between px-4 py-5 border-b border-white/20">
        <div v-if="sidebarOpen" class="flex items-center gap-3">
          <div class="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow">
            <font-awesome-icon icon="gamepad" class="text-sm" style="color: #685aff" />
          </div>
          <div class="leading-tight">
            <p class="font-black text-white text-sm">RENTA</p>
            <p class="text-white/60 text-xs font-medium">CONSOLAS</p>
          </div>
        </div>
        <div v-else class="w-full flex justify-center">
          <div class="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow">
            <font-awesome-icon icon="gamepad" class="text-sm" style="color: #685aff" />
          </div>
        </div>
      </header>

      <nav class="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        <router-link
          v-for="item in menuItems"
          :key="item.to"
          :to="item.to"
          class="relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group"
          :class="
            $route.path === item.to
              ? 'text-[#685AFF] shadow-lg font-semibold'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          "
          :style="$route.path === item.to ? 'background-color: #F0FFC3;' : ''"
        >
          <font-awesome-icon :icon="item.icon" class="text-base w-5 flex-shrink-0" />
          <span v-if="sidebarOpen" class="text-sm truncate">{{ item.label }}</span>

          <div
            v-if="!sidebarOpen"
            class="absolute left-14 text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg text-white"
            style="background-color: #685aff; border: 1px solid rgba(255, 255, 255, 0.2)"
          >
            {{ item.label }}
          </div>
        </router-link>
      </nav>

      <footer class="p-3 border-t border-white/20">
        <div
          v-if="sidebarOpen"
          class="flex items-center gap-3 px-2 py-2 mb-2 rounded-xl bg-white/10"
        >
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style="background-color: #9ccfff"
          >
            <font-awesome-icon icon="user" class="text-xs" style="color: #685aff" />
          </div>
          <div class="overflow-hidden">
            <p class="text-sm font-bold text-white truncate">
              {{ authStore.user?.nombre ?? 'Usuario' }}
            </p>
            <p class="text-xs text-white/50 capitalize">{{ authStore.user?.role ?? '' }}</p>
          </div>
        </div>
        <button
          @click="authStore.logout($router)"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-white/70 hover:text-white hover:bg-[#FF5B5B]/80"
        >
          <font-awesome-icon icon="sign-out-alt" class="w-5 flex-shrink-0" />
          <span v-if="sidebarOpen" class="text-sm font-medium">Cerrar Sesión</span>
        </button>
      </footer>
    </aside>

    <div class="flex-1 flex flex-col overflow-hidden">
      <header class="bg-white shadow-sm px-6 py-4 flex items-center justify-between z-10">
        <div class="flex items-center gap-4">
          <button
            @click="sidebarOpen = !sidebarOpen"
            class="transition-colors hover:opacity-70"
            style="color: #685aff"
          >
            <font-awesome-icon :icon="sidebarOpen ? 'times' : 'bars'" class="text-xl" />
          </button>

          <nav aria-label="breadcrumb">
            <ol class="flex items-center gap-1 text-sm">
              <li>
                <router-link
                  to="/dashboard"
                  class="text-gray-400 hover:text-[#685AFF] transition-colors"
                >
                  Inicio
                </router-link>
              </li>
              <li v-if="$route.meta?.title" class="flex items-center gap-1">
                <span class="text-gray-300">/</span>
                <span class="font-semibold" style="color: #685aff">{{ $route.meta.title }}</span>
              </li>
            </ol>
          </nav>
        </div>

        <div class="flex items-center gap-4">
          <time
            :datetime="currentTime"
            class="text-sm font-mono text-gray-400 hidden md:block bg-gray-50 px-3 py-1 rounded-lg"
          >
            {{ currentTime }}
          </time>

          <div
            class="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style="background-color: #f0ffc3"
          >
            <div
              class="w-6 h-6 rounded-full flex items-center justify-center"
              style="background-color: #685aff"
            >
              <font-awesome-icon icon="user" class="text-white text-xs" />
            </div>
            <span class="text-sm font-semibold hidden md:block" style="color: #685aff">
              {{ authStore.user?.nombre ?? 'Usuario' }}
            </span>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/modules/login/store/authStore'

export default {
  name: 'LayoutMain',
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
        { to: '/rentas', icon: 'clock', label: 'Rentas' },
        { to: '/pos', icon: 'shopping-cart', label: 'Punto de Venta' },
        { to: '/usuarios', icon: 'user', label: 'Usuarios' },
        { to: '/productos', icon: 'tag', label: 'Productos' },
        { to: '/reportes', icon: 'chart-bar', label: 'Reportes' },
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
      this.currentTime = new Date().toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    },
  },
}
</script>

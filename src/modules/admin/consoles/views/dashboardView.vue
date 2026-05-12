<template>
  <div class="d-flex flex-column gap-4">

    <!-- HEADER -->
    <header class="d-flex align-items-center justify-content-between flex-wrap gap-2">
      <div>
        <h1 class="fw-black text-dark fs-4 mb-0">Dashboard</h1>
        <time class="small text-secondary text-capitalize">
          {{ fechaActual }}
        </time>
      </div>

      <div class="px-3 py-2 rounded-3 small fw-bold"
           style="background-color: #f0ffc3; color: #685aff">
        <font-awesome-icon icon="clock" class="me-2" />
        Turno activo
      </div>
    </header>

    <!-- STATS -->
    <section class="row g-3">
      <div class="col-6 col-lg-3" v-for="stat in stats" :key="stat.label">
        <article class="bg-white rounded-4 p-4 shadow-sm stat-card h-100"
          :style="{ borderBottom: '4px solid ' + stat.color }">

          <p class="fw-black text-dark fs-2 mb-0">{{ stat.value }}</p>
          <p class="small text-secondary fw-medium mb-0 mt-1">
            {{ stat.label }}
          </p>

        </article>
      </div>
    </section>

    <!-- MAIN -->
    <div class="row g-4">

      <!-- LEFT -->
      <section class="col-12 col-xl-8 d-flex flex-column gap-4">

        <!-- RENTAS ACTIVAS -->
        <article class="bg-white rounded-4 shadow-sm overflow-hidden">

          <header class="px-4 py-3 border-bottom">
            <h2 class="fw-black text-dark fs-6 mb-0">Rentas activas</h2>
          </header>

          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0 small">
              <thead class="table-light">
                <tr>
                  <th class="px-4">#</th>
                  <th>Consola</th>
                  <th>Inicio</th>
                  <th>Duración</th>
                  <th>Monto</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="renta in store.rentasActivas" :key="renta.id">
                  <td class="px-4 text-secondary">{{ renta.id }}</td>
                  <td class="fw-semibold">{{ renta.consola }}</td>
                  <td>{{ renta.inicio }}</td>
                  <td>
                    <span class="badge rounded-pill"
                          style="background:#f0ffc3;color:#685aff">
                      {{ renta.duracion }}
                    </span>
                  </td>
                  <td class="fw-bold" style="color:#685aff">
                    ${{ renta.monto }}
                  </td>
                </tr>
              </tbody>

            </table>
          </div>
        </article>

        <!-- INGRESOS -->
        <article class="rounded-4 p-4 text-white"
                 style="background:linear-gradient(135deg,#685aff,#9ccfff)">
          <p class="small text-uppercase fw-medium mb-1" style="opacity:.7">
            Ingresos del día
          </p>
          <p class="display-5 fw-black mb-0">
            {{ store.totalIngresos }}
          </p>
        </article>

      </section>

      <!-- RIGHT -->
      <aside class="col-12 col-xl-4 d-flex flex-column gap-3">

        <!-- VENTAS -->
        <article class="bg-white rounded-4 shadow-sm overflow-hidden">

          <header class="px-4 py-3 border-bottom">
            <h3 class="fw-black text-dark fs-6 mb-0">Últimas ventas</h3>
          </header>

          <ul class="list-group list-group-flush small">
            <li v-for="venta in store.ultimasVentas"
                :key="venta.id"
                class="list-group-item d-flex justify-content-between align-items-center px-4">

              <div>
                <p class="mb-0 fw-semibold">{{ venta.producto }}</p>
                <span class="text-secondary">x{{ venta.cantidad }}</span>
              </div>

              <span class="fw-bold" style="color:#685aff">
                ${{ venta.total }}
              </span>

            </li>
          </ul>

        </article>

        <!-- CLIMA -->
        <article class="rounded-4 shadow-sm overflow-hidden text-white"
                 style="background:linear-gradient(135deg,#685aff,#9ccfff)">

          <div class="p-4">

            <div v-if="weatherLoading" class="text-center py-2">
              <span class="spinner-border spinner-border-sm me-2" />
              Cargando clima...
            </div>

            <div v-else-if="weatherError" class="text-center small">
              Error al obtener clima
            </div>

            <div v-else-if="weather">
              <div class="d-flex justify-content-between">
                <div>
                  <p class="small mb-0">{{ weather.name }}</p>
                  <p class="display-6 fw-black mb-0">
                    {{ Math.round(weather.main.temp) }}°C
                  </p>
                  <p class="small text-capitalize">
                    {{ weather.weather[0].description }}
                  </p>
                </div>

                <img :src="`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`" width="64"/>
              </div>
            </div>

          </div>

        </article>

        <!-- ACCIONES -->
        <nav class="bg-white rounded-4 shadow-sm p-3 d-flex flex-column gap-2">

          <p class="text-secondary fw-black small text-uppercase mb-1">
            Acciones rápidas
          </p>

          <button class="btn text-white fw-bold"
                  style="background:#685aff"
                  @click="$router.push('/consolas')">
            <font-awesome-icon icon="gamepad" class="me-2" />
            Nueva renta
          </button>

          <!-- 🔥 ESTE ES EL IMPORTANTE -->
          <button class="btn fw-bold"
                  style="background:#9ccfff;color:#685aff"
                  @click="abrirPOS">
            <font-awesome-icon icon="cash-register" class="me-2" />
            Abrir POS
          </button>

        </nav>

      </aside>
    </div>

    <!-- 🔥 MODAL POS -->
    <PosModal v-if="pos.modalAbierto" />

  </div>
</template>

<script>
import { useDashboardStore } from '../stores/dashboardStore'
import { usePosStore } from '../../pos/stores/posStoreSimple'
import PosModal from '../../pos/components/posSimple.vue'
import { computed } from 'vue'

export default {
  name: 'DashboardView',

  components: { PosModal },

  setup() {
    const store = useDashboardStore()
    const pos = usePosStore()

    const stats = computed(() => [
      { label: 'Consolas activas', value: store.stats.consolasActivas, color: '#685aff' },
      { label: 'Rentas hoy', value: store.stats.rentasHoy, color: '#22c55e' },
      { label: 'Clientes hoy', value: store.stats.clientesHoy, color: '#60a5fa' },
      { label: 'Productos vendidos', value: store.stats.productosVendidos, color: '#ef4444' },
    ])

    const abrirPOS = () => {
      // aquí puedes mandar una consola dummy o seleccionar una real
      pos.abrirVenta({
        id: 1,
        nombre: 'Caja Principal',
        precioPorHora: 50
      })
    }

    return {
      store,
      pos,
      stats,
      abrirPOS
    }
  },

  data() {
    return {
      weather: null,
      weatherLoading: false,
      weatherError: false,
    }
  },

  computed: {
    fechaActual() {
      return new Date().toLocaleDateString('es-MX', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    },
  },

  mounted() {
    this.store.cargarDashboard()
    this.obtenerClima()
  },

  methods: {
    async obtenerClima() {
      this.weatherLoading = true
      this.weatherError = false

      try {
        const pos = await new Promise((res, rej) =>
          navigator.geolocation.getCurrentPosition(res, rej)
        )

        const { latitude, longitude } = pos.coords
        const apiKey = import.meta.env.VITE_WEATHER_API_KEY

        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=es`
        )

        this.weather = await res.json()
      } catch {
        this.weatherError = true
      } finally {
        this.weatherLoading = false
      }
    },
  },
}
</script>

<style scoped>
.stat-card:hover {
  transform: translateY(-2px);
  transition: 0.2s;
}
</style>
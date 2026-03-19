<template>
  <div class="d-flex flex-column gap-4">
    <!-- Header -->
    <header class="d-flex align-items-center justify-content-between flex-wrap gap-2">
      <div>
        <h1 class="fw-black text-dark fs-4 mb-0">Dashboard</h1>
        <time class="small text-secondary text-capitalize">{{ fechaActual }}</time>
      </div>
      <div class="px-3 py-2 rounded-3 small fw-bold" style="background-color: #f0ffc3; color: #685aff">
        <font-awesome-icon icon="clock" class="me-2" />
        Turno activo
      </div>
    </header>

    <!-- Stats -->
    <section class="row g-3">
      <div class="col-6 col-lg-3" v-for="stat in stats" :key="stat.label">
        <article
          class="bg-white rounded-4 p-4 shadow-sm stat-card h-100"
          :style="{ borderBottom: '4px solid ' + stat.color }"
        >
          <p class="fw-black text-dark fs-2 mb-0">{{ stat.value }}</p>
          <p class="small text-secondary fw-medium mb-0 mt-1">{{ stat.label }}</p>
        </article>
      </div>
    </section>

    <!-- Layout principal -->
    <div class="row g-4">

      <!-- Columna principal -->
      <section class="col-12 col-xl-8 d-flex flex-column gap-4">
        <!-- Rentas activas -->
        <article class="bg-white rounded-4 shadow-sm overflow-hidden">
          <header class="px-4 py-3 border-bottom">
            <h2 class="fw-black text-dark fs-6 mb-0">Rentas activas</h2>
          </header>
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0 small">
              <thead class="table-light">
                <tr>
                  <th class="px-4 text-secondary fw-semibold">#</th>
                  <th class="text-secondary fw-semibold">Consola</th>
                  <th class="text-secondary fw-semibold">Cliente</th>
                  <th class="text-secondary fw-semibold">Inicio</th>
                  <th class="text-secondary fw-semibold">Duración</th>
                  <th class="text-secondary fw-semibold">Monto</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="renta in store.rentasActivas" :key="renta.id">
                  <td class="px-4 text-secondary">{{ renta.id }}</td>
                  <td class="fw-semibold text-dark">{{ renta.consola }}</td>
                  <td>{{ renta.cliente }}</td>
                  <td>{{ renta.inicio }}</td>
                  <td>
                    <span class="badge rounded-pill" style="background-color: #f0ffc3; color: #685aff">
                      {{ renta.duracion }}
                    </span>
                  </td>
                  <td class="fw-bold" style="color: #685aff">${{ renta.monto }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        <!-- Ingresos -->
        <article
          class="rounded-4 p-4 text-white"
          style="background: linear-gradient(135deg, #685aff, #9ccfff)"
        >
          <p class="small text-uppercase fw-medium mb-1" style="opacity: 0.7">
            Ingresos del día
          </p>
          <p class="display-5 fw-black mb-0">{{ store.totalIngresos }}</p>
        </article>
      </section>

      <!-- Aside -->
      <aside class="col-12 col-xl-4 d-flex flex-column gap-3">

        <!-- Ventas -->
        <article class="bg-white rounded-4 shadow-sm overflow-hidden">
          <header class="px-4 py-3 border-bottom">
            <h3 class="fw-black text-dark fs-6 mb-0">Últimas ventas</h3>
          </header>
          <ul class="list-group list-group-flush small">
            <li
              v-for="venta in store.ultimasVentas"
              :key="venta.id"
              class="list-group-item d-flex justify-content-between align-items-center px-4"
            >
              <div>
                <p class="mb-0 fw-semibold text-dark">{{ venta.producto }}</p>
                <span class="text-secondary">x{{ venta.cantidad }}</span>
              </div>
              <span class="fw-bold" style="color: #685aff">${{ venta.total }}</span>
            </li>
          </ul>
        </article>

        <!-- Alertas -->
        <article class="bg-white rounded-4 shadow-sm overflow-hidden">
          <header class="px-4 py-3 border-bottom">
            <h3 class="fw-black text-dark fs-6 mb-0">Alertas</h3>
          </header>
          <div class="d-flex flex-column gap-2 p-3">
            <div
              v-for="alerta in store.alertas"
              :key="alerta.id"
              class="alert mb-0 small py-2 px-3"
              :class="`alert-${alerta.tipo}`"
            >
              {{ alerta.mensaje }}
            </div>
          </div>
        </article>

        <!-- Acciones -->
        <nav class="bg-white rounded-4 shadow-sm p-3 d-flex flex-column gap-2">
          <p class="text-secondary fw-black small text-uppercase mb-1" style="letter-spacing: 0.05em">
            Acciones rápidas
          </p>
          <button
            class="btn w-100 py-2 fw-bold small text-white"
            style="background-color: #685aff"
            @click="$router.push('/consolas')"
          >
            <font-awesome-icon icon="gamepad" class="me-2" />
            Nueva renta
          </button>
          <button
            class="btn w-100 py-2 fw-bold small"
            style="background-color: #9ccfff; color: #685aff"
            @click="$router.push('/pos')"
          >
            <font-awesome-icon icon="cash-register" class="me-2" />
            Abrir POS
          </button>
          <button
            class="btn w-100 py-2 fw-bold small"
            style="background-color: #f0ffc3; color: #685aff"
          >
            <font-awesome-icon icon="file-alt" class="me-2" />
            Reporte del día
          </button>
        </nav>
      </aside>
    </div>
  </div>
</template>

<script>
import { useDashboardStore } from '../stores/dashboardStore'
import { usePosStore } from '../stores/posStore'         // ← nuevo

export default {
  name: 'DashboardView',

  setup() {
    const store = useDashboardStore()
    const pos   = usePosStore()                          // ← nuevo

    return {
      store,
      pos,                                               // ← nuevo
      stats: [
        { label: 'Consolas activas',    value: store.stats.consolasActivas,    color: '#685aff' },
        { label: 'Rentas hoy',          value: store.stats.rentasHoy,          color: '#22c55e' },
        { label: 'Clientes hoy',        value: store.stats.clientesHoy,        color: '#60a5fa' },
        { label: 'Productos vendidos',  value: store.stats.productosVendidos,  color: '#ef4444' },
      ],
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
}
</script>

<style scoped>
.stat-card:hover {
  transform: translateY(-2px);
  transition: 0.2s;
}
</style>
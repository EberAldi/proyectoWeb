<template>
  <div class="d-flex flex-column gap-4">
    <!-- Header -->
    <header class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
      <div>
        <h1 class="fw-black text-dark fs-4 mb-0 d-flex align-items-center gap-3">
          <div
            class="rounded-3 d-flex align-items-center justify-content-center shadow"
            :style="{ background: '#685aff', width: '40px', height: '40px', flexShrink: 0 }"
          >
            <font-awesome-icon icon="gamepad" class="text-white small" />
          </div>
          Consolas
        </h1>
        <p class="text-secondary small mt-1 mb-0">Estado actual del inventario</p>
      </div>
      <!-- Filtros -->
      <nav class="d-flex gap-2 flex-wrap">
        <button
          v-for="filtro in filtros"
          :key="filtro.value"
          class="btn btn-sm fw-semibold rounded-3"
          :class="store.filtroActivo === filtro.value ? 'text-white' : 'btn-outline-secondary'"
          :style="store.filtroActivo === filtro.value
            ? { backgroundColor: filtro.color, borderColor: filtro.color }
            : { borderColor: filtro.color, color: filtro.color }"
          @click="store.setFiltro(filtro.value)"
        >
          {{ filtro.label }}
        </button>
      </nav>
    </header>

    <!-- Layout -->
    <div class="row g-4">
      <!-- Grid consolas -->
      <section class="col-12 col-xl-9">
        <div class="row g-3">
          <div
            v-for="consola in store.consolasFiltradas"
            :key="consola.id"
            class="col-12 col-sm-6 col-lg-4"
          >
            <article class="bg-white rounded-4 shadow-sm overflow-hidden h-100 card-consola">
              <div
                style="height: 5px"
                :style="{ backgroundColor: store.colorEstado(consola.estado).barra }"
              ></div>
              <div class="p-4">
                <header class="d-flex align-items-start justify-content-between mb-3">
                  <div class="d-flex align-items-center gap-3">
                    <div
                      class="rounded-3 d-flex align-items-center justify-content-center"
                      :style="{
                        backgroundColor: store.colorEstado(consola.estado).bg,
                        width: '48px',
                        height: '48px',
                        flexShrink: 0,
                      }"
                    >
                      <font-awesome-icon
                        icon="gamepad"
                        :style="{ color: store.colorEstado(consola.estado).text }"
                      />
                    </div>
                    <div>
                      <h3 class="fw-black text-dark small mb-0">{{ consola.nombre }}</h3>
                      <p class="text-secondary mb-0" style="font-size: 0.7rem">{{ consola.marca }}</p>
                    </div>
                  </div>
                  <span
                    class="badge rounded-pill small fw-bold text-capitalize"
                    :style="{
                      backgroundColor: store.colorEstado(consola.estado).bg,
                      color: store.colorEstado(consola.estado).text,
                    }"
                  >
                    {{ consola.estado }}
                  </span>
                </header>

                <section class="d-flex flex-column gap-2 mb-3 small">
                  <div class="d-flex justify-content-between">
                    <span class="text-secondary">Controles</span>
                    <span class="fw-semibold text-dark">{{ consola.controles }} disponibles</span>
                  </div>
                  <div class="d-flex justify-content-between">
                    <span class="text-secondary">Precio/hora</span>
                    <span class="fw-black" style="color: #685aff">${{ consola.precioPorHora }}</span>
                  </div>
                  <div class="progress mt-1" style="height: 6px">
                    <div
                      class="progress-bar"
                      :style="{
                        width: Math.min((consola.usoHoy / 240) * 100, 100) + '%',
                        backgroundColor: store.colorEstado(consola.estado).barra,
                      }"
                    ></div>
                  </div>
                </section>

                <footer class="d-flex gap-2 pt-3 border-top">
                  <button
                    class="btn btn-sm flex-grow-1 fw-bold text-white"
                    style="background-color: #685aff"
                    :disabled="consola.estado !== 'disponible'"
                    @click="pos.abrirVenta(consola)"
                  >
                    Rentar
                  </button>
                  <button
                    class="btn btn-sm fw-semibold px-3"
                    style="background-color: #dbeafe; color: #685aff"
                  >
                    <font-awesome-icon icon="eye" />
                  </button>
                </footer>
              </div>
            </article>
          </div>

          <div v-if="store.consolasFiltradas.length === 0" class="col-12">
            <div class="bg-white rounded-4 shadow-sm p-5 text-center text-secondary small">
              No hay consolas en este estado
            </div>
          </div>
        </div>
      </section>

      <!-- Aside -->
      <aside class="col-12 col-xl-3 d-flex flex-column gap-3">
        <article class="bg-white rounded-4 shadow-sm p-4" style="border-top: 4px solid #685aff">
          <header class="mb-3">
            <h3 class="fw-black text-dark fs-6 mb-0">Resumen</h3>
            <p class="text-secondary mb-0" style="font-size: 0.7rem">Estado actual</p>
          </header>
          <div class="d-flex flex-column gap-2">
            <div class="d-flex align-items-center justify-content-between p-3 rounded-3 bg-light">
              <span class="small fw-semibold text-dark">Disponibles</span>
              <span class="fw-black fs-5 text-success">{{ store.resumen.disponibles }}</span>
            </div>
            <div class="d-flex align-items-center justify-content-between p-3 rounded-3 bg-light">
              <span class="small fw-semibold text-dark">Ocupadas</span>
              <span class="fw-black fs-5 text-danger">{{ store.resumen.ocupadas }}</span>
            </div>
            <div class="d-flex align-items-center justify-content-between p-3 rounded-3 bg-light">
              <span class="small fw-semibold text-dark">Mantenimiento</span>
              <span class="fw-black fs-5 text-warning">{{ store.resumen.mantenimiento }}</span>
            </div>
          </div>
        </article>

        <article
          class="rounded-4 p-4 text-white"
          style="background: linear-gradient(135deg, #685aff, #9ccfff)"
        >
          <p
            class="small text-uppercase fw-medium mb-1"
            style="color: rgba(255,255,255,0.7); letter-spacing: 0.05em"
          >
            Ingresos estimados hoy
          </p>
          <p class="fs-3 fw-black mb-0">{{ store.ingresosEstimados }}</p>
        </article>
      </aside>
    </div>
     <pos-modal />
  </div>

 
</template>

<script>
import { useConsolasStore } from '../stores/consolasStore'
import { usePosStore } from '../stores/posStore'
import PosModal from '../components/posModal.vue'

export default {
  name: 'ConsolasView',

  components: {
    PosModal,               // ← registrar el componente aquí
  },

  setup() {
    const store = useConsolasStore()
    const pos = usePosStore()
    return { store, pos }
  },

  data() {
    return {
      filtros: [
        { label: 'Todas',         value: 'todas',         color: '#685aff' },
        { label: 'Disponibles',   value: 'disponible',    color: '#22c55e' },
        { label: 'Ocupadas',      value: 'ocupada',       color: '#ef4444' },
        { label: 'Mantenimiento', value: 'mantenimiento', color: '#eab308' },
      ],
    }
  },
}
</script>

<style scoped>
.card-consola {
  transition: transform 0.2s, box-shadow 0.2s;
  border: 2px solid transparent;
}
.card-consola:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(104, 90, 255, 0.15) !important;
  border-color: #685aff33;
}
</style>
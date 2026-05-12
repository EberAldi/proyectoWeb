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
            <font-awesome-icon icon="compact-disc" class="text-white small" />
          </div>
          Juegos
        </h1>
        <p class="text-secondary small mt-1 mb-0">Catálogo de juegos para renta</p>
      </div>

      <div class="d-flex align-items-center gap-2 flex-wrap">
        <nav class="d-flex gap-2 flex-wrap">
          <button
            v-for="f in filtros"
            :key="f.value"
            class="btn btn-sm fw-semibold rounded-3"
            :class="store.filtroActivo === f.value ? 'text-white' : 'btn-outline-secondary'"
            :style="
              store.filtroActivo === f.value
                ? { backgroundColor: f.color, borderColor: f.color }
                : { borderColor: f.color, color: f.color }
            "
            @click="store.setFiltro(f.value)"
          >
            {{ f.label }}
          </button>
        </nav>

        <button
          class="btn btn-sm fw-bold text-white rounded-3 d-flex align-items-center gap-2"
          style="background-color: #685aff"
          @click="store.abrirModal()"
        >
          <font-awesome-icon icon="plus" />
          Agregar juego
        </button>
      </div>
    </header>

    <!-- Layout principal -->
    <div class="row g-4">

      <!-- Grid de juegos -->
      <section class="col-12 col-xl-9">

        <!-- Skeleton loading -->
        <div v-if="store.isLoading" class="row g-3">
          <div v-for="n in 6" :key="n" class="col-12 col-sm-6 col-lg-4">
            <div class="bg-white rounded-4 shadow-sm p-4" style="height: 210px">
              <div class="skeleton" style="height: 12px; width: 60%; margin-bottom: 12px; border-radius: 6px" />
              <div class="skeleton" style="height: 10px; width: 40%; margin-bottom: 20px; border-radius: 6px" />
              <div class="skeleton" style="height: 10px; width: 80%; margin-bottom: 8px; border-radius: 6px" />
              <div class="skeleton" style="height: 10px; width: 55%; border-radius: 6px" />
            </div>
          </div>
        </div>

        <transition-group v-else tag="div" class="row g-3" name="card-list">
          <div
            v-for="juego in store.juegosFiltrados"
            :key="juego.id"
            class="col-12 col-sm-6 col-lg-4"
          >
            <article class="bg-white rounded-4 shadow-sm overflow-hidden h-100 card-juego">
              <div
                style="height: 5px"
                :style="{ backgroundColor: juego.disponible ? '#22c55e' : '#ef4444' }"
              />
              <div class="p-4">
                <header class="d-flex align-items-start justify-content-between mb-3">
                  <div class="d-flex align-items-center gap-3">
                    <div
                      class="rounded-3 d-flex align-items-center justify-content-center"
                      :style="{
                        backgroundColor: juego.disponible ? '#dcfce7' : '#fee2e2',
                        width: '48px',
                        height: '48px',
                        flexShrink: 0,
                      }"
                    >
                      <font-awesome-icon
                        :icon="iconoConsola(juego.consola)"
                        :style="{ color: juego.disponible ? '#16a34a' : '#dc2626' }"
                      />
                    </div>
                    <div>
                      <h3 class="fw-black text-dark small mb-0 lh-sm">{{ juego.nombre }}</h3>
                      <p class="text-secondary mb-0" style="font-size: 0.7rem">{{ juego.consola }}</p>
                    </div>
                  </div>
                  <span
                    class="badge rounded-pill small fw-bold text-capitalize"
                    :style="{
                      backgroundColor: juego.disponible ? '#dcfce7' : '#fee2e2',
                      color: juego.disponible ? '#16a34a' : '#dc2626',
                    }"
                  >
                    {{ juego.disponible ? 'Disponible' : 'Ocupado' }}
                  </span>
                </header>

                <section class="d-flex flex-column gap-2 mb-3 small">
                  <div class="d-flex justify-content-between">
                    <span class="text-secondary">Género</span>
                    <span class="fw-semibold text-dark text-capitalize">{{ juego.genero }}</span>
                  </div>
                  <div class="d-flex justify-content-between">
                    <span class="text-secondary">Rentas hoy</span>
                    <span class="fw-semibold text-dark">{{ juego.rentasHoy }}</span>
                  </div>
                  <div class="progress mt-1" style="height: 6px">
                    <div
                      class="progress-bar"
                      :style="{
                        width: Math.min((juego.rentasHoy / 10) * 100, 100) + '%',
                        backgroundColor: juego.disponible ? '#685aff' : '#ef4444',
                      }"
                    />
                  </div>
                </section>

                <footer class="d-flex gap-2 pt-3 border-top">
                  <button
                    class="btn btn-sm fw-semibold px-3 rounded-3"
                    :title="juego.disponible ? 'Marcar como ocupado' : 'Marcar como disponible'"
                    :style="{
                      backgroundColor: juego.disponible ? '#fee2e2' : '#dcfce7',
                      color: juego.disponible ? '#dc2626' : '#16a34a',
                    }"
                    @click="store.toggleDisponibilidad(juego.id)"
                  >
                    <font-awesome-icon :icon="juego.disponible ? 'toggle-on' : 'toggle-off'" />
                  </button>

                  <button
                    class="btn btn-sm fw-semibold px-3 rounded-3"
                    style="background-color: #fff1f1; color: #ef4444"
                    title="Eliminar juego"
                    @click="confirmarEliminar(juego)"
                  >
                    <font-awesome-icon icon="trash" />
                  </button>
                </footer>
              </div>
            </article>
          </div>
        </transition-group>

        <!-- Estado vacío -->
        <div
          v-if="!store.isLoading && store.juegosFiltrados.length === 0"
          class="bg-white rounded-4 shadow-sm p-5 text-center"
        >
          <div
            class="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center"
            style="width: 60px; height: 60px; background-color: #f1efff"
          >
            <font-awesome-icon icon="compact-disc" style="color: #685aff; font-size: 1.5rem" />
          </div>
          <p class="text-secondary small mb-1 fw-semibold">Sin juegos en este filtro</p>
          <p class="text-secondary mb-3" style="font-size: 0.75rem">
            Agrega un nuevo juego o cambia el filtro activo
          </p>
          <button
            class="btn btn-sm fw-bold text-white rounded-3"
            style="background-color: #685aff"
            @click="store.abrirModal()"
          >
            <font-awesome-icon icon="plus" class="me-1" />
            Agregar juego
          </button>
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
              <span class="small fw-semibold text-dark">Total juegos</span>
              <span class="fw-black fs-5" style="color: #685aff">{{ store.resumen.total }}</span>
            </div>
            <div class="d-flex align-items-center justify-content-between p-3 rounded-3 bg-light">
              <span class="small fw-semibold text-dark">Disponibles</span>
              <span class="fw-black fs-5 text-success">{{ store.resumen.disponibles }}</span>
            </div>
            <div class="d-flex align-items-center justify-content-between p-3 rounded-3 bg-light">
              <span class="small fw-semibold text-dark">Ocupados</span>
              <span class="fw-black fs-5 text-danger">{{ store.resumen.ocupados }}</span>
            </div>
          </div>
        </article>

        <article class="bg-white rounded-4 shadow-sm p-4">
          <header class="mb-3">
            <h3 class="fw-black text-dark fs-6 mb-0">Por consola</h3>
            <p class="text-secondary mb-0" style="font-size: 0.7rem">Distribución actual</p>
          </header>
          <div class="d-flex flex-column gap-2">
            <div
              v-for="(cantidad, consola) in porConsola"
              :key="consola"
              class="d-flex align-items-center justify-content-between"
            >
              <span class="small text-secondary text-truncate me-2">{{ consola }}</span>
              <span
                class="badge rounded-pill fw-bold"
                style="background-color: #f1efff; color: #685aff; min-width: 28px"
              >
                {{ cantidad }}
              </span>
            </div>
            <p v-if="Object.keys(porConsola).length === 0" class="text-secondary small mb-0">
              Sin datos
            </p>
          </div>
        </article>
      </aside>
    </div>

    <!-- Modal agregar -->
    <modal-games />

    <!-- Modal confirmar eliminar -->
    <teleport to="body">
      <transition name="fade">
        <div
          v-if="juegoAEliminar"
          class="modal-backdrop-custom"
          @click.self="juegoAEliminar = null"
        >
          <div class="bg-white rounded-4 shadow-lg p-4" style="max-width: 360px; width: 100%">
            <div class="text-center mb-3">
              <div
                class="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center"
                style="width: 56px; height: 56px; background-color: #fee2e2"
              >
                <font-awesome-icon icon="trash" style="color: #dc2626; font-size: 1.25rem" />
              </div>
              <h5 class="fw-black text-dark mb-1">¿Eliminar juego?</h5>
              <p class="text-secondary small mb-0">
                <strong>{{ juegoAEliminar?.nombre }}</strong> será eliminado del catálogo.
                Esta acción no se puede deshacer.
              </p>
            </div>
            <div class="d-flex gap-2">
              <button
                class="btn btn-sm fw-semibold flex-grow-1 rounded-3"
                style="background-color: #f1f0ff; color: #685aff"
                @click="juegoAEliminar = null"
              >
                Cancelar
              </button>
              <button
                class="btn btn-sm fw-bold text-white flex-grow-1 rounded-3"
                style="background-color: #ef4444"
                @click="eliminar()"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useJuegosStore } from '../store/games'
import modalGames from '../components/modalGames.vue'

export default {
  name: 'JuegosView',

  components: { modalGames },

  setup() {
    const store = useJuegosStore()
    onMounted(() => store.fetchJuegos())
    return { store }
  },

  data() {
    return {
      juegoAEliminar: null,
      filtros: [
        { label: 'Todos',       value: 'todos',      color: '#685aff' },
        { label: 'Disponibles', value: 'disponible', color: '#22c55e' },
        { label: 'Ocupados',    value: 'ocupado',    color: '#ef4444' },
      ],
    }
  },

  computed: {
    porConsola() {
      return this.store.juegos.reduce((acc, j) => {
        acc[j.consola] = (acc[j.consola] ?? 0) + 1
        return acc
      }, {})
    },
  },

  methods: {
    iconoConsola(consola) {
      const mapa = {
        'PlayStation 5': ['fab', 'playstation'],
        'PlayStation 4': ['fab', 'playstation'],
        'Xbox Series X': ['fab', 'xbox'],
        'Xbox One':      ['fab', 'xbox'],
        'Nintendo Switch': 'gamepad',
        PC: 'desktop',
      }
      return mapa[consola] ?? 'gamepad'
    },

    confirmarEliminar(juego) {
      this.juegoAEliminar = juego
    },

    eliminar() {
      if (this.juegoAEliminar) {
        this.store.eliminarJuego(this.juegoAEliminar.id)
        this.juegoAEliminar = null
      }
    },
  },
}
</script>

<style scoped>
.card-juego {
  transition: transform 0.2s, box-shadow 0.2s;
  border: 2px solid transparent;
}
.card-juego:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(104, 90, 255, 0.15) !important;
  border-color: #685aff33;
}
.card-list-enter-active,
.card-list-leave-active { transition: all 0.3s ease; }
.card-list-enter-from,
.card-list-leave-to { opacity: 0; transform: translateY(12px); }

.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  background: rgba(15, 10, 40, 0.55);
  backdrop-filter: blur(4px);
  z-index: 1060;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
<template>
  <!-- Backdrop -->
  <teleport to="body">
    <transition name="fade">
      <div
        v-if="store.modalAbierto"
        class="modal-backdrop-custom"
        @click.self="store.cerrarModal()"
      >
        <!-- Panel -->
        <transition name="slide-up">
          <div v-if="store.modalAbierto" class="modal-panel rounded-4 shadow-lg bg-white overflow-hidden">

            <!-- Header con degradado -->
            <header
              class="px-4 py-4 d-flex align-items-center justify-content-between"
              style="background: linear-gradient(135deg, #685aff, #9ccfff)"
            >
              <div class="d-flex align-items-center gap-3">
                <div
                  class="rounded-3 d-flex align-items-center justify-content-center"
                  style="background: rgba(255,255,255,0.2); width: 40px; height: 40px"
                >
                  <font-awesome-icon icon="plus" class="text-white" />
                </div>
                <div>
                  <h2 class="text-white fw-black mb-0 fs-5">Agregar juego</h2>
                  <p class="mb-0 small" style="color: rgba(255,255,255,0.75)">
                    Completa los datos del juego
                  </p>
                </div>
              </div>
              <button
                class="btn-close btn-close-white"
                @click="store.cerrarModal()"
                aria-label="Cerrar"
              />
            </header>

            <!-- Body -->
            <div class="px-4 py-4 d-flex flex-column gap-3">

              <!-- Nombre -->
              <div>
                <label class="form-label small fw-bold text-dark mb-1">
                  Nombre del juego <span class="text-danger">*</span>
                </label>
                <input
                  v-model="form.nombre"
                  type="text"
                  class="form-control rounded-3"
                  :class="{ 'is-invalid': errores.nombre }"
                  placeholder="Ej. Spider-Man 2"
                  style="border-color: #e2e8f0"
                />
                <div v-if="errores.nombre" class="invalid-feedback">
                  {{ errores.nombre }}
                </div>
              </div>

              <!-- Consola + Género -->
              <div class="row g-3">
                <div class="col-6">
                  <label class="form-label small fw-bold text-dark mb-1">
                    Consola <span class="text-danger">*</span>
                  </label>
                  <select
                    v-model="form.consola"
                    class="form-select rounded-3"
                    :class="{ 'is-invalid': errores.consola }"
                    style="border-color: #e2e8f0"
                  >
                    <option value="" disabled>Seleccionar…</option>
                    <option v-for="c in store.consolas" :key="c" :value="c">{{ c }}</option>
                  </select>
                  <div v-if="errores.consola" class="invalid-feedback">
                    {{ errores.consola }}
                  </div>
                </div>

                <div class="col-6">
                  <label class="form-label small fw-bold text-dark mb-1">
                    Género <span class="text-danger">*</span>
                  </label>
                  <select
                    v-model="form.genero"
                    class="form-select rounded-3"
                    :class="{ 'is-invalid': errores.genero }"
                    style="border-color: #e2e8f0"
                  >
                    <option value="" disabled>Seleccionar…</option>
                    <option v-for="g in store.generos" :key="g" :value="g">{{ g }}</option>
                  </select>
                  <div v-if="errores.genero" class="invalid-feedback">
                    {{ errores.genero }}
                  </div>
                </div>
              </div>

             

              <!-- Disponibilidad toggle -->
              <div
                class="d-flex align-items-center justify-content-between p-3 rounded-3"
                style="background-color: #f8f7ff; border: 1.5px solid #e2e8f0"
              >
                <div>
                  <p class="small fw-bold text-dark mb-0">Disponible para renta</p>
                  <p class="text-secondary mb-0" style="font-size: 0.7rem">
                    El juego aparecerá como disponible desde el inicio
                  </p>
                </div>
                <div class="form-check form-switch mb-0">
                  <input
                    v-model="form.disponible"
                    class="form-check-input"
                    type="checkbox"
                    role="switch"
                    style="width: 2.5rem; height: 1.3rem; cursor: pointer"
                    :style="form.disponible ? { backgroundColor: '#685aff', borderColor: '#685aff' } : {}"
                  />
                </div>
              </div>

              <!-- Error general -->
              <div
                v-if="errorGeneral"
                class="alert alert-danger small rounded-3 py-2 mb-0"
              >
                {{ errorGeneral }}
              </div>
            </div>

            <!-- Footer -->
            <footer
              class="px-4 py-3 d-flex justify-content-end gap-2"
              style="border-top: 1px solid #f1f0ff"
            >
              <button
                class="btn btn-sm fw-semibold rounded-3 px-4"
                style="background-color: #f1f0ff; color: #685aff"
                @click="store.cerrarModal()"
              >
                Cancelar
              </button>
              <button
                class="btn btn-sm fw-black text-white rounded-3 px-4"
                style="background-color: #685aff"
                :disabled="guardando"
                @click="guardar()"
              >
                <span v-if="guardando" class="spinner-border spinner-border-sm me-1" />
                <font-awesome-icon v-else icon="plus" class="me-1" />
                Agregar juego
              </button>
            </footer>

          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { useJuegosStore } from '../store/games';

const formInicial = () => ({
  nombre: '',
  consola: '',
  genero: '',
  precioPorHora: null,
  disponible: true,
})

export default {
  name: 'modalGames',

  setup() {
    const store = useJuegosStore()
    return { store }
  },

  data() {
    return {
      form: formInicial(),
      errores: {},
      errorGeneral: '',
      guardando: false,
    }
  },

  watch: {
    // Limpia el form cuando el modal se abre
    'store.modalAbierto'(val) {
      if (val) {
        this.form = formInicial()
        this.errores = {}
        this.errorGeneral = ''
      }
    },
  },

  methods: {
    validar() {
      const e = {}
      if (!this.form.nombre.trim()) e.nombre = 'El nombre es obligatorio.'
      if (!this.form.consola) e.consola = 'Selecciona una consola.'
      if (!this.form.genero) e.genero = 'Selecciona un género.'
      if (!this.form.precioPorHora || this.form.precioPorHora < 1)
        e.precioPorHora = 'Ingresa un precio válido.'
      this.errores = e
      return Object.keys(e).length === 0
    },

    async guardar() {
      if (!this.validar()) return
      this.guardando = true
      // Simula latencia mínima para feedback visual
      await new Promise((r) => setTimeout(r, 500))
      this.store.agregarJuego({ ...this.form })
      this.guardando = false
    },
  },
}
</script>

<style scoped>
.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  background: rgba(15, 10, 40, 0.55);
  backdrop-filter: blur(4px);
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-panel {
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
}

/* Transición backdrop */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Transición panel */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(24px) scale(0.97);
  opacity: 0;
}
</style>
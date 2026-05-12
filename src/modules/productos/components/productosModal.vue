<!-- src/components/modalProducts.vue -->
<template>
  <teleport to="body">

    <transition name="fade">

      <div
        v-if="store.modalAbierto"
        class="modal-backdrop-custom"
        @click.self="store.cerrarModal()"
      >

        <transition name="slide-up">

          <div
            v-if="store.modalAbierto"
            class="modal-panel rounded-4 shadow-lg bg-white overflow-hidden"
          >

            <!-- Header -->
            <header
              class="px-4 py-4 d-flex align-items-center justify-content-between"
              style="background: linear-gradient(135deg, #685aff, #9ccfff)"
            >

              <div class="d-flex align-items-center gap-3">

                <div
                  class="rounded-3 d-flex align-items-center justify-content-center"
                  style="background: rgba(255,255,255,0.2); width: 40px; height: 40px"
                >
                  <font-awesome-icon icon="box-open" class="text-white" />
                </div>

                <div>
                  <h2 class="text-white fw-black mb-0 fs-5">
                    Agregar producto
                  </h2>

                  <p
                    class="mb-0 small"
                    style="color: rgba(255,255,255,0.75)"
                  >
                    Completa los datos
                  </p>
                </div>

              </div>

              <button
                class="btn-close btn-close-white"
                @click="store.cerrarModal()"
              />

            </header>

            <!-- Body -->
            <div class="px-4 py-4 d-flex flex-column gap-3">

              <div>
                <label class="form-label small fw-bold">
                  Nombre
                </label>

                <input
                  v-model="form.nombre"
                  type="text"
                  class="form-control rounded-3"
                />
              </div>

              <div class="row g-3">

                <div class="col-6">
                  <label class="form-label small fw-bold">
                    Precio
                  </label>

                  <input
                    v-model="form.precio"
                    type="number"
                    step="0.01"
                    class="form-control rounded-3"
                  />
                </div>

                <div class="col-6">
                  <label class="form-label small fw-bold">
                    Stock
                  </label>

                  <input
                    v-model="form.stock"
                    type="number"
                    class="form-control rounded-3"
                  />
                </div>

              </div>

              <div>

                <label class="form-label small fw-bold">
                  Categoría
                </label>

                <select
                  v-model="form.categoria"
                  class="form-select rounded-3"
                >
                  <option disabled value="">
                    Seleccionar...
                  </option>

                  <option
                    v-for="c in store.categorias"
                    :key="c"
                    :value="c"
                  >
                    {{ c }}
                  </option>

                </select>

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
                @click="guardar"
              >
                <font-awesome-icon icon="plus" class="me-1" />
                Agregar
              </button>

            </footer>

          </div>

        </transition>

      </div>

    </transition>

  </teleport>
</template>

<script>
import { useProductsStore } from '../store/productosStore'

const formInicial = () => ({
  nombre: '',
  precio: '',
  stock: 0,
  categoria: '',
})

export default {
  name: 'modalProducts',

  setup() {
    const store = useProductsStore()
    return { store }
  },

  data() {
    return {
      form: formInicial(),
    }
  },

  methods: {
    async guardar() {
      await this.store.agregarProducto(this.form)
    },
  },

  watch: {
    'store.modalAbierto'(val) {
      if (val) {
        this.form = formInicial()
      }
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition:
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.25s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(24px) scale(0.97);
  opacity: 0;
}
</style>
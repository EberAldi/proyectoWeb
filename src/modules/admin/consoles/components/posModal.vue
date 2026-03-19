<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="pos.modalAbierto"
        class="modal-backdrop d-flex align-items-center justify-content-center p-3"
        @click.self="pos.cerrarVenta()"
      >
        <div class="modal-box rounded-4 shadow-lg overflow-hidden d-flex flex-column">

          <!-- Header -->
          <header
            class="d-flex align-items-center justify-content-between px-4 py-3"
            style="background: linear-gradient(135deg, #685aff, #9ccfff)"
          >
            <div class="d-flex align-items-center gap-3">
              <div
                class="rounded-3 d-flex align-items-center justify-content-center bg-white shadow-sm"
                style="width: 40px; height: 40px; flex-shrink: 0"
              >
                <font-awesome-icon icon="gamepad" style="color: #685aff" />
              </div>
              <div>
                <p class="fw-black text-white mb-0 small">{{ pos.ventaActiva.nombre }}</p>
                <p class="mb-0 text-white" style="font-size: 0.7rem; opacity: 0.8">
                  {{ pos.ventaActiva.marca }} · ${{ pos.ventaActiva.precioPorHora }}/hr
                </p>
              </div>
            </div>
            <button
              class="btn btn-sm text-white"
              style="background: rgba(255,255,255,0.2)"
              @click="pos.cerrarVenta()"
            >
              <font-awesome-icon icon="times" />
            </button>
          </header>

          <!-- Body -->
          <div class="d-flex flex-column flex-lg-row overflow-hidden flex-grow-1">

            <!-- Izquierda: consola + menú -->
            <div class="d-flex flex-column overflow-auto p-4 gap-4" style="flex: 1">

              <!-- Consola preview -->
              <div class="rounded-4 overflow-hidden position-relative" style="height: 180px; background: #0d0d1a">
                <img
                  :src="consolaImg"
                  alt="consola"
                  class="w-100 h-100"
                  style="object-fit: contain; padding: 16px; filter: drop-shadow(0 0 24px #685aff88)"
                />
                <div
                  class="position-absolute bottom-0 start-0 end-0 px-3 py-2"
                  style="background: linear-gradient(transparent, rgba(13,13,26,0.9))"
                >
                  <span class="text-white fw-black small">{{ pos.ventaActiva.nombre }}</span>
                </div>
              </div>

              <!-- Duración -->
              <div>
                <p class="small fw-black text-secondary text-uppercase mb-2" style="letter-spacing: 0.05em">
                  Duración de renta
                </p>
                <div class="d-flex gap-2 flex-wrap">
                  <button
                    v-for="h in [1, 2, 3, 4]"
                    :key="h"
                    class="btn btn-sm fw-bold rounded-3"
                    :class="duracion === h ? 'text-white' : 'btn-outline-secondary'"
                    :style="duracion === h ? { backgroundColor: '#685aff', borderColor: '#685aff' } : {}"
                    @click="duracion = h"
                  >
                    {{ h }}h — ${{ pos.ventaActiva.precioPorHora * h }}
                  </button>
                </div>
              </div>

              <!-- Menú -->
              <div>
                <p class="small fw-black text-secondary text-uppercase mb-2" style="letter-spacing: 0.05em">
                  Menú
                </p>

                <!-- Tabs categorías -->
                <div class="d-flex gap-2 mb-3 flex-wrap">
                  <button
                    v-for="cat in categorias"
                    :key="cat.value"
                    class="btn btn-sm rounded-pill fw-semibold"
                    :class="categoriaActiva === cat.value ? 'text-white' : 'text-secondary'"
                    :style="categoriaActiva === cat.value
                      ? { backgroundColor: '#685aff' }
                      : { backgroundColor: '#f3f4f6' }"
                    @click="categoriaActiva = cat.value"
                  >
                    {{ cat.emoji }} {{ cat.label }}
                  </button>
                </div>

                <!-- Items del menú -->
                <div class="row g-2">
                  <div
                    v-for="item in menuFiltrado"
                    :key="item.id"
                    class="col-6"
                  >
                    <div
                      class="rounded-3 p-3 d-flex align-items-center justify-content-between menu-item"
                      :class="pos.itemEnCarrito(item.id) ? 'menu-item-active' : ''"
                    >
                      <div class="d-flex align-items-center gap-2">
                        <span style="font-size: 1.4rem">{{ item.emoji }}</span>
                        <div>
                          <p class="mb-0 fw-semibold text-dark" style="font-size: 0.72rem; line-height: 1.2">{{ item.nombre }}</p>
                          <p class="mb-0 fw-black" style="font-size: 0.75rem; color: #685aff">${{ item.precio }}</p>
                        </div>
                      </div>

                      <!-- Contador -->
                      <div v-if="pos.itemEnCarrito(item.id)" class="d-flex align-items-center gap-1">
                        <button
                          class="btn btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center"
                          style="width: 22px; height: 22px; background: #685aff; color: white; font-size: 0.75rem"
                          @click="pos.quitarItem(item.id)"
                        >−</button>
                        <span class="fw-black small">{{ pos.itemEnCarrito(item.id).cantidad }}</span>
                        <button
                          class="btn btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center"
                          style="width: 22px; height: 22px; background: #685aff; color: white; font-size: 0.75rem"
                          @click="pos.agregarItem(item)"
                        >+</button>
                      </div>
                      <button
                        v-else
                        class="btn btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center"
                        style="width: 26px; height: 26px; background: #f0ffc3; color: #685aff; font-size: 1rem; flex-shrink: 0"
                        @click="pos.agregarItem(item)"
                      >+</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Derecha: ticket -->
            <div
              class="d-flex flex-column"
              style="width: 260px; flex-shrink: 0; border-left: 1px solid #f0f0f0; background: #fafafa"
            >
              <div class="px-4 py-3 border-bottom">
                <p class="fw-black text-dark small mb-0">
                  <font-awesome-icon icon="receipt" class="me-2" style="color: #685aff" />
                  Ticket
                </p>
              </div>

              <div class="flex-grow-1 overflow-auto px-4 py-3 d-flex flex-column gap-2">

                <!-- Renta -->
                <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
                  <div>
                    <p class="mb-0 small fw-semibold text-dark">{{ pos.ventaActiva.nombre }}</p>
                    <p class="mb-0 text-secondary" style="font-size: 0.7rem">{{ duracion }}h de renta</p>
                  </div>
                  <span class="fw-black small" style="color: #685aff">
                    ${{ pos.ventaActiva.precioPorHora * duracion }}
                  </span>
                </div>

                <!-- Items carrito -->
                <div
                  v-for="item in pos.carrito"
                  :key="item.id"
                  class="d-flex justify-content-between align-items-center"
                >
                  <div class="d-flex align-items-center gap-2">
                    <span style="font-size: 1rem">{{ item.emoji }}</span>
                    <div>
                      <p class="mb-0 small text-dark" style="font-size: 0.72rem">{{ item.nombre }}</p>
                      <p class="mb-0 text-secondary" style="font-size: 0.68rem">x{{ item.cantidad }}</p>
                    </div>
                  </div>
                  <span class="small fw-semibold text-dark">${{ item.precio * item.cantidad }}</span>
                </div>

                <p
                  v-if="pos.carrito.length === 0"
                  class="text-secondary text-center mt-3"
                  style="font-size: 0.75rem"
                >
                  Sin extras por ahora
                </p>
              </div>

              <!-- Total + cobrar -->
              <div class="px-4 py-3 border-top">
                <div class="d-flex justify-content-between mb-1">
                  <span class="small text-secondary">Renta</span>
                  <span class="small fw-semibold">${{ pos.ventaActiva.precioPorHora * duracion }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span class="small text-secondary">Extras</span>
                  <span class="small fw-semibold">${{ pos.totalCarrito }}</span>
                </div>
                <div
                  class="d-flex justify-content-between p-2 rounded-3 mb-3"
                  style="background: #f0ffc3"
                >
                  <span class="fw-black small" style="color: #685aff">Total</span>
                  <span class="fw-black" style="color: #685aff">
                    ${{ pos.totalConRenta(pos.ventaActiva.precioPorHora * duracion) }}
                  </span>
                </div>

                <button
                  class="btn w-100 fw-black text-white rounded-3"
                  style="background: linear-gradient(135deg, #685aff, #9ccfff)"
                  @click="pos.cobrar(duracion)"
                >
                  <font-awesome-icon icon="cash-register" class="me-2" />
                  Cobrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import { usePosStore } from '../stores/posStore';

const consolaImgs = {
  'PlayStation 5':      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/PlayStation_5_and_DualSense_with_transparent_background.png/800px-PlayStation_5_and_DualSense_with_transparent_background.png',
  'PlayStation 4':      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/PS4-Console-wDS4.png/800px-PS4-Console-wDS4.png',
  'PlayStation 4 Slim': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/PS4-Console-wDS4.png/800px-PS4-Console-wDS4.png',
  'Xbox Series X':      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Xbox_Series_X_wcontroller.png/600px-Xbox_Series_X_wcontroller.png',
  'Xbox One':           'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Xbox-One-Console-wController.png/800px-Xbox-One-Console-wController.png',
  'Nintendo Switch':    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Nintendo-Switch-wJoyCons-BlRd-Standing-FL.png/800px-Nintendo-Switch-wJoyCons-BlRd-Standing-FL.png',
}

export default {
  name: 'PosModal',

  setup() {
    const pos = usePosStore()
    return { pos }
  },

  data() {
    return {
      duracion: 1,
      categoriaActiva: 'todos',
      categorias: [
        { value: 'todos',  emoji: '⚡', label: 'Todos'   },
        { value: 'comida', emoji: '🍿', label: 'Comida'  },
        { value: 'bebida', emoji: '🥤', label: 'Bebidas' },
        { value: 'snack',  emoji: '🌮', label: 'Snacks'  },
        { value: 'extra',  emoji: '🎮', label: 'Extras'  },
      ],
    }
  },

  computed: {
    consolaImg() {
      return consolaImgs[this.pos.ventaActiva?.nombre] ?? consolaImgs['PlayStation 5']
    },
    menuFiltrado() {
      if (this.categoriaActiva === 'todos') return this.pos.menu
      return this.pos.menu.filter((i) => i.categoria === this.categoriaActiva)
    },
  },
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 1050;
  backdrop-filter: blur(4px);
}
.modal-box {
  background: #fff;
  width: 100%;
  max-width: 860px;
  max-height: 90vh;
}
.menu-item {
  background: #f9f9ff;
  border: 2px solid transparent;
  transition: border-color 0.15s;
}
.menu-item-active {
  border-color: #685aff44;
  background: #f0eeff;
}
.modal-enter-active,
.modal-leave-active { transition: opacity 0.25s ease; }
.modal-enter-active .modal-box,
.modal-leave-active .modal-box { transition: transform 0.25s ease; }
.modal-enter-from,
.modal-leave-to { opacity: 0; }
.modal-enter-from .modal-box { transform: translateY(20px) scale(0.97); }
</style>
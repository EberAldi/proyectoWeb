<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="pos.modalAbierto"
        class="modal-backdrop d-flex align-items-center justify-content-center p-3"
        @click.self="pos.cerrarVenta()"
      >
        <div class="modal-box rounded-4 shadow-lg overflow-hidden d-flex flex-column">

          <!-- HEADER -->
          <header
            class="d-flex justify-content-between align-items-center px-4 py-3 text-white"
            style="background: linear-gradient(135deg, #685aff, #9ccfff)"
          >
            <div>
              <p class="mb-0 fw-black small">{{ pos.ventaActiva?.nombre }}</p>
              <p class="mb-0" style="font-size: 0.75rem; opacity: 0.8">
                ${{ pos.ventaActiva?.precioPorHora }}/hora
              </p>
            </div>

            <button class="btn btn-sm text-white" @click="pos.cerrarVenta()">
              ✕
            </button>
          </header>

          <!-- BODY -->
          <div class="d-flex flex-column flex-lg-row flex-grow-1 overflow-hidden">

            <!-- IZQUIERDA -->
            <div class="flex-grow-1 p-4 overflow-auto">

              <!-- RENTA -->
              <div class="mb-4">
                <p class="fw-black small text-secondary text-uppercase">Duración</p>

                <div class="d-flex gap-2 flex-wrap">
                  <button
                    v-for="h in [1,2,3,4]"
                    :key="h"
                    class="btn btn-sm fw-bold"
                    :class="duracion === h ? 'text-white' : 'btn-outline-secondary'"
                    :style="duracion === h ? { backgroundColor: '#685aff' } : {}"
                    @click="duracion = h"
                  >
                    {{ h }}h — ${{ pos.ventaActiva?.precioPorHora * h }}
                  </button>
                </div>
              </div>

              <!-- PRODUCTOS -->
              <div>
                <p class="fw-black small text-secondary text-uppercase">Productos</p>

                <div class="row g-2">
                  <div
                    v-for="item in pos.menu"
                    :key="item.id"
                    class="col-6"
                  >
                    <div class="p-3 rounded-3 border d-flex justify-content-between align-items-center">

                      <div>
                        <p class="mb-0 small fw-semibold">{{ item.nombre }}</p>
                        <p class="mb-0 small text-secondary">${{ item.precio }}</p>
                      </div>

                      <div v-if="pos.itemEnCarrito(item.id)" class="d-flex align-items-center gap-1">
                        <button @click="pos.quitarItem(item.id)" class="btn btn-sm">-</button>
                        <span>{{ pos.itemEnCarrito(item.id).cantidad }}</span>
                        <button @click="pos.agregarItem(item)" class="btn btn-sm">+</button>
                      </div>

                      <button
                        v-else
                        class="btn btn-sm btn-primary"
                        @click="pos.agregarItem(item)"
                      >
                        +
                      </button>

                    </div>
                  </div>
                </div>
              </div>

            </div>

            <!-- DERECHA TICKET -->
            <aside
              class="p-4 border-start"
              style="width: 280px; background: #fafafa"
            >

              <h6 class="fw-black mb-3">Ticket</h6>

              <!-- RENTA -->
              <div class="d-flex justify-content-between mb-2">
                <span>Renta</span>
                <span>
                  ${{ pos.ventaActiva?.precioPorHora * duracion }}
                </span>
              </div>

              <!-- PRODUCTOS -->
              <div
                v-for="item in pos.carrito"
                :key="item.id"
                class="d-flex justify-content-between small mb-1"
              >
                <span>{{ item.nombre }} x{{ item.cantidad }}</span>
                <span>${{ item.precio * item.cantidad }}</span>
              </div>

              <hr>

              <div class="d-flex justify-content-between fw-black">
                <span>Total</span>
                <span>
                  ${{ pos.totalCarrito + (pos.ventaActiva?.precioPorHora * duracion) }}
                </span>
              </div>

              <button
                class="btn w-100 mt-3 text-white fw-bold"
                style="background: linear-gradient(135deg,#685aff,#9ccfff)"
                @click="pos.cobrar()"
              >
                Cobrar
              </button>

            </aside>

          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import { usePosStore } from '../stores/posStoreSimple'

export default {
  name: 'PosModal',

  setup() {
    const pos = usePosStore()
    return { pos }
  },

  data() {
    return {
      duracion: 1,
    }
  },
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1050;
  backdrop-filter: blur(4px);
}

.modal-box {
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  background: white;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
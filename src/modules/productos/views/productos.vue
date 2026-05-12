<!-- src/views/ProductosView.vue -->
<template>
  <div class="d-flex flex-column gap-4">

    <!-- Header -->
    <header class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
      <div>
        <h1 class="fw-black text-dark fs-4 mb-0 d-flex align-items-center gap-3">
          <div
            class="rounded-3 d-flex align-items-center justify-content-center shadow"
            style="background: #685aff; width: 40px; height: 40px"
          >
            <font-awesome-icon icon="box-open" class="text-white small" />
          </div>
          Productos
        </h1>

        <p class="text-secondary small mt-1 mb-0">
          Inventario y control de stock
        </p>
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
          Agregar producto
        </button>
      </div>
    </header>

    <div class="row g-4">

      <!-- Tabla -->
      <section class="col-12 col-xl-9">

        <div class="bg-white rounded-4 shadow-sm overflow-hidden">

          <div class="table-responsive">

            <table class="table align-middle mb-0">

              <thead style="background-color: #f8f7ff">
                <tr>
                  <th class="px-4 py-3 small text-secondary fw-bold border-0">Producto</th>
                  <th class="px-3 py-3 small text-secondary fw-bold border-0">Categoría</th>
                  <th class="px-3 py-3 small text-secondary fw-bold border-0">Precio</th>
                  <th class="px-3 py-3 small text-secondary fw-bold border-0">Stock</th>
                  <th class="px-3 py-3 small text-secondary fw-bold border-0">Estado</th>
                  <th class="px-4 py-3 small text-secondary fw-bold border-0 text-end">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody v-if="store.isLoading">

                <tr v-for="n in 5" :key="n">
                  <td colspan="7" class="p-4">
                    <div
                      class="skeleton"
                      style="height: 18px; border-radius: 8px"
                    />
                  </td>
                </tr>

              </tbody>

              <tbody v-else>

                <tr
                  v-for="producto in store.productosFiltrados"
                  :key="producto.id"
                  class="fila-producto"
                >

                  <!-- Producto -->
                  <td class="px-4 py-3">
                    <div class="d-flex align-items-center gap-3">

                      <div
                        class="rounded-3 d-flex align-items-center justify-content-center"
                        :style="{
                          width: '42px',
                          height: '42px',
                          backgroundColor: colorCategoria(producto.categoria) + '22'
                        }"
                      >
                        <font-awesome-icon
                          :icon="iconoCategoria(producto.categoria)"
                          :style="{ color: colorCategoria(producto.categoria) }"
                        />
                      </div>

                      <div>
                        <h3 class="fw-black small text-dark mb-0">
                          {{ producto.nombre }}
                        </h3>

                        <p class="text-secondary mb-0" style="font-size: 0.72rem">
                          ID #{{ producto.id }}
                        </p>
                      </div>
                    </div>
                  </td>

                  <!-- Categoría -->
                  <td class="px-3 py-3">
                    <span
                      class="badge rounded-pill fw-semibold text-capitalize"
                      :style="{
                        backgroundColor: colorCategoria(producto.categoria) + '22',
                        color: colorCategoria(producto.categoria)
                      }"
                    >
                      {{ producto.categoria }}
                    </span>
                  </td>

                  <!-- Precio -->
                  <td class="px-3 py-3 fw-bold text-dark">
                    ${{ Number(producto.precio).toFixed(2) }}
                  </td>

                  <!-- Stock -->
                  <td class="px-3 py-3 fw-bold">
                    {{ producto.stock }}
                  </td>

                  <!-- Estado -->
                  <td class="px-3 py-3">

                    <span
                      class="badge rounded-pill fw-bold"
                      :style="estadoStock(producto.stock)"
                    >
                      {{ textoEstado(producto.stock) }}
                    </span>

                  </td>

                  <!-- Ajustar -->
                  

                  <!-- Acciones -->
                  <td class="px-4 py-3 text-end">

                    <button
                      class="btn btn-sm rounded-3 fw-semibold"
                      style="background-color: #fff1f1; color: #ef4444"
                      @click="store.eliminarProducto(producto.id)"
                    >
                      <font-awesome-icon icon="trash" />
                    </button>

                  </td>

                </tr>

                <!-- Empty -->
                <tr v-if="store.productosFiltrados.length === 0">
                  <td colspan="7" class="text-center p-5">

                    <div
                      class="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center"
                      style="width: 60px; height: 60px; background-color: #f1efff"
                    >
                      <font-awesome-icon
                        icon="box-open"
                        style="color: #685aff; font-size: 1.5rem"
                      />
                    </div>

                    <p class="fw-semibold text-secondary mb-1">
                      No hay productos registrados
                    </p>

                  </td>
                </tr>

              </tbody>

            </table>

          </div>

        </div>

      </section>

      <!-- Aside -->
      <aside class="col-12 col-xl-3 d-flex flex-column gap-3">

        <article
          class="bg-white rounded-4 shadow-sm p-4"
          style="border-top: 4px solid #685aff"
        >

          <header class="mb-3">
            <h3 class="fw-black text-dark fs-6 mb-0">Resumen</h3>
            <p class="text-secondary mb-0" style="font-size: 0.7rem">
              Estado actual
            </p>
          </header>

          <div class="d-flex flex-column gap-2">

            <div class="p-3 rounded-3 bg-light d-flex justify-content-between">
              <span class="small fw-semibold">Total productos</span>
              <span class="fw-black" style="color: #685aff">
                {{ store.resumen.total }}
              </span>
            </div>

            <div class="p-3 rounded-3 bg-light d-flex justify-content-between">
              <span class="small fw-semibold">Sin stock</span>
              <span class="fw-black text-danger">
                {{ store.resumen.sinStock }}
              </span>
            </div>

            <div class="p-3 rounded-3 bg-light d-flex justify-content-between">
              <span class="small fw-semibold">Valor inventario</span>
              <span class="fw-black text-success">
                ${{ store.valorInventario }}
              </span>
            </div>

          </div>

        </article>

      </aside>

    </div>

    <modal-products />

  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useProductsStore } from '../store/productosStore'
import modalProducts from '../components/productosModal.vue'

export default {
  name: 'ProductosView',

  components: {
    modalProducts,
  },

  setup() {
    const store = useProductsStore()

    onMounted(() => {
      store.fetchProductos()
    })

    return { store }
  },

  data() {
    return {
      filtros: [
        { label: 'Todos', value: 'todos', color: '#685aff' },
        { label: 'Comida', value: 'comida', color: '#f59e0b' },
        { label: 'Bebida', value: 'bebida', color: '#06b6d4' },
        { label: 'Accesorio', value: 'accesorio', color: '#685aff' },
      ],
    }
  },

  methods: {
    iconoCategoria(categoria) {
      const mapa = {
        comida: 'burger',
        bebida: 'wine-bottle',
        accesorio: 'headset',
      }

      return mapa[categoria] ?? 'box'
    },

    colorCategoria(categoria) {
      const mapa = {
        comida: '#f59e0b',
        bebida: '#06b6d4',
        accesorio: '#685aff',
      }

      return mapa[categoria] ?? '#685aff'
    },

    estadoStock(stock) {
      if (stock <= 0) {
        return {
          backgroundColor: '#fee2e2',
          color: '#dc2626',
        }
      }

      if (stock < 5) {
        return {
          backgroundColor: '#fef3c7',
          color: '#d97706',
        }
      }

      return {
        backgroundColor: '#dcfce7',
        color: '#16a34a',
      }
    },

    textoEstado(stock) {
      if (stock <= 0) return 'Sin stock'
      if (stock < 5) return 'Bajo'
      return 'Disponible'
    },
  },
}
</script>

<style scoped>
.fila-producto {
  transition: all 0.2s ease;
}

.fila-producto:hover {
  background-color: #fafaff;
}

.skeleton {
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );

  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}
</style>
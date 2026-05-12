// src/store/products.js
import { defineStore } from 'pinia'
import Swal from 'sweetalert2'
import api from '../../../service/api.js'

export const useProductsStore = defineStore('productos', {

  state: () => ({
    productos: [],
    modalAbierto: false,
    filtroActivo: 'todos',
    isLoading: false,

    categorias: [
      'comida',
      'bebida',
      'accesorio',
    ],
  }),

  getters: {

    productosFiltrados(state) {
      if (state.filtroActivo === 'todos') {
        return state.productos
      }

      return state.productos.filter(
        (p) => p.categoria === state.filtroActivo
      )
    },

    resumen(state) {
      return {
        total: state.productos.length,

        sinStock: state.productos.filter(
          (p) => p.stock <= 0
        ).length,
      }
    },

    valorInventario(state) {
      return state.productos
        .reduce((acc, p) => {
          return acc + (Number(p.precio) * p.stock)
        }, 0)
        .toFixed(2)
    },
  },

  actions: {

    setFiltro(filtro) {
      this.filtroActivo = filtro
    },

    abrirModal() {
      this.modalAbierto = true
    },

    cerrarModal() {
      this.modalAbierto = false
    },

    async fetchProductos() {

      try {

        this.isLoading = true

        const { data } = await api.get('/productos')

        this.productos = data

      } catch (error) {

        console.error(error)

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los productos',
        })

      } finally {
        this.isLoading = false
      }
    },

    async agregarProducto(datos) {

      try {

        this.isLoading = true

        const { data } = await api.post('/productos', {
          nombre: datos.nombre.trim(),
          precio: Number(datos.precio),
          stock: Number(datos.stock),
          categoria: datos.categoria,
        })

        this.productos.push(data)

        Swal.fire({
          icon: 'success',
          title: 'Producto agregado',
          showConfirmButton: false,
          timer: 1500,
        })

        this.cerrarModal()

      } catch (error) {

        console.error(error)

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo agregar el producto',
        })

      } finally {
        this.isLoading = false
      }
    },

    async ajustarStock(id, cantidad) {

      try {

        const { data } = await api.patch(
          `/productos/${id}/stock`,
          { cantidad }
        )

        const index = this.productos.findIndex(
          (p) => p.id === id
        )

        if (index !== -1) {
          this.productos[index] = data
        }

      } catch (error) {

        console.error(error)

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo ajustar el stock',
        })
      }
    },

    async eliminarProducto(id) {

      try {

        await api.delete(`/productos/${id}`)

        this.productos = this.productos.filter(
          (p) => p.id !== id
        )

        Swal.fire({
          icon: 'success',
          title: 'Producto eliminado',
          showConfirmButton: false,
          timer: 1200,
        })

      } catch (error) {

        console.error(error)

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el producto',
        })
      }
    },
  },
})
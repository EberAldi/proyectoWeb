import { defineStore } from 'pinia'
import Swal from 'sweetalert2'

export const usePosStore = defineStore('pos', {
  state: () => ({
    modalAbierto: false,
    ventaActiva: null,
    carrito: [],
    menu: [
      { id: 1, nombre: 'Nachos con queso',  emoji: '🧀', precio: 45, categoria: 'comida' },
      { id: 2, nombre: 'Palomitas grandes', emoji: '🍿', precio: 35, categoria: 'comida' },
      { id: 3, nombre: 'Hot dog',           emoji: '🌭', precio: 40, categoria: 'comida' },
      { id: 4, nombre: 'Coca-Cola 600ml',   emoji: '🥤', precio: 25, categoria: 'bebida' },
      { id: 5, nombre: 'Agua 1L',           emoji: '💧', precio: 15, categoria: 'bebida' },
      { id: 6, nombre: 'Jugo del Valle',    emoji: '🧃', precio: 20, categoria: 'bebida' },
      { id: 7, nombre: 'Doritos',           emoji: '🌮', precio: 18, categoria: 'snack'  },
      { id: 8, nombre: 'Chocolisto',        emoji: '🍫', precio: 22, categoria: 'snack'  },
      { id: 9, nombre: 'Control extra',     emoji: '🎮', precio: 50, categoria: 'extra'  },
    ],
  }),

  getters: {
    totalCarrito: (state) =>
      state.carrito.reduce((acc, i) => acc + i.precio * i.cantidad, 0),

    totalConRenta: (state) => (precioRenta) =>
      state.carrito.reduce((acc, i) => acc + i.precio * i.cantidad, 0) + precioRenta,

    itemEnCarrito: (state) => (id) =>
      state.carrito.find((i) => i.id === id) ?? null,
  },

  actions: {
    abrirVenta(consola) {
      this.ventaActiva = consola
      this.carrito = []
      this.modalAbierto = true
    },

    cerrarVenta() {
      this.modalAbierto = false
      this.ventaActiva = null
      this.carrito = []
    },

    agregarItem(item) {
      const existe = this.carrito.find((i) => i.id === item.id)
      if (existe) {
        existe.cantidad++
      } else {
        this.carrito.push({ ...item, cantidad: 1 })
      }
    },

    quitarItem(id) {
      const existe = this.carrito.find((i) => i.id === id)
      if (!existe) return
      if (existe.cantidad > 1) {
        existe.cantidad--
      } else {
        this.carrito = this.carrito.filter((i) => i.id !== id)
      }
    },

    async cobrar(duracionHoras) {
      const precioRenta = this.ventaActiva.precioPorHora * duracionHoras
      const total = this.totalConRenta(precioRenta)

      const result = await Swal.fire({
        icon: 'question',
        title: '¿Confirmar venta?',
        html: `
          <div style="text-align:left;font-size:14px">
            <b>Consola:</b> ${this.ventaActiva.nombre}<br>
            <b>Duración:</b> ${duracionHoras}h<br>
            <b>Renta:</b> $${precioRenta}<br>
            <b>Extras:</b> $${this.totalCarrito}<br>
            <hr>
            <b style="font-size:18px">Total: $${total}</b>
          </div>`,
        showCancelButton: true,
        confirmButtonColor: '#685aff',
        cancelButtonColor: '#ef4444',
        confirmButtonText: 'Cobrar',
        cancelButtonText: 'Cancelar',
      })

      if (!result.isConfirmed) return

      await Swal.fire({
        icon: 'success',
        title: '¡Venta registrada!',
        html: `<b>Total cobrado: $${total}</b>`,
        timer: 1800,
        showConfirmButton: false,
      })

      this.cerrarVenta()
    },
  },
})
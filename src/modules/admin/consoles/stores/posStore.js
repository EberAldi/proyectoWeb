// src/stores/posStore.js

import { defineStore } from 'pinia'
import Swal from 'sweetalert2'
import axios from 'axios'
import api from '../../../../service/api.js'

export const usePosStore = defineStore('pos', {
  state: () => ({
    modalAbierto: false,

    ventaActiva: null,

    carrito: [],

    // productos reales desde BD
    menu: [],

    // juegos reales desde BD
    juegos: [],

    cargando: false,
  }),

  getters: {
    totalCarrito: (state) =>
      state.carrito.reduce(
        (acc, i) => acc + Number(i.precio) * i.cantidad,
        0
      ),

    totalConRenta: (state) => (precioRenta) =>
      state.carrito.reduce(
        (acc, i) => acc + Number(i.precio) * i.cantidad,
        0
      ) + precioRenta,

    itemEnCarrito: (state) => (id) =>
      state.carrito.find((i) => i.id === id) ?? null,
  },

  actions: {
    // =========================================================
    // ABRIR MODAL
    // =========================================================
    async abrirVenta(consola) {
      try {
        this.cargando = true

        this.ventaActiva = consola
        this.carrito = []

        // cargar productos
        await this.obtenerProductos()

        // cargar juegos de esa consola
        await this.obtenerJuegosPorConsola(consola.id)

        this.modalAbierto = true
      } catch (error) {
        console.error(error)

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'No se pudo abrir la venta',
        })
      } finally {
        this.cargando = false
      }
    },

    cerrarVenta() {
      this.modalAbierto = false
      this.ventaActiva = null
      this.carrito = []
      this.juegos = []
    },

    // =========================================================
    // PRODUCTOS
    // =========================================================
    async obtenerProductos() {
      const { data } = await api.get(`/productos`)

      this.menu = data.map((p) => ({
        id: p.id,
        nombre: p.nombre,
        precio: Number(p.precio),
        categoria: p.categoria,
        stock: p.stock,

        // iconos por categoría
        emoji:
          p.categoria === 'comida'
            ? '🍔'
            : p.categoria === 'bebida'
            ? '🥤'
            : '🎮',
      }))
    },

    // =========================================================
    // JUEGOS
    // =========================================================
    async obtenerJuegosPorConsola(consolaId) {
  const { data } = await api.get(
    `juegos/consola/${consolaId}`
  )

  this.juegos = data.map((juego) => ({
    id: juego.id,
    nombre: juego.nombre,
    genero: juego.genero || 'Videojuego',
    descripcion: juego.descripcion || 'Sin descripción',
    emoji: '🎮',

    gradient:
      'linear-gradient(135deg,#685aff,#9ccfff)',
  }))
},
    // =========================================================
    // CARRITO
    // =========================================================
    agregarItem(item) {
      if (item.stock <= 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Sin stock',
          text: `No hay stock disponible de ${item.nombre}`,
        })

        return
      }

      const existe = this.carrito.find((i) => i.id === item.id)

      if (existe) {
        if (existe.cantidad >= item.stock) {
          Swal.fire({
            icon: 'warning',
            title: 'Stock insuficiente',
            text: `Solo hay ${item.stock} unidades disponibles`,
          })

          return
        }

        existe.cantidad++
      } else {
        this.carrito.push({
          ...item,
          cantidad: 1,
        })
      }
    },

    quitarItem(id) {
      const existe = this.carrito.find((i) => i.id === id)

      if (!existe) return

      if (existe.cantidad > 1) {
        existe.cantidad--
      } else {
        this.carrito = this.carrito.filter(
          (i) => i.id !== id
        )
      }
    },

    // =========================================================
    // COBRAR
    // =========================================================
  async cobrar({
  duracionHoras,
  juegoSeleccionado,
}) {

  try {

    // =====================================================
    // TOTALES
    // =====================================================

    const precioRenta =
      this.ventaActiva.precioPorHora *
      duracionHoras

    const tieneExtras =
      this.carrito.length > 0

    const totalExtras =
      this.totalCarrito

    const total =
      this.totalConRenta(precioRenta)

    // =====================================================
    // SOLO SESIÓN
    // =====================================================

    if (!tieneExtras) {

      const sesionResponse = await api.post(
        `/sesiones/abrir`,
        {
          consolaId: this.ventaActiva.id,

          empleadoId: 1,

          juegoId:
            juegoSeleccionado?.id || null,

          duracionHoras,
        }
      )

      const sesion = sesionResponse.data

      await Swal.fire({
        icon: 'success',

        title: '¡Sesión iniciada!',

        html: `
          <div style="font-size:14px">

            <b>Sesión #${sesion.id}</b>

            <br><br>

            Sin extras registrados

          </div>
        `,

        timer: 2200,
        showConfirmButton: false,
      })

      this.cerrarVenta()

      return
    }

    // =====================================================
    // MÉTODO DE PAGO
    // =====================================================

    const metodoPago =
      await new Promise((resolve) => {

        let seleccionado = false

        Swal.fire({
          title: 'Método de pago',

          html: `
            <div style="
              display:flex;
              flex-direction:column;
              gap:12px;
              margin-top:15px;
            ">

              <button
                id="btn-efectivo"
                style="
                  border:none;
                  background:#10b981;
                  color:white;
                  padding:14px;
                  border-radius:12px;
                  font-size:16px;
                  font-weight:700;
                  cursor:pointer;
                "
              >
                💵 Efectivo
              </button>

              <button
                id="btn-qr"
                style="
                  border:none;
                  background:#009ee3;
                  color:white;
                  padding:14px;
                  border-radius:12px;
                  font-size:16px;
                  font-weight:700;
                  cursor:pointer;
                "
              >
                📱 QR Mercado Pago
              </button>

            </div>
          `,

          showConfirmButton: false,
          showCloseButton: true,

          didOpen: () => {

            document
              .getElementById('btn-efectivo')
              .onclick = () => {

                seleccionado = true

                resolve('efectivo')

                Swal.close()
              }

            document
              .getElementById('btn-qr')
              .onclick = () => {

                seleccionado = true

                resolve('qr')

                Swal.close()
              }
          },

          willClose: () => {

            if (!seleccionado) {
              resolve(null)
            }
          },
        })
      })

    if (!metodoPago) return

    // =====================================================
    // EFECTIVO
    // =====================================================

    if (metodoPago === 'efectivo') {

      await api.post(
        `/pagos/efectivo`,
        {
          total,
        }
      )
    }

    // =====================================================
    // QR MERCADO PAGO
    // =====================================================

    if (metodoPago === 'qr') {

      const { data } = await api.post(
        `/pagos/qr`,
        {
          total,

          titulo:
            `Renta ${this.ventaActiva.nombre}`,
        }
      )

      let pagoAprobado = false

      let intervalPago = null

      await Swal.fire({
        title: 'Escanea el QR',

        html: `
          <div
            style="
              display:flex;
              flex-direction:column;
              align-items:center;
              gap:12px;
            "
          >

            <img
              src="${data.qr}"
              style="
                width:240px;
                height:240px;
                object-fit:contain;
              "
            />

            <b style="font-size:24px">
              $${total}
            </b>

            <a
              href="${data.initPoint}"
              target="_blank"
              style="
                color:#009ee3;
                font-weight:700;
                text-decoration:none;
              "
            >
              Abrir Mercado Pago
            </a>

            <p
              id="estadoPago"
              style="
                font-size:13px;
                color:#666;
              "
            >
              Esperando pago...
            </p>

          </div>
        `,

        showConfirmButton: false,

        allowOutsideClick: false,
        allowEscapeKey: false,

        didOpen: () => {

          intervalPago = setInterval(async () => {

            try {

              const { data: statusData } =
                await api.get(
                  `/pagos/estado/${data.paymentId}`
                )

              console.log(statusData)

              if (
                statusData.status ===
                'approved'
              ) {

                pagoAprobado = true

                clearInterval(intervalPago)

                const estado =
                  document.getElementById(
                    'estadoPago'
                  )

                if (estado) {

                  estado.innerHTML = `
                    <span
                      style="
                        color:#10b981;
                        font-weight:700;
                      "
                    >
                      ✅ Pago aprobado
                    </span>
                  `
                }

                setTimeout(() => {
                  Swal.close()
                }, 1200)
              }

            } catch (error) {

              console.error(error)
            }

          }, 3000)
        },

        willClose: () => {

          if (intervalPago) {
            clearInterval(intervalPago)
          }
        },
      })

      if (!pagoAprobado) {
        return
      }
    }

    // =====================================================
    // CREAR SESIÓN
    // =====================================================

    const sesionResponse = await api.post(
      `/sesiones/abrir`,
      {
        consolaId: this.ventaActiva.id,

        empleadoId: 1,

        juegoId:
          juegoSeleccionado?.id || null,

        duracionHoras,
      }
    )

    const sesion = sesionResponse.data

    // =====================================================
    // CREAR VENTA
    // =====================================================

    await api.post(`/ventas`, {

      empleadoId: 1,

      sesionId: sesion.id,

      items: this.carrito.map((item) => ({
        productoId: item.id,
        cantidad: item.cantidad,
      })),
    })

    // =====================================================
    // SUCCESS
    // =====================================================

    await Swal.fire({
      icon: 'success',

      title: '¡Cobro realizado!',

      html: `
        <div style="font-size:14px">

          <b>Sesión #${sesion.id}</b>

          <br><br>

          Método:
          <b>
            ${
              metodoPago === 'efectivo'
                ? '💵 Efectivo'
                : '📱 Mercado Pago'
            }
          </b>

          <br><br>

          Total:
          <b>$${total}</b>

        </div>
      `,

      timer: 2600,
      showConfirmButton: false,
    })

    this.cerrarVenta()

  } catch (error) {

    console.error(error)

    Swal.fire({
      icon: 'error',

      title: 'Error',

      text:
        error.response?.data?.message ||
        'No se pudo registrar la venta',
    })
  }
}
  },
})
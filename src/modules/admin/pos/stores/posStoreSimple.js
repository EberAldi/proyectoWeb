import { defineStore } from 'pinia'
import Swal from 'sweetalert2'
import api from '../../../../service/api.js'

export const usePosStore = defineStore('posSimple', {

  state: () => ({
    modalAbierto: false,

    carrito: [],

    menu: [],

    cargando: false,
  }),

  getters: {

    totalCarrito: (state) =>
      state.carrito.reduce(
        (acc, item) =>
          acc + Number(item.precio) * item.cantidad,
        0
      ),

    itemEnCarrito: (state) => (id) =>
      state.carrito.find(i => i.id === id) || null,
  },

  actions: {

    // =====================================================
    // MODAL
    // =====================================================

    async abrirVenta() {

      this.carrito = []

      await this.obtenerProductos()

      this.modalAbierto = true
    },

    cerrarVenta() {

      this.modalAbierto = false

      this.carrito = []
    },

    // =====================================================
    // PRODUCTOS
    // =====================================================

    async obtenerProductos() {

      const { data } = await api.get('/productos')

      this.menu = data.map((p) => ({
        id: p.id,

        nombre: p.nombre,

        precio: Number(p.precio),

        categoria: p.categoria,

        stock: p.stock,

        emoji:
          p.categoria === 'comida'
            ? '🍔'
            : p.categoria === 'bebida'
            ? '🥤'
            : '🎮',
      }))
    },

    // =====================================================
    // CARRITO
    // =====================================================

    agregarItem(item) {

      if (item.stock <= 0) {

        Swal.fire({
          icon: 'warning',
          title: 'Sin stock',
          text: `No hay stock disponible de ${item.nombre}`,
        })

        return
      }

      const existe =
        this.carrito.find(i => i.id === item.id)

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

      const item =
        this.carrito.find(i => i.id === id)

      if (!item) return

      if (item.cantidad > 1) {

        item.cantidad--

      } else {

        this.carrito =
          this.carrito.filter(i => i.id !== id)
      }
    },

    // =====================================================
    // QR
    // =====================================================

    async pagarConQR(total, titulo) {

      const { data } = await api.post(
        '/pagos/qr',
        {
          total,
          titulo,
        }
      )

      return new Promise((resolve) => {

        let pagoAprobado = false

        let intervalPago = null

        Swal.fire({

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

                if (
                  statusData.status === 'approved'
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

                    resolve(true)

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

            if (!pagoAprobado) {
              resolve(false)
            }
          },
        })
      })
    },

    // =====================================================
    // COBRAR
    // =====================================================

    async cobrar() {

      try {

        if (this.carrito.length <= 0) {

          Swal.fire({
            icon: 'warning',
            title: 'Carrito vacío',
          })

          return
        }

        const total = this.totalCarrito

        // =================================================
        // MÉTODO DE PAGO
        // =================================================

        const metodoPago =
          await new Promise((resolve) => {

            let seleccionado = false

            Swal.fire({

              title: 'Método de pago',

              html: `
                <div
                  style="
                    display:flex;
                    flex-direction:column;
                    gap:12px;
                    margin-top:15px;
                  "
                >

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
                  .onclick = async () => {

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

        // =================================================
        // EFECTIVO
        // =================================================

        if (metodoPago === 'efectivo') {

          await api.post(
            '/pagos/efectivo',
            {
              total,
            }
          )
        }

        // =================================================
        // QR
        // =================================================

        if (metodoPago === 'qr') {

          const aprobado =
            await this.pagarConQR(
              total,
              'Compra en POS'
            )

          if (!aprobado) return
        }

        // =================================================
        // CREAR VENTA
        // =================================================

        await api.post('/ventas/simple', {

          empleadoId: 1,

          items: this.carrito.map((item) => ({
            productoId: item.id,
            cantidad: item.cantidad,
          })),
        })

        // =================================================
        // SUCCESS
        // =================================================

        await Swal.fire({

          icon: 'success',

          title: 'Venta realizada',

          html: `
            <div style="font-size:14px">

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

          timer: 2400,

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
            'No se pudo procesar la venta',
        })
      }
    },
  },
})
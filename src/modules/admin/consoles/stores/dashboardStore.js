import { defineStore } from 'pinia'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    stats: {
      consolasActivas: 4,
      rentasHoy: 12,
      clientesHoy: 9,
      productosVendidos: 27,
    },
    ingresosDelDia: 1850,
    rentasActivas: [
      { id: 1, consola: 'PS5',       cliente: 'Carlos M.',   inicio: '10:00', duracion: '2h',  monto: 120 },
      { id: 2, consola: 'Xbox S/X',  cliente: 'Ana R.',      inicio: '11:30', duracion: '1h',  monto: 60  },
      { id: 3, consola: 'Nintendo',  cliente: 'Luis P.',     inicio: '12:00', duracion: '3h',  monto: 150 },
      { id: 4, consola: 'PS4',       cliente: 'Sofía G.',    inicio: '13:15', duracion: '2h',  monto: 100 },
    ],
    ultimasVentas: [
      { id: 1, producto: 'Coca-Cola 600ml', cantidad: 2, total: 40  },
      { id: 2, producto: 'Doritos',         cantidad: 3, total: 45  },
      { id: 3, producto: 'Agua 1L',         cantidad: 1, total: 15  },
      { id: 4, producto: 'Control extra',   cantidad: 1, total: 50  },
    ],
    alertas: [
      { id: 1, tipo: 'warning', mensaje: 'Control de PS5 con batería baja'     },
      { id: 2, tipo: 'danger',  mensaje: 'Renta #2 por vencer en 10 min'       },
      { id: 3, tipo: 'info',    mensaje: '3 consolas sin renta disponibles'    },
    ],
  }),

  getters: {
    totalIngresos: (state) =>
      `$${state.ingresosDelDia.toLocaleString('es-MX')}`,
  },
})
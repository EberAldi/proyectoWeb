// stores/juegosStore.js
import { defineStore } from 'pinia'

export const useJuegosStore = defineStore('juegos', {
  state: () => ({
    filtroActivo: 'todos',
    modalAbierto: false,

    consolas: [
      'PlayStation 5',
      'PlayStation 4',
      'Xbox Series X',
      'Xbox One',
      'Nintendo Switch',
      'PC',
    ],

    generos: [
      'Acción',
      'Aventura',
      'Deportes',
      'Carreras',
      'RPG',
      'Peleas',
      'Terror',
      'Estrategia',
      'Plataformas',
      'Disparos',
    ],

    juegos: [
      {
        id: 1,
        nombre: 'God of War Ragnarök',
        consola: 'PlayStation 5',
        genero: 'Acción',
        imagen: null,
        disponible: true,
        precioPorHora: 35,
        rentasHoy: 4,
      },
      {
        id: 2,
        nombre: 'FIFA 25',
        consola: 'PlayStation 5',
        genero: 'Deportes',
        imagen: null,
        disponible: false,
        precioPorHora: 30,
        rentasHoy: 7,
      },
      {
        id: 3,
        nombre: 'Forza Horizon 5',
        consola: 'Xbox Series X',
        genero: 'Carreras',
        imagen: null,
        disponible: true,
        precioPorHora: 30,
        rentasHoy: 2,
      },
      {
        id: 4,
        nombre: 'The Legend of Zelda: TotK',
        consola: 'Nintendo Switch',
        genero: 'Aventura',
        imagen: null,
        disponible: true,
        precioPorHora: 25,
        rentasHoy: 5,
      },
      {
        id: 5,
        nombre: 'Mortal Kombat 1',
        consola: 'PlayStation 5',
        genero: 'Peleas',
        imagen: null,
        disponible: false,
        precioPorHora: 30,
        rentasHoy: 6,
      },
      {
        id: 6,
        nombre: 'Minecraft',
        consola: 'PC',
        genero: 'Aventura',
        imagen: null,
        disponible: true,
        precioPorHora: 20,
        rentasHoy: 1,
      },
    ],
  }),

  getters: {
    juegosFiltrados(state) {
      if (state.filtroActivo === 'todos') return state.juegos
      if (state.filtroActivo === 'disponible')
        return state.juegos.filter((j) => j.disponible)
      if (state.filtroActivo === 'ocupado')
        return state.juegos.filter((j) => !j.disponible)
      return state.juegos
    },

    resumen(state) {
      return {
        total: state.juegos.length,
        disponibles: state.juegos.filter((j) => j.disponible).length,
        ocupados: state.juegos.filter((j) => !j.disponible).length,
      }
    },

    ingresosEstimados(state) {
      const total = state.juegos.reduce(
        (acc, j) => acc + j.precioPorHora * j.rentasHoy,
        0,
      )
      return `$${total.toLocaleString('es-MX')}`
    },

    iconoConsola() {
      return (consola) => {
        const mapa = {
          'PlayStation 5': 'fa-brands fa-playstation',
          'PlayStation 4': 'fa-brands fa-playstation',
          'Xbox Series X': 'fa-brands fa-xbox',
          'Xbox One': 'fa-brands fa-xbox',
          'Nintendo Switch': 'gamepad',
          PC: 'desktop',
        }
        return mapa[consola] ?? 'gamepad'
      }
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

    agregarJuego(datos) {
      const nuevoId = this.juegos.length
        ? Math.max(...this.juegos.map((j) => j.id)) + 1
        : 1

      this.juegos.push({
        id: nuevoId,
        nombre: datos.nombre,
        consola: datos.consola,
        genero: datos.genero,
        imagen: datos.imagen ?? null,
        disponible: datos.disponible,
        precioPorHora: Number(datos.precioPorHora),
        rentasHoy: 0,
      })

      this.cerrarModal()
    },

    toggleDisponibilidad(id) {
      const juego = this.juegos.find((j) => j.id === id)
      if (juego) juego.disponible = !juego.disponible
    },

    eliminarJuego(id) {
      this.juegos = this.juegos.filter((j) => j.id !== id)
    },
  },
})
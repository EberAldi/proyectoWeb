<template>
  <div class="container py-4">
    <div
      class="d-flex align-items-center justify-content-between mb-4"
    >
      <div>
        <h2 class="fw-black mb-0">
          Sesiones activas
        </h2>

        <p class="text-secondary mb-0">
          Monitoreo en tiempo real
        </p>
      </div>

      <div
        class="badge rounded-pill text-bg-success px-3 py-2"
      >
        {{ store.activas.length }} activas
      </div>
    </div>

    <div
      v-if="store.loading"
      class="text-center py-5"
    >
      Cargando...
    </div>

    <div
      v-else
      class="row g-3"
    >
      <div
        v-for="sesion in store.activas"
        :key="sesion.id"
        class="col-12 col-lg-6"
      >
        <div
          class="bg-white rounded-4 shadow-sm p-4 h-100"
        >
          <!-- TOP -->
          <div
            class="d-flex justify-content-between align-items-start mb-3"
          >
            <div>
              <h5 class="fw-black mb-1">
                {{ sesion.consola.nombre }}
              </h5>

              <p class="text-secondary mb-0 small">
                {{ sesion.juego?.nombre || 'Sin juego' }}
              </p>
            </div>

            <span
              class="badge text-bg-warning"
            >
              Activa
            </span>
          </div>

          <!-- TIMER -->
          <div class="mb-3">
            <div
              class="d-flex justify-content-between mb-1"
            >
              <span class="small text-secondary">
                Tiempo restante
              </span>

              <span
                class="fw-black"
                style="color:#685aff"
              >
                {{ tiempoRestante(sesion) }}
              </span>
            </div>

            <div
              class="progress"
              style="height: 10px"
            >
              <div
  class="progress-bar"
  :style="{
    width:
      porcentajeRestante(sesion) + '%',

    background:
      store.colorRestante(sesion)
  }"
></div>
            </div>
          </div>

          <!-- INFO -->
          <div
            class="d-flex flex-column gap-1 small mb-4"
          >
            <div
              class="d-flex justify-content-between"
            >
              <span class="text-secondary">
                Inicio
              </span>

              <span class="fw-semibold">
                {{ formatFecha(sesion.inicio) }}
              </span>
            </div>

            <div
              class="d-flex justify-content-between"
            >
              <span class="text-secondary">
                Duración
              </span>

              <span class="fw-semibold">
                {{ sesion.duracionHoras }}h
              </span>
            </div>

            <div
              class="d-flex justify-content-between"
            >
              <span class="text-secondary">
                Precio/hora
              </span>

              <span class="fw-semibold">
                ${{ sesion.consola.precioPorHora }}
              </span>
            </div>
          </div>

          <!-- BOTONES -->
          <div class="d-flex gap-2">
            <button
              class="btn btn-primary flex-grow-1"
              @click="agregarHora(sesion.id)"
            >
              +1 hora
            </button>

            <button
              class="btn btn-success"
              @click="abrirCobro(sesion)"
            >
              Cobrar
            </button>

            <button
              class="btn btn-danger"
              @click="finalizar(sesion.id)"
            >
              Finalizar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <SesionCobro
    v-if="sesionCobro"
    :sesion="sesionCobro"
    @close="sesionCobro = null"
    @pagado="onPagado"
  />
</template>

<script setup>
import {
  onMounted,
  onUnmounted,
  ref,
} from 'vue'

import { useSesionesStore } from '../stores/sesionesStore'

import SesionCobro from './SesionCobro.vue'

const store = useSesionesStore()

const sesionCobro = ref(null)

let intervalTimer = null

onMounted(async () => {

  await store.obtenerActivas()

  store.iniciarAutoRefresh()

  intervalTimer = setInterval(() => {

    // fuerza render del contador
    store.activas = [...store.activas]

  }, 1000)
})

onUnmounted(() => {

  store.detenerAutoRefresh()

  clearInterval(intervalTimer)
})

function abrirCobro(sesion){

  sesionCobro.value = sesion
}

function tiempoRestante(sesion) {

  return store.tiempoRestante(sesion)
}

function porcentajeRestante(sesion) {

  return store.porcentajeRestante(sesion)
}

async function agregarHora(id) {

  await store.agregarHora(id)
}

async function finalizar(id) {

  await store.finalizarSesion(id)
}

function formatFecha(fecha) {

  return new Date(fecha).toLocaleTimeString()
}

function onPagado(){

  sesionCobro.value = null

  store.obtenerActivas()
}
</script>
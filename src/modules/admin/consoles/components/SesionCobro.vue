<template>

  <Teleport to="body">

    <div
      v-if="sesion"
      class="modal-backdrop"
    >

      <div
        class="modal-box bg-white rounded-4 p-4"
      >

        <div
          class="d-flex justify-content-between align-items-center mb-4"
        >

          <div>

            <h4 class="fw-black mb-0">
              Cobrar sesión
            </h4>

            <p class="text-secondary mb-0">
              {{ sesion.consola.nombre }}
            </p>

          </div>

          <button
            class="btn btn-sm btn-outline-secondary"
            @click="$emit('close')"
          >
            ✕
          </button>

        </div>

        <!-- RESUMEN -->
        <div class="mb-4">

          <div class="d-flex justify-content-between mb-2">
            <span>Horas</span>

            <b>
              {{ sesion.duracionHoras }}h
            </b>
          </div>

          <div class="d-flex justify-content-between mb-2">
            <span>Precio/hora</span>

            <b>
              ${{ sesion.consola.precioPorHora }}
            </b>
          </div>

          <hr>

          <div class="d-flex justify-content-between">
            <span class="fw-black">
              Total
            </span>

            <span
              class="fw-black fs-4"
              style="color:#685aff"
            >
              ${{ total }}
            </span>
          </div>

        </div>

        <!-- QR -->
        <div
          v-if="qrLink"
          class="text-center mb-4"
        >

          <img
            :src="qrLink"
            style="width:220px"
          >

          <p class="small text-secondary mt-2">
            Escanea para pagar
          </p>

          <a
            :href="paymentLink"
            target="_blank"
            class="btn btn-outline-primary w-100 mt-2"
          >
            Abrir pago
          </a>

        </div>

        <!-- BOTONES -->
        <div class="d-flex gap-2">

          <button
            class="btn btn-success flex-grow-1"
            @click="pagarEfectivo"
          >
            Efectivo
          </button>

          <button
            class="btn btn-primary flex-grow-1"
            @click="generarQR"
          >

            <span
              v-if="loadingQR"
            >
              Generando...
            </span>

            <span
              v-else
            >
              QR MercadoPago
            </span>

          </button>

        </div>

      </div>

    </div>

  </Teleport>

</template>

<script setup>
import {
  computed,
  ref,
} from 'vue'

import api
from '../../../../service/api.js'

const props = defineProps({
  sesion: Object,
})

const emit = defineEmits([
  'close',
  'pagado',
])

const qrLink = ref('')
const paymentLink = ref('')
const loadingQR = ref(false)

const total = computed(() => {

  return Number(
    (
      props.sesion.duracionHoras *
      props.sesion.consola.precioPorHora
    ).toFixed(2)
  )
})

async function pagarEfectivo() {

  try {

    await api.patch(
      `/pagos/sesiones/${props.sesion.id}/efectivo`
    )

    emit('pagado')

  } catch (error) {

    console.error(error)
  }
}

async function generarQR() {

  try {

    loadingQR.value = true

    const { data } = await api.post(
      `/pagos/sesiones/${props.sesion.id}/pago`
    )

    qrLink.value =
      data.qr

    paymentLink.value =
      data.initPoint

  } catch (error) {

    console.error(error)

  } finally {

    loadingQR.value = false
  }
}
</script>

<style scoped>
.modal-backdrop{
  position:fixed;
  inset:0;
  background:rgba(0,0,0,.6);
  display:flex;
  align-items:center;
  justify-content:center;
  z-index:9999;
}

.modal-box{
  width:100%;
  max-width:420px;
}
</style>
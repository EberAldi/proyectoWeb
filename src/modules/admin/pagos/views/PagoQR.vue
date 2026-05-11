<template>
  <div class="container-fluid py-4" style="max-width: 640px; margin: 0 auto">

    <!-- Título -->
    <header class="mb-4">
      <h2 class="fw-bold mb-1" style="color: #685aff">
        <font-awesome-icon icon="shopping-cart" class="me-2" />
        Pago con QR
      </h2>
      <p class="text-secondary small mb-0">Escanea el código QR con tu app de Mercado Pago</p>
    </header>

    <!-- PASO 1: Formulario para generar el QR -->
    <section v-if="!qrData" class="bg-white rounded-4 shadow-sm p-4 mb-4">
      <h5 class="fw-semibold mb-3" style="color: #685aff">Detalle del pago</h5>

      <div class="mb-3">
        <label class="form-label text-secondary fw-medium small">Descripción</label>
        <input
          v-model="form.description"
          type="text"
          class="form-control"
          placeholder="Ej: Renta de consola PS5 - 2 horas"
          :disabled="isLoading"
        />
      </div>

      <div class="mb-3">
        <label class="form-label text-secondary fw-medium small">Monto (MXN)</label>
        <div class="input-group">
          <span class="input-group-text">$</span>
          <input
            v-model.number="form.amount"
            type="number"
            min="1"
            class="form-control"
            placeholder="0.00"
            :disabled="isLoading"
          />
        </div>
      </div>

      <div class="mb-4">
        <label class="form-label text-secondary fw-medium small">Referencia (opcional)</label>
        <input
          v-model="form.externalReference"
          type="text"
          class="form-control"
          placeholder="Ej: ORDEN-001"
          :disabled="isLoading"
        />
      </div>

      <div class="d-grid">
        <button
          class="btn text-white fw-semibold py-2 d-flex justify-content-center align-items-center gap-2"
          style="background: #685aff"
          :disabled="isLoading || !form.amount || !form.description"
          @click="generarQR"
        >
          <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status" />
          <template v-else>
            <font-awesome-icon icon="tag" />
            Generar QR de pago
          </template>
        </button>
      </div>
    </section>

    <!-- PASO 2: QR generado -->
    <section v-if="qrData" class="bg-white rounded-4 shadow-sm p-4 mb-4 text-center">

      <!-- Estado del pago -->
      <div
        class="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-4 small fw-semibold"
        :class="estadoClase"
      >
        <span class="dot" :class="dotClase"></span>
        {{ estadoTexto }}
      </div>

      <!-- QR Image -->
      <div class="d-flex justify-content-center mb-4">
        <div class="p-3 rounded-4 shadow-sm border" style="background: #fff; display: inline-block">
          <img
            v-if="qrData.qr_data"
            :src="`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrData.qr_data)}`"
            alt="Código QR Mercado Pago"
            width="220"
            height="220"
            class="d-block"
          />
          <!-- Si el back devuelve base64 directamente -->
          <img
            v-else-if="qrData.qr_image"
            :src="`data:image/png;base64,${qrData.qr_image}`"
            alt="Código QR Mercado Pago"
            width="220"
            height="220"
            class="d-block"
          />
        </div>
      </div>

      <!-- Info del pago -->
      <p class="fw-semibold fs-5 mb-1" style="color: #333">{{ qrData.description ?? form.description }}</p>
      <p class="fw-bold fs-3 mb-3" style="color: #685aff">
        ${{ (qrData.amount ?? form.amount).toLocaleString('es-MX', { minimumFractionDigits: 2 }) }} MXN
      </p>

      <p class="text-secondary small mb-4">
        <font-awesome-icon icon="clock" class="me-1" />
        Esperando pago... (se actualiza automáticamente)
      </p>

      <!-- Logo MP -->
      <div class="d-flex align-items-center justify-content-center gap-2 mb-4">
        <svg width="20" height="20" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="#009EE3"/>
          <path d="M8 16c0-4.418 3.582-8 8-8s8 3.582 8 8" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="16" cy="16" r="2.5" fill="#fff"/>
        </svg>
        <span class="small text-secondary">Pago seguro con <strong>Mercado Pago</strong></span>
      </div>

      <!-- Acciones -->
      <div class="d-flex gap-2 justify-content-center flex-wrap">
        <button
          class="btn btn-outline-secondary btn-sm px-3"
          @click="resetear"
        >
          Nuevo pago
        </button>
        <button
          class="btn btn-sm px-3 text-white"
          style="background: #685aff"
          :disabled="verificando"
          @click="verificarEstado"
        >
          <span v-if="verificando" class="spinner-border spinner-border-sm me-1" />
          Verificar estado
        </button>
      </div>
    </section>

    <!-- Alerta de error -->
    <div v-if="error" class="alert alert-danger rounded-3 small">
      <strong>Error:</strong> {{ error }}
    </div>

  </div>
</template>

<script>
import api from '@/service/api'

export default {
  name: 'PagoQR',

  // Puedes recibir props desde el componente padre si ya tienes el monto/descripción
  props: {
    montoInicial: { type: Number, default: null },
    descripcionInicial: { type: String, default: '' },
  },

  data() {
    return {
      form: {
        description: this.descripcionInicial || '',
        amount: this.montoInicial || null,
        externalReference: '',
      },
      qrData: null,
      estado: 'pendiente', // pendiente | aprobado | rechazado
      isLoading: false,
      verificando: false,
      pollingInterval: null,
      error: null,
    }
  },

  computed: {
    estadoTexto() {
      const map = {
        pendiente: '⏳ Esperando pago',
        aprobado: '✅ Pago aprobado',
        rechazado: '❌ Pago rechazado',
      }
      return map[this.estado] ?? 'Desconocido'
    },
    estadoClase() {
      return {
        pendiente: 'bg-warning bg-opacity-25 text-warning-emphasis',
        aprobado: 'bg-success bg-opacity-25 text-success',
        rechazado: 'bg-danger bg-opacity-25 text-danger',
      }[this.estado]
    },
    dotClase() {
      return {
        pendiente: 'bg-warning',
        aprobado: 'bg-success',
        rechazado: 'bg-danger',
      }[this.estado]
    },
  },

  beforeUnmount() {
    this.detenerPolling()
  },

  methods: {
    async generarQR() {
      if (!this.form.amount || !this.form.description) return
      this.isLoading = true
      this.error = null

      try {
        // ⬇️ Ajusta el endpoint al que usa tu backend de Mercado Pago
        const { data } = await api.post('/api/mercadopago/qr/', {
          description: this.form.description,
          amount: this.form.amount,
          external_reference: this.form.externalReference || undefined,
        })

        this.qrData = data
        this.estado = 'pendiente'
        this.iniciarPolling()
      } catch (err) {
        console.error(err)
        this.error = err?.response?.data?.detail ?? 'No se pudo generar el QR. Verifica el servicio de Mercado Pago.'
      } finally {
        this.isLoading = false
      }
    },

    async verificarEstado() {
      if (!this.qrData?.order_id && !this.qrData?.external_reference) return
      this.verificando = true

      try {
        // ⬇️ Ajusta el endpoint de verificación al de tu backend
        const { data } = await api.get(`/api/mercadopago/status/${this.qrData.order_id ?? this.form.externalReference}/`)
        this.estado = data.status // 'pendiente' | 'aprobado' | 'rechazado'

        if (this.estado === 'aprobado' || this.estado === 'rechazado') {
          this.detenerPolling()
        }
      } catch (err) {
        console.error(err)
      } finally {
        this.verificando = false
      }
    },

    iniciarPolling() {
      // Verifica el estado cada 5 segundos automáticamente
      this.pollingInterval = setInterval(async () => {
        await this.verificarEstado()
        if (this.estado === 'aprobado' || this.estado === 'rechazado') {
          this.detenerPolling()
        }
      }, 5000)
    },

    detenerPolling() {
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval)
        this.pollingInterval = null
      }
    },

    resetear() {
      this.detenerPolling()
      this.qrData = null
      this.estado = 'pendiente'
      this.error = null
      this.form.externalReference = ''
      if (!this.montoInicial) this.form.amount = null
      if (!this.descripcionInicial) this.form.description = ''
    },
  },
}
</script>

<style scoped>
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

section {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>

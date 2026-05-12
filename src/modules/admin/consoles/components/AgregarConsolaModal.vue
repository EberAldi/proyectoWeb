<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="modal-backdrop"
      @click.self="cerrar"
    >
      <div class="modal-card">

        <!-- Header -->
        <header class="modal-header-custom">
          <div class="d-flex align-items-center gap-3">
            <div class="modal-icon">
              <font-awesome-icon icon="gamepad" />
            </div>
            <div>
              <h2 class="modal-title-custom">Nueva Consola</h2>
              <p class="modal-subtitle">Completa los datos y agrega los controles</p>
            </div>
          </div>
          <button class="btn-close-custom" @click="cerrar">
            <font-awesome-icon icon="xmark" />
          </button>
        </header>

        <!-- Body -->
        <div class="modal-body-custom">

          <!-- Nombre -->
          <div class="field-group">
            <label class="field-label">Nombre</label>
            <input
              v-model="form.nombre"
              type="text"
              class="field-input"
              :class="{ 'field-input--error': errors.nombre }"
              placeholder="Ej. PlayStation 5 #1"
              @input="errors.nombre = ''"
            />
            <span v-if="errors.nombre" class="field-error">{{ errors.nombre }}</span>
          </div>

          <!-- Marca -->
          <div class="field-group">
            <label class="field-label">Marca</label>
            <div class="marca-grid">
              <button
                v-for="marca in marcas"
                :key="marca"
                type="button"
                class="marca-btn"
                :class="{ 'marca-btn--active': form.marca === marca }"
                @click="form.marca = marca; errors.marca = ''"
              >
                {{ marca }}
              </button>
            </div>
            <input
              v-if="form.marca === 'Otra'"
              v-model="form.marcaCustom"
              type="text"
              class="field-input mt-2"
              placeholder="Escribe la marca"
            />
            <span v-if="errors.marca" class="field-error">{{ errors.marca }}</span>
          </div>

          <!-- Precio por hora -->
          <div class="field-group">
            <label class="field-label">Precio por hora</label>
            <div class="input-prefix-wrap">
              <span class="input-prefix">$</span>
              <input
                v-model.number="form.precioPorHora"
                type="number"
                min="0"
                class="field-input field-input--prefix"
                :class="{ 'field-input--error': errors.precioPorHora }"
                placeholder="0"
                @input="errors.precioPorHora = ''"
              />
            </div>
            <span v-if="errors.precioPorHora" class="field-error">{{ errors.precioPorHora }}</span>
          </div>

          <!-- Controles -->
          <div class="field-group">
            <label class="field-label">Controles</label>
            <p class="field-hint">Agrega los controles físicos que tiene esta consola</p>

            <div class="controles-list">
              <div
                v-for="(ctrl, i) in form.controles"
                :key="i"
                class="control-row"
              >
                <div class="control-number">{{ i + 1 }}</div>
                <div class="control-estado-group">
                  <button
                    type="button"
                    class="estado-btn"
                    :class="{ 'estado-btn--active': ctrl.estado === 'disponible' }"
                    @click="ctrl.estado = 'disponible'"
                  >
                    <span class="estado-dot estado-dot--disponible"></span>
                    Disponible
                  </button>
                  <button
                    type="button"
                    class="estado-btn"
                    :class="{ 'estado-btn--danado': ctrl.estado === 'dañado' }"
                    @click="ctrl.estado = 'dañado'"
                  >
                    <span class="estado-dot estado-dot--danado"></span>
                    Dañado
                  </button>
                </div>
                <button
                  type="button"
                  class="btn-remove-control"
                  @click="quitarControl(i)"
                >
                  <font-awesome-icon icon="trash" />
                </button>
              </div>

              <div v-if="form.controles.length === 0" class="controles-empty">
                Sin controles asignados
              </div>
            </div>

            <button type="button" class="btn-add-control" @click="agregarControl">
              <font-awesome-icon icon="plus" />
              Agregar control
            </button>
          </div>
        </div>

        <!-- Footer -->
        <footer class="modal-footer-custom">
          <button class="btn-cancel" @click="cerrar">Cancelar</button>
          <button class="btn-submit" :disabled="store.isLoading" @click="guardar">
            <span v-if="store.isLoading" class="spinner-border spinner-border-sm me-2" />
            <font-awesome-icon v-else icon="floppy-disk" class="me-2" />
            Guardar consola
          </button>
        </footer>

      </div>
    </div>
  </Teleport>
</template>

<script>
import { useConsolasStore } from '../stores/consolasStore'

export default {
  name: 'AgregarConsolaModal',

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['close'],

  setup() {
    const store = useConsolasStore()
    return { store }
  },

  data() {
    return {
      marcas: ['Sony', 'Microsoft', 'Nintendo', 'Otra'],
      form: {
        nombre: '',
        marca: '',
        marcaCustom: '',
        precioPorHora: null,
        controles: [],
      },
      errors: {
        nombre: '',
        marca: '',
        precioPorHora: '',
      },
    }
  },

  methods: {
    agregarControl() {
      this.form.controles.push({ estado: 'disponible' })
    },

    quitarControl(i) {
      this.form.controles.splice(i, 1)
    },

    validar() {
      let ok = true
      if (!this.form.nombre.trim()) {
        this.errors.nombre = 'El nombre es requerido'
        ok = false
      }
      const marcaFinal = this.form.marca === 'Otra' ? this.form.marcaCustom : this.form.marca
      if (!marcaFinal.trim()) {
        this.errors.marca = 'Selecciona o escribe una marca'
        ok = false
      }
      if (!this.form.precioPorHora || this.form.precioPorHora <= 0) {
        this.errors.precioPorHora = 'Ingresa un precio válido'
        ok = false
      }
      return ok
    },

    async guardar() {
      if (!this.validar()) return

      const marcaFinal = this.form.marca === 'Otra' ? this.form.marcaCustom : this.form.marca

      await this.store.crearConsola(
        {
          nombre: this.form.nombre.trim(),
          marca: marcaFinal.trim(),
          precioPorHora: this.form.precioPorHora,
        },
        this.form.controles,
      )

      this.cerrar()
    },

    cerrar() {
      this.form = { nombre: '', marca: '', marcaCustom: '', precioPorHora: null, controles: [] }
      this.errors = { nombre: '', marca: '', precioPorHora: '' }
      this.$emit('close')
    },
  },
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 10, 40, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  padding: 1rem;
}

.modal-card {
  background: #fff;
  border-radius: 1.25rem;
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(104, 90, 255, 0.18);
}

/* Header */
.modal-header-custom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #f0eeff;
}
.modal-icon {
  width: 44px;
  height: 44px;
  background: #685aff;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.1rem;
  flex-shrink: 0;
}
.modal-title-custom {
  font-size: 1rem;
  font-weight: 900;
  color: #1a1235;
  margin: 0;
  line-height: 1.2;
}
.modal-subtitle {
  font-size: 0.7rem;
  color: #9ca3af;
  margin: 0;
}
.btn-close-custom {
  border: none;
  background: #f3f4f6;
  color: #6b7280;
  width: 32px;
  height: 32px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s;
}
.btn-close-custom:hover { background: #e5e7eb; color: #374151; }

/* Body */
.modal-body-custom {
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Fields */
.field-group { display: flex; flex-direction: column; gap: 0.375rem; }
.field-label { font-size: 0.8rem; font-weight: 700; color: #374151; }
.field-hint { font-size: 0.7rem; color: #9ca3af; margin: 0; }
.field-error { font-size: 0.7rem; color: #ef4444; }

.field-input {
  border: 1.5px solid #e5e7eb;
  border-radius: 0.625rem;
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  width: 100%;
}
.field-input:focus { border-color: #685aff; box-shadow: 0 0 0 3px rgba(104,90,255,0.1); }
.field-input--error { border-color: #ef4444; }
.field-input--prefix { padding-left: 2.25rem; }

.input-prefix-wrap { position: relative; }
.input-prefix {
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.875rem;
  font-weight: 700;
  color: #685aff;
}

/* Marcas */
.marca-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}
.marca-btn {
  border: 1.5px solid #e5e7eb;
  background: #fff;
  border-radius: 0.625rem;
  padding: 0.5rem 0.25rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s;
}
.marca-btn:hover { border-color: #685aff; color: #685aff; }
.marca-btn--active {
  border-color: #685aff;
  background: #ede9ff;
  color: #685aff;
}

/* Controles */
.controles-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}
.controles-empty {
  text-align: center;
  font-size: 0.78rem;
  color: #d1d5db;
  padding: 1rem;
  border: 1.5px dashed #e5e7eb;
  border-radius: 0.625rem;
}
.control-row {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  background: #fafafa;
  border: 1.5px solid #f0eeff;
  border-radius: 0.625rem;
  padding: 0.5rem 0.75rem;
}
.control-number {
  width: 24px;
  height: 24px;
  background: #685aff;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 800;
  flex-shrink: 0;
}
.control-estado-group { display: flex; gap: 0.375rem; flex: 1; }
.estado-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  border-radius: 0.5rem;
  padding: 0.3rem 0.625rem;
  font-size: 0.72rem;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s;
}
.estado-btn--active { border-color: #22c55e; background: #f0fdf4; color: #22c55e; }
.estado-btn--danado { border-color: #ef4444; background: #fef2f2; color: #ef4444; }
.estado-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}
.estado-dot--disponible { background: #22c55e; }
.estado-dot--danado { background: #ef4444; }
.btn-remove-control {
  border: none;
  background: #fee2e2;
  color: #ef4444;
  width: 28px;
  height: 28px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.7rem;
  flex-shrink: 0;
  transition: background 0.15s;
}
.btn-remove-control:hover { background: #fecaca; }
.btn-add-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1.5px dashed #685aff;
  background: transparent;
  color: #685aff;
  border-radius: 0.625rem;
  padding: 0.5rem 1rem;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  width: 100%;
  justify-content: center;
  transition: background 0.15s;
}
.btn-add-control:hover { background: #ede9ff; }

/* Footer */
.modal-footer-custom {
  padding: 1.25rem 1.5rem;
  border-top: 1px solid #f0eeff;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}
.btn-cancel {
  border: 1.5px solid #e5e7eb;
  background: #fff;
  color: #6b7280;
  border-radius: 0.625rem;
  padding: 0.6rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-cancel:hover { background: #f9fafb; }
.btn-submit {
  background: #685aff;
  border: none;
  color: #fff;
  border-radius: 0.625rem;
  padding: 0.6rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: opacity 0.15s;
}
.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-submit:not(:disabled):hover { opacity: 0.9; }
</style>
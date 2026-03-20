<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="pos.modalAbierto"
        class="modal-backdrop d-flex align-items-center justify-content-center p-3"
        @click.self="pos.cerrarVenta()"
      >
        <div class="modal-box rounded-4 shadow-lg overflow-hidden d-flex flex-column">

          <!-- Header -->
          <header
            class="d-flex align-items-center justify-content-between px-4 py-3 flex-shrink-0"
            style="background: linear-gradient(135deg, #685aff, #9ccfff)"
          >
            <div class="d-flex align-items-center gap-3">
              <div
                class="rounded-3 d-flex align-items-center justify-content-center bg-white shadow-sm"
                style="width: 40px; height: 40px; flex-shrink: 0"
              >
                <font-awesome-icon icon="gamepad" style="color: #685aff" />
              </div>
              <div>
                <p class="fw-black text-white mb-0 small">{{ pos.ventaActiva?.nombre }}</p>
                <p class="mb-0 text-white" style="font-size: 0.7rem; opacity: 0.8">
                  {{ pos.ventaActiva?.marca }} · ${{ pos.ventaActiva?.precioPorHora }}/hr
                </p>
              </div>
            </div>
            <button
              class="btn btn-sm text-white"
              style="background: rgba(255,255,255,0.2)"
              @click="pos.cerrarVenta()"
            >
              <font-awesome-icon icon="times" />
            </button>
          </header>

          <!-- Body -->
          <div class="d-flex flex-column flex-lg-row overflow-hidden flex-grow-1">

            <!-- Izquierda: consola + juegos + menú -->
            <div class="d-flex flex-column overflow-auto p-4 gap-4" style="flex: 1; min-width: 0">

              <!-- Consola preview -->
              <div
                class="rounded-4 overflow-hidden position-relative d-flex align-items-center justify-content-center"
                :style="{ height: '160px', background: consolaBrand.gradient }"
              >
                <div class="brand-glow position-absolute" :style="{ background: consolaBrand.glow }"></div>

                <!-- Imagen real; si falla carga el SVG de respaldo -->
                <img
                  v-if="!imgError"
                  :src="consolaBrand.img"
                  :alt="pos.ventaActiva?.nombre"
                  class="consola-img position-relative"
                  style="object-fit: contain; height: 140px; filter: drop-shadow(0 0 20px rgba(0,0,0,0.4))"
                  @error="imgError = true"
                />
                <div
                  v-else
                  v-html="consolaBrand.svgHtml"
                  class="consola-svg-wrap position-relative"
                ></div>

                <div
                  class="position-absolute bottom-0 start-0 end-0 px-3 py-2"
                  style="background: linear-gradient(transparent, rgba(0,0,0,0.5))"
                >
                  <span class="text-white fw-black small">{{ pos.ventaActiva?.nombre }}</span>
                </div>
              </div>

              <!-- ─── CARRUSEL DE JUEGOS ─── -->
              <div>
                <p class="small fw-black text-secondary text-uppercase mb-2" style="letter-spacing: 0.05em">
                  🎮 Juegos disponibles
                </p>

                <!-- Tabs por plataforma/género -->
                <div class="d-flex gap-2 mb-3 flex-wrap">
                  <button
                    v-for="tab in juegosTabs"
                    :key="tab.value"
                    class="btn btn-sm rounded-pill fw-semibold"
                    :class="juegoTabActivo === tab.value ? 'text-white' : 'text-secondary'"
                    :style="juegoTabActivo === tab.value
                      ? { backgroundColor: '#685aff' }
                      : { backgroundColor: '#f3f4f6' }"
                    @click="juegoTabActivo = tab.value"
                  >
                    {{ tab.emoji }} {{ tab.label }}
                  </button>
                </div>

                <!-- Carrusel -->
                <div class="carrusel-wrapper position-relative">
                  <!-- Flecha izq -->
                  <button
                    v-if="puedeScrollIzq"
                    class="carrusel-arrow carrusel-arrow-left"
                    @click="scrollCarrusel(-1)"
                  >‹</button>

                  <div class="carrusel-track" ref="carruselRef">
                    <div
                      v-for="juego in juegosFiltrados"
                      :key="juego.id"
                      class="juego-card"
                      :class="{ 'juego-card-selected': juegoSeleccionado?.id === juego.id }"
                      @click="seleccionarJuego(juego)"
                    >
                      <!-- Portada con gradiente de color de marca -->
                      <div
                        class="juego-cover d-flex align-items-center justify-content-center"
                        :style="{ background: juego.gradient }"
                      >
                        <span style="font-size: 2.2rem">{{ juego.emoji }}</span>
                        <div v-if="juegoSeleccionado?.id === juego.id" class="juego-check">✓</div>
                      </div>
                      <div class="juego-info">
                        <p class="mb-0 fw-bold text-dark" style="font-size: 0.68rem; line-height: 1.2">{{ juego.nombre }}</p>
                        <p class="mb-0 text-secondary" style="font-size: 0.62rem">{{ juego.genero }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Flecha der -->
                  <button
                    v-if="puedeScrollDer"
                    class="carrusel-arrow carrusel-arrow-right"
                    @click="scrollCarrusel(1)"
                  >›</button>
                </div>

                <!-- Juego seleccionado info -->
                <Transition name="fade">
                  <div
                    v-if="juegoSeleccionado"
                    class="mt-2 px-3 py-2 rounded-3 d-flex align-items-center gap-3"
                    style="background: #f0eeff; border: 1.5px solid #685aff33"
                  >
                    <span style="font-size: 1.6rem">{{ juegoSeleccionado.emoji }}</span>
                    <div class="flex-grow-1">
                      <p class="mb-0 fw-black text-dark" style="font-size: 0.75rem">{{ juegoSeleccionado.nombre }}</p>
                      <p class="mb-0 text-secondary" style="font-size: 0.68rem">{{ juegoSeleccionado.descripcion }}</p>
                    </div>
                    <button
                      class="btn btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center flex-shrink-0"
                      style="width: 24px; height: 24px; background: #685aff33; color: #685aff; font-size: 0.8rem"
                      @click="juegoSeleccionado = null"
                    >✕</button>
                  </div>
                </Transition>
              </div>

              <!-- Duración -->
              <div>
                <p class="small fw-black text-secondary text-uppercase mb-2" style="letter-spacing: 0.05em">
                  Duración de renta
                </p>
                <div class="d-flex gap-2 flex-wrap">
                  <button
                    v-for="h in [1, 2, 3, 4]"
                    :key="h"
                    class="btn btn-sm fw-bold rounded-3"
                    :class="duracion === h ? 'text-white' : 'btn-outline-secondary'"
                    :style="duracion === h ? { backgroundColor: '#685aff', borderColor: '#685aff' } : {}"
                    @click="duracion = h"
                  >
                    {{ h }}h — ${{ pos.ventaActiva?.precioPorHora * h }}
                  </button>
                </div>
              </div>

              <!-- Menú extras -->
              <div>
                <p class="small fw-black text-secondary text-uppercase mb-2" style="letter-spacing: 0.05em">
                  Menú
                </p>
                <div class="d-flex gap-2 mb-3 flex-wrap">
                  <button
                    v-for="cat in categorias"
                    :key="cat.value"
                    class="btn btn-sm rounded-pill fw-semibold"
                    :class="categoriaActiva === cat.value ? 'text-white' : 'text-secondary'"
                    :style="categoriaActiva === cat.value
                      ? { backgroundColor: '#685aff' }
                      : { backgroundColor: '#f3f4f6' }"
                    @click="categoriaActiva = cat.value"
                  >
                    {{ cat.emoji }} {{ cat.label }}
                  </button>
                </div>
                <div class="row g-2">
                  <div v-for="item in menuFiltrado" :key="item.id" class="col-6">
                    <div
                      class="rounded-3 p-3 d-flex align-items-center justify-content-between menu-item"
                      :class="pos.itemEnCarrito(item.id) ? 'menu-item-active' : ''"
                    >
                      <div class="d-flex align-items-center gap-2">
                        <span style="font-size: 1.4rem">{{ item.emoji }}</span>
                        <div>
                          <p class="mb-0 fw-semibold text-dark" style="font-size: 0.72rem; line-height: 1.2">{{ item.nombre }}</p>
                          <p class="mb-0 fw-black" style="font-size: 0.75rem; color: #685aff">${{ item.precio }}</p>
                        </div>
                      </div>
                      <div v-if="pos.itemEnCarrito(item.id)" class="d-flex align-items-center gap-1">
                        <button
                          class="btn-contador"
                          @click="pos.quitarItem(item.id)"
                        >−</button>
                        <span class="fw-black small">{{ pos.itemEnCarrito(item.id).cantidad }}</span>
                        <button
                          class="btn-contador"
                          @click="pos.agregarItem(item)"
                        >+</button>
                      </div>
                      <button
                        v-else
                        class="btn-agregar"
                        @click="pos.agregarItem(item)"
                      >+</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Derecha: ticket -->
            <div
              class="d-flex flex-column flex-shrink-0"
              style="width: 260px; border-left: 1px solid #f0f0f0; background: #fafafa"
            >
              <div class="px-4 py-3 border-bottom">
                <p class="fw-black text-dark small mb-0">
                  <font-awesome-icon icon="receipt" class="me-2" style="color: #685aff" />
                  Ticket
                </p>
              </div>

              <div class="flex-grow-1 overflow-auto px-4 py-3 d-flex flex-column gap-2">
                <!-- Renta -->
                <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
                  <div>
                    <p class="mb-0 small fw-semibold text-dark">{{ pos.ventaActiva?.nombre }}</p>
                    <p class="mb-0 text-secondary" style="font-size: 0.7rem">{{ duracion }}h de renta</p>
                  </div>
                  <span class="fw-black small" style="color: #685aff">
                    ${{ pos.ventaActiva?.precioPorHora * duracion }}
                  </span>
                </div>

                <!-- Juego seleccionado en ticket -->
                <div v-if="juegoSeleccionado" class="d-flex justify-content-between align-items-center py-1 border-bottom">
                  <div class="d-flex align-items-center gap-2">
                    <span>{{ juegoSeleccionado.emoji }}</span>
                    <p class="mb-0 small text-dark" style="font-size: 0.72rem">{{ juegoSeleccionado.nombre }}</p>
                  </div>
                  <span class="small text-secondary">incluido</span>
                </div>

                <!-- Extras carrito -->
                <div
                  v-for="item in pos.carrito"
                  :key="item.id"
                  class="d-flex justify-content-between align-items-center"
                >
                  <div class="d-flex align-items-center gap-2">
                    <span style="font-size: 1rem">{{ item.emoji }}</span>
                    <div>
                      <p class="mb-0 small text-dark" style="font-size: 0.72rem">{{ item.nombre }}</p>
                      <p class="mb-0 text-secondary" style="font-size: 0.68rem">x{{ item.cantidad }}</p>
                    </div>
                  </div>
                  <span class="small fw-semibold text-dark">${{ item.precio * item.cantidad }}</span>
                </div>

                <p
                  v-if="pos.carrito.length === 0 && !juegoSeleccionado"
                  class="text-secondary text-center mt-3"
                  style="font-size: 0.75rem"
                >
                  Sin extras por ahora
                </p>
              </div>

              <!-- Total + cobrar -->
              <div class="px-4 py-3 border-top">
                <div class="d-flex justify-content-between mb-1">
                  <span class="small text-secondary">Renta</span>
                  <span class="small fw-semibold">${{ pos.ventaActiva?.precioPorHora * duracion }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span class="small text-secondary">Extras</span>
                  <span class="small fw-semibold">${{ pos.totalCarrito }}</span>
                </div>
                <div
                  class="d-flex justify-content-between p-2 rounded-3 mb-3"
                  style="background: #f0ffc3"
                >
                  <span class="fw-black small" style="color: #685aff">Total</span>
                  <span class="fw-black" style="color: #685aff">
                    ${{ pos.totalConRenta(pos.ventaActiva?.precioPorHora * duracion) }}
                  </span>
                </div>

                <button
                  class="btn w-100 fw-black text-white rounded-3"
                  style="background: linear-gradient(135deg, #685aff, #9ccfff)"
                  @click="pos.cobrar(duracion)"
                >
                  <font-awesome-icon icon="cash-register" class="me-2" />
                  Cobrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import { usePosStore } from '../stores/posStore'


const consolaImgs = {
  'PlayStation 5':      'https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.jpg',
  'PlayStation 4':      'https://images.igdb.com/igdb/image/upload/t_cover_big/co3wk8.jpg',
  'PlayStation 4 Slim': 'https://images.igdb.com/igdb/image/upload/t_cover_big/co3wk8.jpg',
  'Xbox Series X':      'https://images.igdb.com/igdb/image/upload/t_cover_big/co2tbd.jpg',
  'Xbox One':           'https://images.igdb.com/igdb/image/upload/t_cover_big/co3p2d.jpg',
  'Nintendo Switch':    'https://images.igdb.com/igdb/image/upload/t_cover_big/co1ld9.jpg',
}


const brandMap = {
  'PlayStation 5': {
    img: consolaImgs['PlayStation 5'],
    gradient: 'linear-gradient(135deg, #00439C 0%, #0070D1 60%, #003380 100%)',
    glow: 'radial-gradient(circle at 60% 40%, rgba(0,160,255,0.35) 0%, transparent 65%)',
    svgHtml: `<svg viewBox="0 0 200 120" width="200" height="120" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="75" width="140" height="28" rx="14" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
      <rect x="62" y="22" width="22" height="55" rx="11" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>
      <rect x="116" y="32" width="18" height="45" rx="9" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
      <text x="100" y="96" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="12" font-weight="bold" font-family="sans-serif">PS5</text>
    </svg>`,
  },
  'PlayStation 4': {
    img: consolaImgs['PlayStation 4'],
    gradient: 'linear-gradient(135deg, #00439C 0%, #0059B3 60%, #002966 100%)',
    glow: 'radial-gradient(circle at 50% 40%, rgba(0,120,255,0.3) 0%, transparent 65%)',
    svgHtml: `<svg viewBox="0 0 200 120" width="200" height="120" xmlns="http://www.w3.org/2000/svg">
      <rect x="35" y="45" width="130" height="45" rx="8" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
      <rect x="60" y="47" width="80" height="4" rx="2" fill="rgba(100,200,255,0.7)"/>
      <text x="100" y="75" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="12" font-weight="bold" font-family="sans-serif">PS4</text>
      <rect x="42" y="62" width="30" height="4" rx="2" fill="rgba(255,255,255,0.25)"/>
    </svg>`,
  },
  'PlayStation 4 Slim': {
    img: consolaImgs['PlayStation 4 Slim'],
    gradient: 'linear-gradient(135deg, #00439C 0%, #0059B3 60%, #002966 100%)',
    glow: 'radial-gradient(circle at 50% 40%, rgba(0,120,255,0.3) 0%, transparent 65%)',
    svgHtml: `<svg viewBox="0 0 200 120" width="200" height="120" xmlns="http://www.w3.org/2000/svg">
      <rect x="35" y="45" width="130" height="45" rx="8" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
      <rect x="60" y="47" width="80" height="4" rx="2" fill="rgba(100,200,255,0.7)"/>
      <text x="100" y="75" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="12" font-weight="bold" font-family="sans-serif">PS4 Slim</text>
    </svg>`,
  },
  'Xbox Series X': {
    img: consolaImgs['Xbox Series X'],
    gradient: 'linear-gradient(135deg, #0e5c0e 0%, #107C10 60%, #0a4a0a 100%)',
    glow: 'radial-gradient(circle at 50% 30%, rgba(30,220,30,0.3) 0%, transparent 65%)',
    svgHtml: `<svg viewBox="0 0 200 120" width="200" height="120" xmlns="http://www.w3.org/2000/svg">
      <rect x="55" y="18" width="90" height="88" rx="10" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
      <circle cx="100" cy="35" r="18" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
      <text x="100" y="40" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="16" font-weight="bold" font-family="sans-serif">X</text>
      <circle cx="100" cy="80" r="8" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>
    </svg>`,
  },
  'Xbox One': {
    img: consolaImgs['Xbox One'],
    gradient: 'linear-gradient(135deg, #0e5c0e 0%, #107C10 60%, #0a4a0a 100%)',
    glow: 'radial-gradient(circle at 50% 50%, rgba(30,220,30,0.25) 0%, transparent 65%)',
    svgHtml: `<svg viewBox="0 0 200 120" width="200" height="120" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="35" width="140" height="55" rx="6" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
      <rect x="30" y="35" width="60" height="55" rx="6" fill="rgba(0,0,0,0.15)"/>
      <circle cx="100" cy="62" r="14" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
      <text x="100" y="67" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="13" font-weight="bold" font-family="sans-serif">X</text>
      <rect x="38" y="58" width="38" height="5" rx="2.5" fill="rgba(255,255,255,0.2)"/>
    </svg>`,
  },
  'Nintendo Switch': {
    img: consolaImgs['Nintendo Switch'],
    gradient: 'linear-gradient(135deg, #C0001A 0%, #E60012 50%, #8B0010 100%)',
    glow: 'radial-gradient(circle at 50% 40%, rgba(255,100,100,0.35) 0%, transparent 65%)',
    svgHtml: `<svg viewBox="0 0 200 120" width="200" height="120" xmlns="http://www.w3.org/2000/svg">
      <rect x="25" y="28" width="28" height="65" rx="14" fill="rgba(220,50,50,0.7)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
      <rect x="57" y="30" width="86" height="61" rx="6" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
      <rect x="62" y="35" width="76" height="51" rx="4" fill="rgba(0,0,0,0.3)"/>
      <text x="100" y="65" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="9" font-weight="bold" font-family="sans-serif">SWITCH</text>
      <rect x="147" y="28" width="28" height="65" rx="14" fill="rgba(50,100,220,0.7)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
    </svg>`,
  },
}

const defaultBrand = {
  gradient: 'linear-gradient(135deg, #685aff, #9ccfff)',
  glow: 'radial-gradient(circle at 50% 40%, rgba(150,130,255,0.3) 0%, transparent 65%)',
  svgHtml: `<svg viewBox="0 0 200 120" width="200" height="120" xmlns="http://www.w3.org/2000/svg">
    <rect x="40" y="35" width="120" height="55" rx="12" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
    <text x="100" y="67" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-size="11" font-family="sans-serif">CONSOLA</text>
  </svg>`,
}

// ─── Catálogo de juegos por tab ────────────────────────────────────
const catalogoJuegos = [
  // Acción
  { id: 1,  tab: 'accion',   emoji: '⚔️',  nombre: 'God of War',        genero: 'Acción / Aventura', descripcion: 'Kratos y Atreus en la mitología nórdica', gradient: 'linear-gradient(135deg,#1a1a2e,#16213e)' },
  { id: 2,  tab: 'accion',   emoji: '🦇',  nombre: 'Batman Arkham',     genero: 'Acción',             descripcion: 'El Caballero de la Noche en Gotham',      gradient: 'linear-gradient(135deg,#0d0d0d,#2c2c54)' },
  { id: 3,  tab: 'accion',   emoji: '🕷️',  nombre: 'Spider-Man',        genero: 'Acción / Mundo Abierto', descripcion: 'Columpia por Nueva York como Peter Parker', gradient: 'linear-gradient(135deg,#c0392b,#2980b9)' },
  { id: 4,  tab: 'accion',   emoji: '🔫',  nombre: 'Uncharted 4',       genero: 'Acción / Aventura', descripcion: 'Nathan Drake en su última cacería',        gradient: 'linear-gradient(135deg,#2d6a4f,#1b4332)' },
  // Deportes
  { id: 5,  tab: 'deportes', emoji: '⚽',  nombre: 'FIFA 24',           genero: 'Deportes',          descripcion: 'El fútbol más realista del mundo',         gradient: 'linear-gradient(135deg,#1e3c72,#2a5298)' },
  { id: 6,  tab: 'deportes', emoji: '🏀',  nombre: 'NBA 2K24',          genero: 'Deportes',          descripcion: 'La NBA en tus manos',                      gradient: 'linear-gradient(135deg,#c46200,#7d3200)' },
  { id: 7,  tab: 'deportes', emoji: '🥊',  nombre: 'UFC 5',             genero: 'Pelea',             descripcion: 'La jaula más brutal del gaming',           gradient: 'linear-gradient(135deg,#7b0000,#3d0000)' },
  { id: 8,  tab: 'deportes', emoji: '🏎️',  nombre: 'Gran Turismo 7',    genero: 'Carreras',          descripcion: 'Simulador de conducción definitivo',       gradient: 'linear-gradient(135deg,#232526,#414345)' },
  // Multijugador
  { id: 9,  tab: 'multi',    emoji: '🎲',  nombre: 'Fall Guys',         genero: 'Multijugador',      descripcion: 'Caos colorido con amigos',                 gradient: 'linear-gradient(135deg,#f7971e,#ffd200)' },
  { id: 10, tab: 'multi',    emoji: '🧱',  nombre: 'Minecraft',         genero: 'Sandbox',           descripcion: 'Construye tu mundo sin límites',           gradient: 'linear-gradient(135deg,#5d4037,#388e3c)' },
  { id: 11, tab: 'multi',    emoji: '🎯',  nombre: 'Call of Duty',      genero: 'FPS',               descripcion: 'El shooter más épico',                     gradient: 'linear-gradient(135deg,#434343,#000000)' },
  { id: 12, tab: 'multi',    emoji: '🏝️',  nombre: 'Fortnite',          genero: 'Battle Royale',     descripcion: '100 jugadores, 1 ganador',                 gradient: 'linear-gradient(135deg,#4776e6,#8e54e9)' },
  // RPG
  { id: 13, tab: 'rpg',      emoji: '🐲',  nombre: 'Elden Ring',        genero: 'RPG / Soulslike',   descripcion: 'El juego de rol más desafiante',           gradient: 'linear-gradient(135deg,#373b44,#4286f4)' },
  { id: 14, tab: 'rpg',      emoji: '🧙',  nombre: 'Hogwarts Legacy',   genero: 'RPG / Aventura',    descripcion: 'Explora Hogwarts en el siglo XIX',         gradient: 'linear-gradient(135deg,#2c003e,#4a0072)' },
  { id: 15, tab: 'rpg',      emoji: '🗡️',  nombre: 'The Witcher 3',     genero: 'RPG',               descripcion: 'Geralt en un mundo de monstruos',         gradient: 'linear-gradient(135deg,#1c1c1c,#3d3d3d)' },
  { id: 16, tab: 'rpg',      emoji: '🌍',  nombre: 'Cyberpunk 2077',    genero: 'RPG / FPS',         descripcion: 'Night City nunca duerme',                  gradient: 'linear-gradient(135deg,#f7ff00,#db36a4)' },
]

export default {
  name: 'PosModal',
  setup() {
    const pos = usePosStore()
    return { pos }
  },
  data() {
    return {
      imgError: false,
      duracion: 1,
      categoriaActiva: 'todos',
      juegoTabActivo: 'accion',
      juegoSeleccionado: null,
      puedeScrollIzq: false,
      puedeScrollDer: true,
      categorias: [
        { value: 'todos',  emoji: '⚡', label: 'Todos'   },
        { value: 'comida', emoji: '🍿', label: 'Comida'  },
        { value: 'bebida', emoji: '🥤', label: 'Bebidas' },
        { value: 'snack',  emoji: '🌮', label: 'Snacks'  },
        { value: 'extra',  emoji: '🎮', label: 'Extras'  },
      ],
      juegosTabs: [
        { value: 'accion',   emoji: '⚔️',  label: 'Acción'     },
        { value: 'deportes', emoji: '⚽',  label: 'Deportes'   },
        { value: 'multi',    emoji: '👥',  label: 'Multijugador' },
        { value: 'rpg',      emoji: '🐲',  label: 'RPG'        },
      ],
    }
  },
  computed: {
    consolaBrand() {
      return brandMap[this.pos.ventaActiva?.nombre] ?? defaultBrand
    },
    menuFiltrado() {
      if (this.categoriaActiva === 'todos') return this.pos.menu
      return this.pos.menu.filter((i) => i.categoria === this.categoriaActiva)
    },
    juegosFiltrados() {
      return catalogoJuegos.filter((j) => j.tab === this.juegoTabActivo)
    },
  },
  watch: {
    'pos.ventaActiva'() {
      this.imgError = false   // resetea si cambia de consola
    },
    juegoTabActivo() {
      this.$nextTick(() => {
        const el = this.$refs.carruselRef
        if (el) {
          el.scrollLeft = 0
          this.actualizarFlechas()
        }
      })
    },
  },
  methods: {
    seleccionarJuego(juego) {
      this.juegoSeleccionado = this.juegoSeleccionado?.id === juego.id ? null : juego
    },
    scrollCarrusel(dir) {
      const el = this.$refs.carruselRef
      if (!el) return
      el.scrollBy({ left: dir * 200, behavior: 'smooth' })
      setTimeout(() => this.actualizarFlechas(), 300)
    },
    actualizarFlechas() {
      const el = this.$refs.carruselRef
      if (!el) return
      this.puedeScrollIzq = el.scrollLeft > 4
      this.puedeScrollDer = el.scrollLeft + el.clientWidth < el.scrollWidth - 4
    },
  },
  mounted() {
    this.$nextTick(() => {
      const el = this.$refs.carruselRef
      if (el) el.addEventListener('scroll', this.actualizarFlechas)
    })
  },
  beforeUnmount() {
    const el = this.$refs.carruselRef
    if (el) el.removeEventListener('scroll', this.actualizarFlechas)
  },
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 1050;
  backdrop-filter: blur(4px);
}
.modal-box {
  background: #fff;
  width: 100%;
  max-width: 900px;
  max-height: 92vh;
}

/* Brand glow */
.brand-glow { inset: 0; pointer-events: none; }
.consola-svg-wrap { filter: drop-shadow(0 4px 16px rgba(0,0,0,0.3)); }

/* ── Carrusel ── */
.carrusel-wrapper { position: relative; }

.carrusel-track {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 6px;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}
.carrusel-track::-webkit-scrollbar { display: none; }

.juego-card {
  flex-shrink: 0;
  width: 100px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.15s, transform 0.15s;
  scroll-snap-align: start;
  background: #fff;
}
.juego-card:hover { transform: translateY(-2px); border-color: #685aff66; }
.juego-card-selected { border-color: #685aff !important; transform: translateY(-2px); }

.juego-cover {
  height: 72px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.juego-check {
  position: absolute;
  top: 4px;
  right: 4px;
  background: #685aff;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 0.65rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
}
.juego-info {
  padding: 6px 8px;
  background: #fff;
}

.carrusel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-60%);
  z-index: 2;
  background: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: #685aff;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  line-height: 1;
  padding: 0;
}
.carrusel-arrow-left  { left: -14px; }
.carrusel-arrow-right { right: -14px; }
.carrusel-arrow:hover { background: #f0eeff; }


.menu-item {
  background: #f9f9ff;
  border: 2px solid transparent;
  transition: border-color 0.15s;
}
.menu-item-active { border-color: #685aff44; background: #f0eeff; }

.btn-contador {
  width: 22px; height: 22px;
  border-radius: 50%;
  border: none;
  background: #685aff;
  color: white;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}
.btn-agregar {
  width: 26px; height: 26px;
  border-radius: 50%;
  border: none;
  background: #f0ffc3;
  color: #685aff;
  font-size: 1rem;
  cursor: pointer;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}


.modal-enter-active, .modal-leave-active { transition: opacity 0.25s ease; }
.modal-enter-active .modal-box,
.modal-leave-active .modal-box { transition: transform 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal-box { transform: translateY(20px) scale(0.97); }


.fade-enter-active, .fade-leave-active { transition: opacity 0.2s, transform 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
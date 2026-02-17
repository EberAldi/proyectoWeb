<template>
  <div class="space-y-6">
    <!-- Header -->
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-gray-800 flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center shadow"
            style="background: #685aff"
          >
            <font-awesome-icon icon="gamepad" class="text-white" />
          </div>
          Consolas
        </h1>
        <p class="text-gray-400 text-sm mt-1">Estado actual del inventario</p>
      </div>

      <nav class="flex gap-2 flex-wrap">
        <button
          class="px-4 py-2 rounded-xl text-sm font-semibold border-2 border-[#685AFF] text-[#685AFF]"
        >
          Todas
        </button>
        <button
          class="px-4 py-2 rounded-xl text-sm font-semibold border-2 border-green-500 text-green-500"
        >
          Disponibles
        </button>
        <button
          class="px-4 py-2 rounded-xl text-sm font-semibold border-2 border-red-500 text-red-500"
        >
          Ocupadas
        </button>
        <button
          class="px-4 py-2 rounded-xl text-sm font-semibold border-2 border-yellow-500 text-yellow-500"
        >
          Mantenimiento
        </button>
      </nav>
    </header>

    <div class="grid grid-cols-1 xl:grid-cols-4 gap-6">
      <!-- Grid consolas -->
      <section class="xl:col-span-3">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Card consola -->
          <article
            class="bg-white rounded-2xl shadow-sm border-2 overflow-hidden hover:shadow-xl transition-all"
          >
            <div class="h-1.5 bg-green-500"></div>

            <div class="p-5">
              <header class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-2xl flex items-center justify-center bg-green-100">
                    <font-awesome-icon icon="gamepad" class="text-xl text-green-500" />
                  </div>
                  <div>
                    <h3 class="font-black text-gray-800 text-sm">Nombre consola</h3>
                    <p class="text-xs text-gray-400 font-medium">Marca</p>
                  </div>
                </div>

                <span class="text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-500">
                  disponible
                </span>
              </header>

              <section class="space-y-2 mb-4">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-400">Controles</span>
                  <span class="font-semibold text-gray-700">2 disponibles</span>
                </div>

                <div class="flex justify-between text-sm">
                  <span class="text-gray-400">Precio/hora</span>
                  <span class="font-black text-[#685AFF]">$80</span>
                </div>

                <!-- Barra progreso -->
                <div class="mt-3 bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div class="h-2 rounded-full bg-red-500 w-1/2"></div>
                </div>
              </section>

              <footer class="flex gap-2 pt-3 border-t border-gray-100">
                <button class="flex-1 py-2 text-white text-sm font-bold rounded-xl bg-[#685AFF]">
                  Rentar
                </button>

                <button
                  class="px-3 py-2 rounded-xl text-sm font-semibold bg-blue-200 text-[#685AFF]"
                >
                  <font-awesome-icon icon="eye" />
                </button>
              </footer>
            </div>
          </article>
        </div>
      </section>

      <!-- Aside -->
      <aside class="xl:col-span-1 space-y-4">
        <article class="bg-white rounded-2xl shadow-sm p-5 border-t-4 border-[#685AFF]">
          <header class="mb-4">
            <h3 class="font-black text-gray-800">Resumen</h3>
            <p class="text-xs text-gray-400">Estado actual</p>
          </header>

          <section class="space-y-3">
            <div class="flex items-center justify-between p-3 rounded-xl bg-gray-100">
              <span class="text-sm font-semibold text-gray-700">Disponibles</span>
              <span class="text-xl font-black text-green-500">0</span>
            </div>
            <div class="flex items-center justify-between p-3 rounded-xl bg-gray-100">
              <span class="text-sm font-semibold text-gray-700">Ocupadas</span>
              <span class="text-xl font-black text-red-500">0</span>
            </div>
            <div class="flex items-center justify-between p-3 rounded-xl bg-gray-100">
              <span class="text-sm font-semibold text-gray-700">Mantenimiento</span>
              <span class="text-xl font-black text-yellow-500">0</span>
            </div>
          </section>
        </article>

        <article class="rounded-2xl p-5 text-white bg-gradient-to-br from-[#685AFF] to-[#9CCFFF]">
          <p class="text-white/70 text-xs uppercase tracking-wider">Ingresos estimados hoy</p>
          <p class="text-3xl font-black mt-1">$0</p>
        </article>
      </aside>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConsolasView',
}
</script>

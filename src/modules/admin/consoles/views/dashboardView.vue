<template>
  <div class="space-y-6">
    <!-- Header -->
    <header class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-black text-gray-800">Dashboard</h1>
        <time class="text-sm text-gray-400 capitalize"> lunes, 16 de febrero de 2026 </time>
      </div>

      <div
        class="px-4 py-2 rounded-xl text-sm font-bold"
        style="background-color: #f0ffc3; color: #685aff"
      >
        <font-awesome-icon icon="clock" class="mr-2" />
        Turno activo
      </div>
    </header>

    <!-- Stats -->
    <section class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <article class="bg-white rounded-2xl p-5 shadow-sm border-b-4 border-[#685AFF]">
        <p class="text-3xl font-black text-gray-800">0</p>
        <p class="text-xs text-gray-400 font-medium mt-1">Consolas activas</p>
      </article>

      <article class="bg-white rounded-2xl p-5 shadow-sm border-b-4 border-green-500">
        <p class="text-3xl font-black text-gray-800">0</p>
        <p class="text-xs text-gray-400 font-medium mt-1">Rentas hoy</p>
      </article>

      <article class="bg-white rounded-2xl p-5 shadow-sm border-b-4 border-blue-400">
        <p class="text-3xl font-black text-gray-800">0</p>
        <p class="text-xs text-gray-400 font-medium mt-1">Clientes hoy</p>
      </article>

      <article class="bg-white rounded-2xl p-5 shadow-sm border-b-4 border-red-500">
        <p class="text-3xl font-black text-gray-800">0</p>
        <p class="text-xs text-gray-400 font-medium mt-1">Productos vendidos</p>
      </article>
    </section>

    <!-- Layout -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <!-- Principal -->
      <section class="xl:col-span-2 space-y-6">
        <!-- Rentas activas -->
        <article class="bg-white rounded-2xl shadow-sm overflow-hidden">
          <header class="px-6 py-4 border-b border-gray-100">
            <h2 class="font-black text-gray-800">Rentas activas</h2>
          </header>

          <section class="px-6 py-10 text-center text-gray-400 text-sm">Sin rentas activas</section>
        </article>

        <!-- Ingresos -->
        <article
          class="rounded-2xl p-6 text-white"
          style="background: linear-gradient(135deg, #685aff, #9ccfff)"
        >
          <p class="text-white/70 text-sm uppercase tracking-wider">Ingresos del día</p>
          <p class="text-5xl font-black mt-2">$0</p>
        </article>
      </section>

      <!-- Aside -->
      <aside class="space-y-4">
        <!-- Ventas -->
        <article class="bg-white rounded-2xl shadow-sm overflow-hidden">
          <header class="px-5 py-4 border-b border-gray-100">
            <h3 class="font-black text-gray-800">Últimas ventas</h3>
          </header>
          <section class="px-5 py-8 text-center text-gray-400 text-sm">
            Sin ventas recientes
          </section>
        </article>

        <!-- Alertas -->
        <article class="bg-white rounded-2xl shadow-sm overflow-hidden">
          <header class="px-5 py-4 border-b border-gray-100">
            <h3 class="font-black text-gray-800">Alertas</h3>
          </header>
          <section class="px-5 py-8 text-center text-gray-400 text-sm">Sin alertas</section>
        </article>

        <!-- Acciones -->
        <nav class="bg-white rounded-2xl shadow-sm p-4 space-y-2">
          <p class="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">
            Acciones rápidas
          </p>

          <button
            class="w-full px-4 py-3 rounded-xl text-white text-sm font-bold"
            style="background-color: #685aff"
          >
            Nueva renta
          </button>

          <button
            class="w-full px-4 py-3 rounded-xl text-sm font-bold"
            style="background-color: #9ccfff; color: #685aff"
          >
            Abrir POS
          </button>

          <button
            class="w-full px-4 py-3 rounded-xl text-sm font-bold"
            style="background-color: #f0ffc3; color: #685aff"
          >
            Reporte del día
          </button>
        </nav>
      </aside>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardView',
}
</script>

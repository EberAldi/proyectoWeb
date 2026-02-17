<template>
  <main
    class="min-h-screen flex items-center justify-center py-12 px-4"
    style="background: linear-gradient(135deg, #685aff, #9ccfff)"
  >
    <section class="max-w-md w-full space-y-8">
      <!-- Header -->
      <header class="text-center">
        <div
          class="mx-auto h-16 w-16 rounded-full flex items-center justify-center shadow-lg"
          style="background: #f0ffc3"
        >
          <font-awesome-icon icon="gamepad" class="text-4xl" style="color: #685aff" />
        </div>

        <h1 class="mt-6 text-4xl font-extrabold text-white">Renta de Consolas</h1>

        <h2 class="mt-2 text-lg text-white/80">Iniciar sesión</h2>
      </header>

      <!-- Card -->
      <article class="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
        <section>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            <font-awesome-icon icon="envelope" class="mr-2" style="color: #685aff" />
            Correo electrónico
          </label>

          <input
            type="email"
            placeholder="usuario@consolas.com"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all"
          />
        </section>

        <section>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            <font-awesome-icon icon="lock" class="mr-2" style="color: #685aff" />
            Contraseña
          </label>

          <input
            type="password"
            placeholder="••••••••"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all"
          />
        </section>

        <section>
          <button
            class="w-full flex justify-center items-center gap-2 py-3 px-4 text-white font-semibold rounded-lg transition-all shadow-lg hover:opacity-90"
            style="background: #685aff"
          >
            <font-awesome-icon icon="sign-in-alt" />
            Ingresar
          </button>
        </section>
      </article>

      <!-- Footer -->
      <footer class="text-center text-white text-sm">
        <p>&copy; 2026 Renta de Consolas</p>
      </footer>
    </section>
  </main>
</template>

<script>
export default {
  name: 'LoginView',
}
</script>

<style scoped>
article {
  animation: slideUp 0.4s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

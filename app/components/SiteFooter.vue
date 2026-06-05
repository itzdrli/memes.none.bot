<script setup lang="ts">
const TG_CHANNEL = "https://t.me/koimemes";
</script>

<template>
  <footer class="mt-12 border-t border-white/5 px-4 py-10 text-center">
    <p class="text-sm font-medium text-nord4">Koishi Memes</p>
    <a
      :href="TG_CHANNEL"
      target="_blank"
      rel="noopener noreferrer"
      class="mt-3 inline-flex items-center gap-2 rounded-full bg-nord1 px-4 py-2 text-sm text-nord8 transition hover:bg-nord2 hover:text-nord7"
    >
      <svg
        class="h-4 w-4"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          d="M21.94 4.3 18.9 19.1c-.23 1.02-.84 1.27-1.7.79l-4.7-3.46-2.27 2.18c-.25.25-.46.46-.95.46l.34-4.78L18.6 6.3c.38-.34-.08-.53-.59-.19L7.27 13.2l-4.65-1.45c-1.01-.32-1.03-1.01.21-1.5l18.18-7c.84-.31 1.58.2 1.31 1.05Z"
        />
      </svg>
      Telegram 频道 · @koimemes
    </a>
    <p class="mt-4 text-xs text-nord3">
      © {{ new Date().getFullYear() }} · memes.none.bot
    </p>
  </footer>
</template>

<script setup lang="ts">
const TG_CHANNEL = "https://t.me/koimemes";
const SUBMIT_BOT = "https://t.me/FantasticSpoonBot";
const year = new Date().getFullYear();
</script>

<template>
  <footer class="mt-10 border-t border-nord-3 bg-nord-1">
    <div
      class="mx-auto flex max-w-[1600px] flex-col items-center gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="flex flex-col items-center gap-2 sm:items-start">
        <AppLogo />
        <p class="text-nord-4">Koishi 相关的 meme 合集，每一张都来自群友投稿。</p>
      </div>

      <div class="flex flex-wrap items-center justify-center gap-2">
        <a :href="TG_CHANNEL" target="_blank" rel="noopener noreferrer" class="ft-link">
          <svg class="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path
              d="M21.94 4.3 18.9 19.1c-.23 1.02-.84 1.27-1.7.79l-4.7-3.46-2.27 2.18c-.25.25-.46.46-.95.46l.34-4.78L18.6 6.3c.38-.34-.08-.53-.59-.19L7.27 13.2l-4.65-1.45c-1.01-.32-1.03-1.01.21-1.5l18.18-7c.84-.31 1.58.2 1.31 1.05Z"
            />
          </svg>
          频道 @koimemes
        </a>
        <a :href="SUBMIT_BOT" target="_blank" rel="noopener noreferrer" class="ft-link">
          📮 投稿 @FantasticSpoonBot
        </a>
      </div>
    </div>

    <div class="border-t border-nord-3">
      <div
        class="mx-auto flex max-w-[1600px] flex-col items-center gap-3 px-5 py-4 text-[12px] text-nord-4/70 sm:flex-row sm:justify-between"
      >
        <span>© {{ year }} · memes.none.bot</span>
        <PoweredBy class="aspect-[544/43] h-4 w-auto text-nord-5" />
      </div>
    </div>
  </footer>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.ft-link {
  @apply inline-flex h-8 items-center gap-2 rounded-[2px] border border-nord-3 bg-nord-2 px-3 text-nord-5 outline-none transition-colors hover:border-nord-8 hover:text-nord-6 focus-visible:border-nord-8;
}
</style>

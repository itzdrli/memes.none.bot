<script setup lang="ts">
import type { Meme } from "~/composables/useMemes";

const { all, total, pending, error } = useMemes();
const active = ref<Meme | null>(null);
</script>

<template>
  <div class="min-h-screen bg-nord0 text-nord6">
    <header
      class="sticky top-0 z-30 border-b border-white/5 bg-nord0/80 backdrop-blur-md"
    >
      <div class="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-3">
        <h1 class="text-xl font-semibold tracking-tight text-nord6">
          Koishi <span class="text-nord8">Memes</span>
        </h1>
        <span v-if="total" class="text-sm text-nord3">{{ total }} 张</span>
      </div>
    </header>

    <main class="mx-auto max-w-[1600px] px-5 py-6">
      <p
        v-if="error"
        class="rounded-xl bg-nord1 px-4 py-8 text-center text-nord11"
      >
        加载失败，请稍后再试。
      </p>

      <p
        v-else-if="pending"
        class="py-16 text-center text-sm text-nord3"
      >
        加载中…
      </p>

      <ClientOnly v-else>
        <MasonryGallery :items="all" @open="active = $event" />
        <template #fallback>
          <p class="py-16 text-center text-sm text-nord3">加载中…</p>
        </template>
      </ClientOnly>
    </main>

    <SiteFooter />

    <MemeModal :meme="active" @close="active = null" />
  </div>
</template>

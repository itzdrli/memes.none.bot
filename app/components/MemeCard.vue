<script setup lang="ts">
import type { Meme } from "~/composables/useMemes";

defineProps<{ meme: Meme }>();
const emit = defineEmits<{ open: [meme: Meme] }>();
</script>

<template>
  <figure
    class="group cursor-zoom-in overflow-hidden rounded-[2px] border border-nord-3 bg-nord-1 outline-none transition-colors duration-150 hover:border-nord-8 focus-visible:border-nord-8"
    tabindex="0"
    role="button"
    :aria-label="meme.title"
    @click="emit('open', meme)"
    @keydown.enter.prevent="emit('open', meme)"
    @keydown.space.prevent="emit('open', meme)"
  >
    <img :src="meme.imageUrl" :alt="meme.title" decoding="async" class="block w-full bg-nord-2" />
    <figcaption
      class="truncate border-t border-nord-3 px-2.5 py-2 text-nord-5 transition-colors group-hover:text-nord-6"
    >
      <span class="text-nord-4/70">#</span> {{ meme.title }}
    </figcaption>
  </figure>
</template>

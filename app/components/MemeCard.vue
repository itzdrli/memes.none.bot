<script setup lang="ts">
import type { Meme } from "~/composables/useMemes";

defineProps<{ meme: Meme }>();
const emit = defineEmits<{ open: [meme: Meme] }>();
</script>

<template>
  <figure
    class="group cursor-zoom-in overflow-hidden rounded-xl bg-nord1 ring-1 ring-white/5 transition duration-200 hover:-translate-y-0.5 hover:ring-nord8/60"
    @click="emit('open', meme)"
  >
    <img
      :src="meme.imageUrl"
      :alt="meme.title"
      decoding="async"
      class="block w-full bg-nord0/40"
    />
    <figcaption
      class="truncate px-3 py-2.5 text-base text-nord4 transition-colors group-hover:text-nord6"
    >
      # {{ meme.title }}
    </figcaption>
  </figure>
</template>

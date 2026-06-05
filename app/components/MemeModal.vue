<script setup lang="ts">
import type { Meme } from "~/composables/useMemes";

const props = defineProps<{ meme: Meme | null }>();
const emit = defineEmits<{ close: [] }>();

function onKey(e: KeyboardEvent) {
  if (e.key === "Escape") emit("close");
}

watch(
  () => props.meme,
  (m) => {
    if (!import.meta.client) return;
    document.body.style.overflow = m ? "hidden" : "";
  },
);

onMounted(() => window.addEventListener("keydown", onKey));
onUnmounted(() => {
  window.removeEventListener("keydown", onKey);
  if (import.meta.client) document.body.style.overflow = "";
});
</script>

<template>
  <Transition name="fade">
    <div
      v-if="meme"
      class="fixed inset-0 z-50 flex items-center justify-center bg-nord0/90 p-4 backdrop-blur-sm sm:p-8"
      @click.self="emit('close')"
    >
      <button
        type="button"
        aria-label="关闭"
        class="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-nord1/80 text-xl text-nord4 transition hover:bg-nord3 hover:text-nord6"
        @click="emit('close')"
      >
        ✕
      </button>

      <figure class="flex max-h-full flex-col items-center gap-4">
        <img
          :src="meme.imageUrl"
          :alt="meme.title"
          class="max-h-[80vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
        />
        <figcaption class="px-2 text-center text-lg font-semibold text-nord6 sm:text-xl">
          # {{ meme.title }}
        </figcaption>
      </figure>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

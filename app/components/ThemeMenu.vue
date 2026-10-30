<script setup lang="ts">
import { Palette } from "@lucide/vue";

const { themeId, setTheme, THEMES } = useTheme();

const open = ref(false);
const root = ref<HTMLElement | null>(null);

function onPointerDown(e: PointerEvent) {
  if (open.value && !root.value?.contains(e.target as Node)) open.value = false;
}
function onKey(e: KeyboardEvent) {
  if (e.key === "Escape") open.value = false;
}

onMounted(() => {
  document.addEventListener("pointerdown", onPointerDown);
  document.addEventListener("keydown", onKey);
});
onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", onPointerDown);
  document.removeEventListener("keydown", onKey);
});
</script>

<template>
  <div ref="root" class="relative">
    <button
      type="button"
      class="flex h-7 items-center gap-1.5 rounded-[2px] px-2 text-nord-4 outline-none transition-colors hover:bg-nord-2 hover:text-nord-6 focus-visible:ring-1 focus-visible:ring-nord-8"
      aria-label="外观"
      :aria-expanded="open"
      @click="open = !open"
    >
      <Palette class="size-4" />
    </button>

    <Transition
      enter-from-class="opacity-0 -translate-y-1"
      leave-to-class="opacity-0 -translate-y-1"
      enter-active-class="transition duration-150"
      leave-active-class="transition duration-100"
    >
      <div
        v-if="open"
        class="absolute top-full right-0 z-40 mt-1.5 flex w-64 flex-col gap-1.5 rounded-[2px] border border-nord-3 bg-nord-1 p-3 shadow-xl"
      >
        <span class="text-[12px] font-bold tracking-[0.12em] text-nord-5 uppercase">主题</span>
        <div class="grid grid-cols-2 gap-1.5">
          <button
            v-for="t in THEMES"
            :key="t.id"
            type="button"
            class="flex items-center gap-1.5 border px-2 py-1.5 text-left outline-none transition-colors focus-visible:border-nord-8"
            :class="themeId === t.id ? 'border-nord-8 bg-nord-8/10' : 'border-nord-3 hover:border-nord-4'"
            :aria-pressed="themeId === t.id"
            @click="setTheme(t.id)"
          >
            <span class="flex shrink-0">
              <span
                v-for="hex in t.swatches"
                :key="hex"
                class="-ml-0.5 size-3 border border-black/20 first:ml-0"
                :style="{ backgroundColor: hex }"
              />
            </span>
            <span class="truncate text-nord-6">{{ t.label }}</span>
          </button>
        </div>
        <p class="text-[12px] text-nord-4/60">保存在本浏览器</p>
      </div>
    </Transition>
  </div>
</template>

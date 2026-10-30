<script setup lang="ts">
import { Search, Shuffle, X } from "@lucide/vue";
import type { MemeOrder } from "~/composables/useMemes";

defineProps<{ total: number; shown: number }>();
const query = defineModel<string>("query", { required: true });
const order = defineModel<MemeOrder>("order", { required: true });
const emit = defineEmits<{ shuffle: [] }>();

const ORDERS: { value: MemeOrder; label: string }[] = [
  { value: "random", label: "随机" },
  { value: "newest", label: "最新" },
];

const input = ref<HTMLInputElement | null>(null);

// "/" focuses search, like most galleries and docs sites
function onKey(e: KeyboardEvent) {
  const target = e.target as HTMLElement | null;
  if (e.key !== "/" || target?.closest("input, textarea, [contenteditable]")) return;
  e.preventDefault();
  input.value?.focus();
}
onMounted(() => document.addEventListener("keydown", onKey));
onBeforeUnmount(() => document.removeEventListener("keydown", onKey));
</script>

<template>
  <header class="sticky top-0 z-30 border-b border-nord-3 bg-nord-1/90 backdrop-blur-md">
    <div class="mx-auto flex h-12 max-w-[1600px] items-center gap-3 px-3 sm:px-5">
      <a
        href="/"
        aria-label="Koishi Memes"
        class="shrink-0 rounded-[2px] outline-none focus-visible:ring-1 focus-visible:ring-nord-8"
      >
        <AppLogo compact />
      </a>

      <span class="hidden text-nord-4 tabular-nums md:inline">
        <template v-if="query">{{ shown }} / </template>{{ total }} 张
      </span>

      <div class="ml-auto flex min-w-0 items-center gap-1.5">
        <label
          class="flex h-7 min-w-0 items-center gap-1.5 rounded-[2px] border border-nord-3 bg-nord-2 px-2 text-nord-4 transition-colors focus-within:border-nord-8 sm:w-56"
        >
          <Search class="size-3.5 shrink-0" />
          <input
            ref="input"
            v-model="query"
            type="search"
            placeholder="搜索标题"
            aria-label="搜索标题"
            class="w-full min-w-0 bg-transparent text-nord-6 outline-none placeholder:text-nord-4/60"
          />
          <button
            v-if="query"
            type="button"
            aria-label="清除搜索"
            class="shrink-0 text-nord-4 hover:text-nord-6"
            @click="query = ''"
          >
            <X class="size-3.5" />
          </button>
          <kbd
            v-else
            class="hidden shrink-0 rounded-[2px] border border-nord-3 px-1 text-[11px] leading-4 text-nord-4/70 sm:inline"
            >/</kbd
          >
        </label>

        <div class="flex h-7 shrink-0 rounded-[2px] border border-nord-3 bg-nord-2 p-0.5" role="radiogroup" aria-label="排序">
          <button
            v-for="o in ORDERS"
            :key="o.value"
            type="button"
            role="radio"
            :aria-checked="order === o.value"
            class="rounded-[1px] px-2 outline-none transition-colors focus-visible:ring-1 focus-visible:ring-nord-8"
            :class="order === o.value ? 'bg-nord-3 text-nord-6' : 'text-nord-4 hover:text-nord-6'"
            @click="order = o.value"
          >
            {{ o.label }}
          </button>
        </div>

        <button
          type="button"
          aria-label="重新打乱"
          title="重新打乱"
          class="hidden h-7 items-center rounded-[2px] px-2 text-nord-4 outline-none transition-colors hover:bg-nord-2 hover:text-nord-6 focus-visible:ring-1 focus-visible:ring-nord-8 sm:flex"
          @click="emit('shuffle')"
        >
          <Shuffle class="size-4" />
        </button>

        <ClientOnly>
          <ThemeMenu />
        </ClientOnly>
      </div>
    </div>
  </header>
</template>

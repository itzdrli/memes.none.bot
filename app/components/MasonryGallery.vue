<script setup lang="ts">
import type { Meme } from "~/composables/useMemes";

const props = defineProps<{ items: Meme[] }>();
const emit = defineEmits<{ open: [meme: Meme] }>();

const BATCH = 10;

const cols = ref<Meme[][]>([]);
const colEls = ref<HTMLElement[]>([]);
const sentinel = ref<HTMLElement | null>(null);
const done = ref(false);

let cursor = 0; // index of the next item in props.items to place
let columnCount = 4;
let loading = false;
let io: IntersectionObserver | null = null;

function getColumnCount(): number {
  if (!import.meta.client) return 4;
  const w = window.innerWidth;
  if (w < 640) return 2;
  if (w < 1280) return 3;
  return 4;
}

function setColRef(el: Element | null, i: number) {
  if (el) colEls.value[i] = el as HTMLElement;
}

function resetCols(n: number) {
  colEls.value = [];
  cols.value = Array.from({ length: n }, () => []);
}

/** Index of the currently shortest column (by rendered height). */
function shortestColIndex(): number {
  let min = 0;
  for (let i = 1; i < colEls.value.length; i++) {
    const h = colEls.value[i]?.offsetHeight ?? 0;
    if (h < (colEls.value[min]?.offsetHeight ?? 0)) min = i;
  }
  return min;
}

function waitForImage(col: HTMLElement | undefined): Promise<void> {
  const img = col?.querySelector<HTMLImageElement>("figure:last-child img");
  if (!img || img.complete) return Promise.resolve();
  return new Promise((resolve) => {
    img.addEventListener("load", () => resolve(), { once: true });
    img.addEventListener("error", () => resolve(), { once: true });
  });
}

/** Append one item to the shortest column, then wait for it to load. */
async function placeOne(): Promise<boolean> {
  if (cursor >= props.items.length) return false;
  const idx = shortestColIndex();
  cols.value[idx]!.push(props.items[cursor++]!);
  await nextTick();
  await waitForImage(colEls.value[idx]);
  return true;
}

async function loadBatch(count = BATCH) {
  if (loading || done.value) return;
  loading = true;
  for (let i = 0; i < count; i++) {
    if (!(await placeOne())) {
      done.value = true;
      break;
    }
  }
  loading = false;
  arm();
}

/** (Re)observe the sentinel — re-arming re-fires the callback if it is
 *  still on screen, so short batches keep filling until it scrolls away. */
function arm() {
  if (!io || !sentinel.value) return;
  io.disconnect();
  if (!done.value) io.observe(sentinel.value);
}

/** Re-distribute already-shown items when the column count changes.
 *  Images are cached by now, so heights are available immediately. */
async function reflow() {
  if (loading) return;
  loading = true;
  const upto = cursor;
  cursor = 0;
  resetCols(columnCount);
  await nextTick();
  for (let i = 0; i < upto; i++) {
    cols.value[shortestColIndex()]!.push(props.items[cursor++]!);
    await nextTick();
  }
  loading = false;
  arm();
}

let resizeTimer: ReturnType<typeof setTimeout> | undefined;
function onResize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const n = getColumnCount();
    if (n !== columnCount) {
      columnCount = n;
      reflow();
    }
  }, 200);
}

onMounted(async () => {
  columnCount = getColumnCount();
  resetCols(columnCount);
  await nextTick();
  io = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) loadBatch();
    },
    { rootMargin: "700px 0px" },
  );
  await loadBatch();
  window.addEventListener("resize", onResize);
});

onBeforeUnmount(() => {
  io?.disconnect();
  window.removeEventListener("resize", onResize);
  clearTimeout(resizeTimer);
});
</script>

<template>
  <div>
    <div class="flex items-start gap-4">
      <div
        v-for="(col, ci) in cols"
        :key="ci"
        :ref="(el) => setColRef(el as Element | null, ci)"
        class="flex min-w-0 flex-1 flex-col gap-4"
      >
        <MemeCard
          v-for="meme in col"
          :key="meme.id"
          :meme="meme"
          @open="emit('open', $event)"
        />
      </div>
    </div>

    <div ref="sentinel" class="h-12"></div>

    <p v-if="done" class="py-6 text-center text-sm text-nord3">
      — 已经到底啦 —
    </p>
  </div>
</template>

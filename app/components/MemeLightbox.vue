<script setup lang="ts">
import { ChevronLeft, ChevronRight, Download, ExternalLink, Link, X } from "@lucide/vue";
import { useLenis } from "lenis/vue";
import type { Meme } from "~/composables/useMemes";

const props = defineProps<{ items: Meme[] }>();
/** id of the open meme, null when closed */
const activeId = defineModel<string | null>({ required: true });

const lenis = useLenis();

const index = computed(() => props.items.findIndex((m) => m.id === activeId.value));
const meme = computed(() => props.items[index.value] ?? null);

function go(step: number) {
  if (index.value < 0 || !props.items.length) return;
  const next = (index.value + step + props.items.length) % props.items.length;
  activeId.value = props.items[next]!.id;
}
const close = () => (activeId.value = null);

function onKey(e: KeyboardEvent) {
  if (!meme.value) return;
  if (e.key === "Escape") close();
  else if (e.key === "ArrowLeft") go(-1);
  else if (e.key === "ArrowRight") go(1);
}

// Horizontal swipe on touch screens
let touchX: number | null = null;
function onTouchStart(e: TouchEvent) {
  touchX = e.touches[0]?.clientX ?? null;
}
function onTouchEnd(e: TouchEvent) {
  const endX = e.changedTouches[0]?.clientX;
  if (touchX !== null && endX !== undefined && Math.abs(endX - touchX) > 50) go(endX < touchX ? 1 : -1);
  touchX = null;
}

// Stop smooth scrolling (and native scroll) underneath while open
watch(
  () => meme.value !== null,
  (isOpen) => {
    if (isOpen) lenis.value?.stop();
    else lenis.value?.start();
    document.documentElement.style.overflow = isOpen ? "hidden" : "";
  },
);

// Warm the cache for the neighbours so arrow keys feel instant
watch(index, (i) => {
  if (i < 0 || props.items.length < 2) return;
  for (const step of [1, -1]) {
    const m = props.items[(i + step + props.items.length) % props.items.length];
    if (m) new Image().src = m.imageUrl;
  }
});

const status = ref("");
let statusTimer: ReturnType<typeof setTimeout> | undefined;
function flash(text: string) {
  status.value = text;
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => (status.value = ""), 1600);
}

function shareUrl(m: Meme) {
  const url = new URL(window.location.href);
  url.search = "";
  url.hash = "";
  url.searchParams.set("m", m.id);
  return url.toString();
}

async function copyLink() {
  if (!meme.value) return;
  try {
    await navigator.clipboard.writeText(shareUrl(meme.value));
    flash("链接已复制");
  } catch {
    flash("复制失败");
  }
}

// Cross-origin images ignore <a download>, so fetch the blob first (the
// kmeme backend sends CORS headers for this site)
const downloading = ref(false);
async function download() {
  if (!meme.value || downloading.value) return;
  downloading.value = true;
  const m = meme.value;
  try {
    const blob = await (await fetch(m.imageUrl)).blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${m.title.replace(/[\\/:*?"<>|]/g, "_")}.${blob.type.split("/")[1] || "webp"}`;
    a.click();
    URL.revokeObjectURL(url);
  } catch {
    window.open(m.imageUrl, "_blank", "noopener");
  } finally {
    downloading.value = false;
  }
}

const dateFormat = new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium" });

onMounted(() => window.addEventListener("keydown", onKey));
onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKey);
  clearTimeout(statusTimer);
  document.documentElement.style.overflow = "";
  lenis.value?.start();
});
</script>

<template>
  <Transition
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
    enter-active-class="transition-opacity duration-150"
    leave-active-class="transition-opacity duration-150"
  >
    <div
      v-if="meme"
      class="fixed inset-0 z-50 flex flex-col bg-nord-0/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      :aria-label="meme.title"
      data-lenis-prevent
    >
      <!-- Toolbar -->
      <div class="flex h-12 shrink-0 items-center gap-2 border-b border-nord-3 bg-nord-1 px-3 sm:px-5">
        <span class="text-nord-4 tabular-nums">{{ index + 1 }} / {{ items.length }}</span>
        <span v-if="status" class="text-nord-14">{{ status }}</span>

        <div class="ml-auto flex items-center gap-1">
          <button type="button" class="lb-btn" title="复制链接" aria-label="复制链接" @click="copyLink">
            <Link class="size-4" />
            <span class="hidden sm:inline">复制链接</span>
          </button>
          <button
            type="button"
            class="lb-btn"
            title="下载"
            aria-label="下载"
            :disabled="downloading"
            @click="download"
          >
            <Download class="size-4" />
            <span class="hidden sm:inline">下载</span>
          </button>
          <a
            :href="meme.imageUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="lb-btn"
            title="新标签页打开原图"
            aria-label="新标签页打开原图"
          >
            <ExternalLink class="size-4" />
          </a>
          <span class="mx-1 h-5 w-px bg-nord-3" />
          <button type="button" class="lb-btn" title="关闭 (Esc)" aria-label="关闭" @click="close">
            <X class="size-4" />
          </button>
        </div>
      </div>

      <!-- Stage -->
      <div
        class="relative flex min-h-0 flex-1 items-center justify-center p-4 sm:px-16 sm:py-6"
        @click.self="close"
        @touchstart.passive="onTouchStart"
        @touchend="onTouchEnd"
      >
        <button
          v-if="items.length > 1"
          type="button"
          class="lb-nav left-3"
          aria-label="上一张 (←)"
          @click="go(-1)"
        >
          <ChevronLeft class="size-5" />
        </button>

        <img
          :key="meme.id"
          :src="meme.imageUrl"
          :alt="meme.title"
          class="max-h-full max-w-full rounded-[2px] border border-nord-3 object-contain shadow-2xl"
        />

        <button
          v-if="items.length > 1"
          type="button"
          class="lb-nav right-3"
          aria-label="下一张 (→)"
          @click="go(1)"
        >
          <ChevronRight class="size-5" />
        </button>
      </div>

      <!-- Caption -->
      <div class="shrink-0 border-t border-nord-3 bg-nord-1 px-4 py-3 text-center">
        <p class="text-[17px] font-bold break-words text-nord-6">
          <span class="text-nord-4/70">#</span> {{ meme.title }}
        </p>
        <p class="mt-0.5 text-[12px] text-nord-4/70">
          {{ dateFormat.format(new Date(meme.createdAt)) }}
          <span class="hidden sm:inline"> · ← → 切换 · Esc 关闭</span>
        </p>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.lb-btn {
  @apply flex h-7 items-center gap-1.5 rounded-[2px] px-2 text-nord-4 outline-none transition-colors hover:bg-nord-2 hover:text-nord-6 focus-visible:ring-1 focus-visible:ring-nord-8 disabled:opacity-50;
}
.lb-nav {
  @apply absolute top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-[2px] border border-nord-3 bg-nord-1/80 text-nord-4 outline-none transition-colors hover:border-nord-8 hover:text-nord-6 focus-visible:border-nord-8 sm:flex;
}
</style>

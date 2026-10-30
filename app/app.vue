<script setup lang="ts">
const { all, visible, total, query, order, pending, error, reshuffle } = useMemes();

// The masonry re-lays out from scratch when the list changes, so debounce
// typing instead of rebuilding on every keystroke
const debouncedQuery = ref("");
let queryTimer: ReturnType<typeof setTimeout> | undefined;
watch(query, (q) => {
  clearTimeout(queryTimer);
  queryTimer = setTimeout(() => (debouncedQuery.value = q), 200);
});
const galleryKey = ref(0);
watch([debouncedQuery, order], () => galleryKey.value++);
function onShuffle() {
  reshuffle();
  galleryKey.value++;
}

// Open meme, mirrored to ?m=<id> so links are shareable
const activeId = ref<string | null>(null);
onMounted(() => {
  const id = new URL(window.location.href).searchParams.get("m");
  if (id && all.value.some((m) => m.id === id)) activeId.value = id;
});
watch(activeId, (id) => {
  const url = new URL(window.location.href);
  if (id) url.searchParams.set("m", id);
  else url.searchParams.delete("m");
  history.replaceState(history.state, "", url);
});
</script>

<template>
  <VueLenis root :options="{ duration: 1.1 }">
    <div class="flex min-h-screen flex-col">
      <SiteHeader
        v-model:query="query"
        v-model:order="order"
        :total="total"
        :shown="visible.length"
        @shuffle="onShuffle"
      />

      <main class="mx-auto w-full max-w-[1600px] flex-1 px-3 py-4 sm:px-5 sm:py-5">
        <div
          v-if="error"
          class="mx-auto mt-12 flex max-w-md flex-col gap-1 rounded-[2px] border border-nord-11/50 bg-nord-1 p-4"
        >
          <h2 class="font-bold text-nord-11">加载失败</h2>
          <p class="text-nord-4">meme 列表暂时取不到，请稍后再试。</p>
        </div>

        <p v-else-if="pending" class="py-16 text-center text-nord-4">加载中…</p>

        <div
          v-else-if="!visible.length"
          class="mx-auto mt-12 flex max-w-md flex-col items-center gap-2 text-center"
        >
          <h2 class="font-bold text-nord-6">没有找到「{{ query }}」</h2>
          <p class="text-nord-4">换个关键词试试，标题里的空格可以忽略。</p>
          <button
            type="button"
            class="mt-1 h-7 rounded-[2px] border border-nord-3 bg-nord-2 px-3 text-nord-5 hover:border-nord-8 hover:text-nord-6"
            @click="query = ''"
          >
            清除搜索
          </button>
        </div>

        <ClientOnly v-else>
          <MasonryGallery :key="galleryKey" :items="visible" @open="activeId = $event.id" />
          <template #fallback>
            <p class="py-16 text-center text-nord-4">加载中…</p>
          </template>
        </ClientOnly>
      </main>

      <SiteFooter />

      <ClientOnly>
        <MemeLightbox v-model="activeId" :items="visible" />
      </ClientOnly>
    </div>
  </VueLenis>
</template>

export interface Meme {
  id: string;
  title: string;
  imageUrl: string;
  createdAt: string;
}

interface MemeListResponse {
  data: Meme[];
  count: number;
}

export type MemeOrder = "random" | "newest";

export const MEME_BASE_URL = "https://kmeme.itzdrli.cc";

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

/** Lower-case, drop whitespace and the "#" prefix, so "太 可 怕 了" matches "太可怕" */
function normalize(text: string): string {
  return text.toLowerCase().replace(/[\s#]/g, "");
}

/**
 * Fetches the full (lightweight) meme list once. The masonry gallery then
 * places images one-by-one into the shortest column, so the heavy assets
 * load on demand as the user scrolls — nothing past the first batch is
 * fetched up front. "random" order is shuffled per page load.
 */
export function useMemes() {
  const { data, pending, error } = useAsyncData<Meme[]>(
    "memes",
    async () => {
      const res = await $fetch<MemeListResponse>(`${MEME_BASE_URL}/meme`);
      return shuffle(
        res.data.map((m) => ({
          id: m.id,
          title: m.title,
          imageUrl: new URL(m.imageUrl, MEME_BASE_URL).toString(),
          createdAt: m.createdAt,
        })),
      );
    },
    { default: () => [] },
  );

  const query = ref("");
  const order = ref<MemeOrder>("random");

  const all = computed(() => data.value ?? []);
  const total = computed(() => all.value.length);

  const visible = computed(() => {
    const q = normalize(query.value);
    const list = q ? all.value.filter((m) => normalize(m.title).includes(q)) : all.value;
    return order.value === "newest"
      ? list.toSorted((a, b) => b.createdAt.localeCompare(a.createdAt))
      : list;
  });

  /** Re-shuffle the random order in place */
  function reshuffle() {
    data.value = shuffle(all.value);
    order.value = "random";
  }

  return { all, visible, total, query, order, pending, error, reshuffle };
}

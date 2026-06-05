export interface Meme {
  id: string;
  title: string;
  imageUrl: string;
  createdAt: string;
}

interface RawMeme {
  id: string;
  title: string;
  imageUrl: string;
  createdAt: string;
}

interface MemeListResponse {
  data: RawMeme[];
  count: number;
}

export const MEME_BASE_URL = "https://kmeme.itzdrli.cc";

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

/**
 * Fetches the full (lightweight) meme list once. The masonry gallery then
 * places images one-by-one into the shortest column, so the heavy assets
 * load on demand as the user scrolls — nothing past the first batch is
 * fetched up front. Shuffled per request so every open feels fresh.
 */
export function useMemes() {
  const { data, pending, error, refresh } = useAsyncData<Meme[]>(
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

  const all = computed(() => data.value ?? []);
  const total = computed(() => all.value.length);

  return { all, total, pending, error, refresh };
}

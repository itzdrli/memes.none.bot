<!--
  Header lockup: the FantasticSpoon mark (same artwork as public/logo.svg and
  the PoweredBy badge) + a text wordmark. The mark keeps its brand colours;
  the wordmark follows the theme.
-->
<script setup lang="ts">
/** compact: mark only below the sm breakpoint (narrow headers) */
defineProps<{ compact?: boolean }>();
// Unique per instance so url(#…) refs never collide
const uid = useId();
</script>

<template>
  <span class="flex items-center gap-2">
    <svg viewBox="27 26 459 459" class="size-6 shrink-0" fill="none" aria-hidden="true">
      <circle cx="256.5" cy="255.5" r="229" fill="#414857" />
      <mask :id="`${uid}-disc`" maskUnits="userSpaceOnUse" x="27" y="26" width="459" height="459">
        <circle cx="256.5" cy="255.5" r="229" fill="#fff" />
      </mask>
      <g :mask="`url(#${uid}-disc)`" stroke-opacity="0.7" stroke-width="55" stroke-linecap="round">
        <path d="M28 175H383" :stroke="`url(#${uid}-a)`" />
        <path d="M345 103V487" stroke="#81A1C1" />
        <path d="M160 396H482" :stroke="`url(#${uid}-b)`" />
      </g>
      <defs>
        <linearGradient :id="`${uid}-a`" x1="28" y1="175" x2="383" y2="175" gradientUnits="userSpaceOnUse">
          <stop stop-color="#3D4C5B" />
          <stop offset="1" stop-color="#81A1C1" />
        </linearGradient>
        <linearGradient :id="`${uid}-b`" x1="160" y1="396" x2="482" y2="396" gradientUnits="userSpaceOnUse">
          <stop stop-color="#81A1C1" />
          <stop offset="1" stop-color="#3D4C5B" />
        </linearGradient>
      </defs>
    </svg>
    <span
      class="text-[15px] font-bold tracking-tight whitespace-nowrap text-nord-6"
      :class="compact && 'hidden sm:inline'"
    >
      Koishi <span class="text-nord-8">Memes</span>
    </span>
  </span>
</template>

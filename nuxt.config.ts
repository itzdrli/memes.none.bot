import tailwindcss from "@tailwindcss/vite";

const MEME_ORIGIN = "https://kmeme.itzdrli.cc";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-06-05",
  devtools: { enabled: false },

  modules: ["lenis/nuxt"],

  css: ["~/assets/css/main.css"],

  vite: {
    plugins: [tailwindcss()],
    server: {
      // Tailscale MagicDNS: single-label host "s" + any *.ts.net host
      allowedHosts: ["s", ".ts.net"],
    },
  },

  // Production-only: the dev server needs eval/websockets for HMR. Fonts are
  // self-hosted; the only other origin is the kmeme backend (list + images).
  $production: {
    routeRules: {
      "/**": {
        headers: {
          "Content-Security-Policy": `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: ${MEME_ORIGIN}; font-src 'self'; connect-src 'self' ${MEME_ORIGIN}; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'`,
          "X-Content-Type-Options": "nosniff",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
      },
    },
  },

  app: {
    head: {
      title: "Koishi Memes",
      htmlAttrs: { lang: "zh-CN" },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
        { name: "description", content: "Koishi memes · 瀑布流" },
        { name: "theme-color", content: "#1b1b1b" },
      ],
      // Apply the saved theme before first paint. Kept in sync with useTheme.
      script: [
        {
          innerHTML:
            '(function(){try{var t=localStorage.getItem("mn:theme");if(t)document.documentElement.dataset.theme=t;}catch(e){}})()',
        },
      ],
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/logo.svg" },
        { rel: "preconnect", href: MEME_ORIGIN },
        // Self-hosted by scripts/fetch-fonts.mjs, visitors never contact Google
        { rel: "stylesheet", href: "/fonts/google/fonts.css" },
      ],
    },
  },
});

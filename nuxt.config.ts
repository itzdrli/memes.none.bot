import tailwindcss from "@tailwindcss/vite";

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

  app: {
    head: {
      title: "Koishi Memes",
      htmlAttrs: { lang: "zh-CN" },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: "Koishi memes · 瀑布流" },
        { name: "theme-color", content: "#2e3440" },
      ],
      link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    },
  },
});

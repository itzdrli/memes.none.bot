# [Koishi memes](https://memes.none.bot)

Koishi meme 瀑布流浏览站，数据来自 [`kmeme.itzdrli.cc`](https://kmeme.itzdrli.cc)，
投稿走 Telegram bot [@FantasticSpoonBot](https://t.me/FantasticSpoonBot)。

视觉跟 [FantasticFrame](https://ff.itzdrli.cc) 同一套：graphite / nord 等主题色板、
扁平直角、自托管 IBM Plex Sans + Noto Sans SC、FantasticSpoon 标识。

## 技术栈

- **Nuxt 4** + **Vue 3**（SSR 首屏）
- **Tailwind CSS v4**（`@tailwindcss/vite`），颜色用 `nord-0..15` 亮度角色，主题切换只改 CSS 变量
- **Lenis** 平滑滚动，图标用 `@lucide/vue`
- **oxlint** + **vue-tsc**

## 功能

- 瀑布流：每张图放进当前最短的一列，滚到底部附近再加载下一批
- 搜索标题（按 `/` 聚焦，忽略空格），随机 / 最新排序，一键重新打乱
- 大图预览：← → 或滑动切换，复制链接、下载、打开原图；`?m=<id>` 可以直接分享某一张
- 5 套主题（石墨、北境、暮色、霜白、沙纸），保存在本地，首屏不闪
- 生产环境带 CSP，只允许连本站和 kmeme 后端；字体自托管，不请求 Google

## 开发

```bash
yarn install
yarn dev        # http://localhost:3000（首次会下载字体到 public/fonts/google）
yarn build      # 生产构建
yarn lint       # oxlint
yarn typecheck  # vue-tsc
```

# [Koishi memes](https://memes.none.bot)

Nord 深色瀑布流的 meme 浏览站，数据来自 [`kmeme.itzdrli.cc`](https://kmeme.itzdrli.cc)。

## 技术栈

- **Nuxt 4** + **Vue 3**（SSR 首屏）
- **Tailwind CSS v4**（`@tailwindcss/vite`）
- **oxc / oxlint** 作为 lint 工具链
- Nord 深色配色

## 功能

- 全屏瀑布流（CSS columns），打开即浏览全部 meme
- 无限滚动：列表分批渲染，图片 `loading="lazy"` 按需加载，往下滑才拉取
- 点击任意图片查看详情（标题 + 图片）
- 页脚带 Telegram 频道链接 [@koimemes](https://t.me/koimemes)

## 开发

```bash
yarn install
yarn dev        # http://localhost:3000
yarn build      # 生产构建
yarn lint       # oxlint
```

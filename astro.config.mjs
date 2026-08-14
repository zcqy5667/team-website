import { defineConfig } from "astro/config";

export default defineConfig({
  // 不在最终页面和截图中显示 Astro 开发工具栏。
  devToolbar: {
    enabled: false,
  },
});

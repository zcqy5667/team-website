# 战队展示网站维护说明

这是一个使用 Astro + TypeScript 重构后的 RoboMaster 单战队展示网站。网站源码在 `src/` 中维护，构建后会输出静态页面到 `dist/`，适合部署到任意静态托管平台。

旧版根目录 HTML/CSS/JS 文件已经保留并整体注释，作为迁移前备份；日常开发请不要再维护旧文件。

## 快速开始

首次安装依赖：

```bash
npm install
```

启动本地开发服务：

```bash
npm run dev
```

默认访问地址：

```text
http://localhost:4321
```

构建静态站：

```bash
npm run build
```

预览构建结果：

```bash
npm run preview
```

## Cloudflare Pages 发布设置

本项目不能直接把仓库根目录当作静态目录发布，因为根目录里的旧 `index.html` 已经被注释停用。Cloudflare Pages 必须执行 Astro 构建，并发布 `dist/`。

Cloudflare Pages 推荐设置：

```text
Framework preset: Astro
Build command: npm run build
Build output directory: dist
Root directory: /
Node.js version: 22
```

如果 Cloudflare 没有自动使用 Node 22，可以在环境变量里添加：

```text
NODE_VERSION=22
```

发布后实际访问的是构建产物中的页面，而不是根目录旧 HTML。

## 目录说明

```text
.
├── src/
│   ├── pages/              # 页面入口，决定网站有哪些 URL
│   ├── components/         # 可复用组件，例如轮播、卡片、页头、页脚
│   ├── layouts/            # 全站 HTML 布局
│   ├── data/siteData.ts    # 战队、轮播、兵种、媒体数据
│   └── styles/styles.css   # 全站样式
├── public/assets/
│   ├── images/             # 图片、SVG、封面图
│   └── media/              # 视频文件
├── dist/                   # build 后生成，不手动修改
├── package.json            # npm 脚本和依赖
├── astro.config.mjs        # Astro 配置
└── tsconfig.json           # TypeScript 配置
```

当前页面：

- `/`：首页，包含轮播、战队介绍、兵种预览、媒体入口预览
- `/units/`：完整兵种图鉴
- `/media/`：媒体中心入口，只展示图片、视频、记录三个入口
- `/images/`：图片区
- `/videos/`：视频区
- `/records/`：记录区

## 最常修改哪里

大多数内容只需要改一个文件：

```text
src/data/siteData.ts
```

常见维护点：

- 改战队资料：修改 `team`
- 改首页轮播：修改 `heroSlides`
- 改兵种卡片：修改 `units`
- 改图片、视频、记录素材：修改 `media`
- 改页面结构：修改 `src/pages/`
- 改卡片或轮播复用逻辑：修改 `src/components/`
- 改颜色、布局、响应式：修改 `src/styles/styles.css`

## 资源路径规则

图片和视频放在 `public/assets/` 下。

示例文件：

```text
public/assets/images/training.jpg
public/assets/media/season-review.mp4
```

在 `siteData.ts` 中引用时，要使用以 `/assets/` 开头的路径：

```ts
src: "/assets/images/training.jpg"
poster: "/assets/images/video-cover.jpg"
```

不要写成 `public/assets/...`，也不要写相对路径 `../assets/...`。

## 修改战队资料

编辑 `src/data/siteData.ts` 中的 `team`：

```ts
export const team: Team = {
  name: "xxxx 战队",
  school: "xxxx 大学",
  location: "xxxx",
  slogan: "为机甲而生，为热爱而战",
  logo: "RM",
  cover: "/assets/images/team-placeholder.svg",
  summary: "战队简介",
  detail: "更详细的战队介绍",
  tags: ["机械结构", "嵌入式电控", "视觉算法"],
  stats: [
    { value: "1", label: "核心战队" },
    { value: "7", label: "兵种系统" }
  ]
};
```

`cover` 是首页战队介绍的大图。

## 修改首页轮播

编辑 `heroSlides`。每张轮播只保留一个主按钮：

```ts
{
  kicker: "RoboMaster Team",
  title: "让机甲在赛场上醒来",
  description: "从结构设计到算法调参，从赛前测试到赛场对抗。",
  primaryLabel: "了解战队",
  primaryHref: "/#team",
  image: "/assets/images/hero-arena.svg"
}
```

常用跳转：

- 跳到首页战队区：`/#team`
- 跳到兵种页：`/units/`
- 跳到媒体中心：`/media/`

如果新增或减少轮播项，不需要改轮播脚本，进度条会自动适配数量。

## 添加或修改兵种

编辑 `units` 数组。

示例：

```ts
{
  id: "hero",
  number: "01",
  name: "英雄机器人",
  role: "重火力核心",
  image: "/assets/images/unit-hero.svg",
  summary: "承担关键输出与目标打击任务。",
  functions: ["远距离火力压制", "关键目标打击"],
  tags: ["高能弹丸", "高精度发射"]
}
```

注意：

- `id` 会生成锚点，例如 `/units/#hero`
- `number` 是卡片左上角编号
- `functions` 是功能标签
- `tags` 是技术或定位标签
- 首页只展示前 4 个兵种，完整列表在 `/units/`

## 添加图片素材

1. 把图片放入 `public/assets/images/`
2. 在 `media` 数组中添加：

```ts
{
  type: "image",
  title: "训练现场",
  caption: "记录调试、对抗训练和赛前联调过程。",
  src: "/assets/images/training.jpg",
  featured: true
}
```

添加后会出现在 `/images/` 页面。

`/media/` 媒体中心入口只取图片分类中的第一项作为图片区代表图。

## 添加视频素材

1. 把视频放入 `public/assets/media/`
2. 建议同时准备一张封面图放入 `public/assets/images/`
3. 在 `media` 数组中添加：

```ts
{
  type: "video",
  title: "赛季混剪",
  caption: "战队赛季纪录片。",
  src: "/assets/media/season-review.mp4",
  poster: "/assets/images/video-cover.jpg",
  featured: true
}
```

如果暂时没有视频文件，可以把 `src` 留空：

```ts
src: "",
poster: "/assets/images/video-placeholder.svg"
```

页面会显示封面图，不会报错。

## 添加记录内容

记录适合放赛季目标、训练节点、比赛复盘、阶段成果等文字型内容。

```ts
{
  type: "record",
  title: "赛季记录",
  caption: "用于整理赛季目标、训练节点、比赛复盘和阶段性成果。",
  src: "/assets/images/media-stage.svg",
  featured: false
}
```

添加后会出现在 `/records/` 页面。

`src` 是记录卡片使用的代表图片。

## 媒体中心逻辑

`/media/` 只作为入口页，不直接展示完整素材列表。

它有三个入口：

- 图片区：跳转 `/images/`
- 视频区：跳转 `/videos/`
- 记录区：跳转 `/records/`

顶部导航不会直接出现图片、视频、记录三个页面，保证用户只能从媒体中心看到这些分区入口。

## 新增页面

如果要新增页面，例如 `/about/`：

1. 新建文件：

```text
src/pages/about.astro
```

2. 使用全站布局：

```astro
---
import Layout from "../layouts/Layout.astro";
---

<Layout title="关于我们" description="关于战队的更多信息。">
  <section class="page-hero page-hero-media">
    <div class="page-hero-content">
      <p class="eyebrow">About</p>
      <h1>关于我们</h1>
      <p>这里填写页面内容。</p>
    </div>
  </section>
</Layout>
```

3. 如果要出现在顶部导航，修改 `src/components/Header.astro` 中的 `navItems`。

## 修改样式

全站样式在：

```text
src/styles/styles.css
```

常见类名：

- `.site-header`：顶部导航
- `.hero-slider`：首页轮播区域
- `.section`：通用页面区块
- `.team-showcase`：战队介绍区
- `.unit-card`：兵种卡片
- `.media-card`：媒体素材卡片
- `.media-entry-card`：媒体中心入口卡片
- `.page-hero`：内页顶部大图区域

响应式样式在文件底部的 `@media` 中维护。

## 组件分工

```text
src/components/Header.astro          # 顶部导航
src/components/Footer.astro          # 页脚
src/components/HeroSlider.astro      # 首页轮播和轮播交互脚本
src/components/TeamShowcase.astro    # 战队介绍
src/components/UnitCard.astro        # 兵种卡片
src/components/MediaCard.astro       # 图片/视频/记录详情卡片
src/components/MediaEntryCard.astro  # 媒体中心入口卡片
src/components/TagList.astro         # 标签列表
```

如果只是改内容，优先改 `siteData.ts`；只有需要改变页面结构或卡片样式时，再改组件。

## 旧代码说明

这些旧文件已整体注释停用：

```text
index.html
units.html
media.html
css/styles.css
js/main.js
js/site-data.js
```

它们只作为迁移前备份保留。新版站点不依赖它们。

## 发布前检查

每次较大修改后建议执行：

```bash
npm run build
```

确认构建通过后，再检查：

- 首页轮播每张只有一个按钮
- `/media/` 只有三个入口卡片
- 每个媒体入口只有一张代表图
- `/images/`、`/videos/`、`/records/` 能正常打开
- 顶部导航只有：首页、战队、兵种、媒体
- 移动端没有文字溢出或布局重叠

## 维护建议

- 图片建议使用 `jpg`、`png`、`webp` 或 `svg`
- 视频建议使用 `mp4` 或 `webm`
- 图片和视频文件名建议使用英文、小写、短横线，例如 `season-review.mp4`
- 兵种文案保持展示型描述，避免写太细的赛季参数
- 修改数据后优先跑 `npm run build`，TypeScript 会帮忙检查字段是否缺失或类型错误

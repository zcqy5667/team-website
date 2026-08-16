# 战队展示网站维护说明

这是一个使用 Astro + TypeScript 构建的 RoboMaster 单战队展示网站。源码在 `src/` 中维护，构建产物输出到 `dist/`。

## 快速开始

```bash
npm install
npm run dev
npm run build
```

默认开发地址：`http://localhost:4321`

Cloudflare Pages 设置：

```text
Build command: npm run build
Build output directory: dist
Node.js version: 22
```

## 页面结构

- `/`：首页，包含首屏轮播、战队介绍和兵种预览
- `/units/`：完整兵种图鉴
- `/division/`：分工目录和分工详情
- `/honors/`：唯一的荣誉与成果展示页
- `/contact/`：联系与招新入口

`/honors/` 采用“分类导航 → 页面内锚点 → 直接内容展示”的结构。分类入口不承载成果图片，也不打开弹窗；图片、视频和记录内容都在对应分类区内连续浏览。

## 目录说明

```text
src/
├── pages/              # 页面入口和路由
├── components/         # 可复用组件
├── layouts/            # 全站 HTML 布局
├── data/siteData.ts    # 战队、轮播、兵种、分工和成果数据
└── styles/styles.css   # 全站样式

public/assets/
├── images/             # 图片、封面图
└── media/              # 视频文件
```

## 内容维护

大多数内容只需要修改 `src/data/siteData.ts`：

- `team`：战队资料
- `heroSlides`：首页轮播
- `units`：兵种目录
- `divisionGroups`：分工目录
- `showcaseCategories`：荣誉与成果分类及内容

资源路径使用 `/assets/` 开头，例如：

```ts
{
  type: "image",
  title: "步兵赛季战绩展示",
  caption: "队员分工与赛场数据记录。",
  src: "/assets/images/honor-season-prep.jpg"
}
```

成果分类的数据结构如下：

```ts
type ShowcaseCategory = {
  id: string;
  label: string;
  description: string;
  items: ShowcaseItem[];
};

type ShowcaseItem = {
  type: "image" | "video" | "record";
  title: string;
  caption: string;
  src: string;
  poster?: string;
  imageAlt?: string;
  result?: string;
};
```

新增分类时，只有当分类拥有实际内容时才会显示分类导航和内容区。分类 `id` 会成为页面锚点，例如 `/honors/#robomaster-season`。

视频示例：

```ts
{
  type: "video",
  title: "赛季混剪",
  caption: "战队赛季纪录片。",
  src: "/assets/media/season-review.mp4",
  poster: "/assets/images/video-poster.png"
}
```

## 组件与样式

- `src/components/Header.astro`：顶部导航
- `src/components/Footer.astro`：页脚
- `src/components/HeroSlider.astro`：首页轮播
- `src/components/TeamShowcase.astro`：战队介绍
- `src/components/UnitCard.astro`：兵种卡片
- `src/components/SiteInteractions.astro`：其他页面使用的全局交互和弹窗
- `src/styles/styles.css`：全站颜色、布局和响应式样式

成果页通过 `enableInteractions={false}` 禁用全局弹窗，因此不会出现遮罩、“查看详情”或“查看完整页面”交互。

## 发布前检查

```bash
npm run build
```

确认：

- `/honors/` 分类链接可以通过 hash 跳到对应内容区
- 成果图片不会被分类入口遮挡
- 页面没有成果弹窗和无目标跳转按钮
- 移动端分类导航可横向滚动
- 旧的 `/media/`、`/images/`、`/videos/`、`/records/` 路由不再生成

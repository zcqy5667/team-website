# RoboMaster 单战队展示站

这是一个纯静态 RoboMaster 机甲大师单战队展示网站，包含首页大视觉轮播、单战队介绍、兵种功能图鉴、图片/视频媒体中心。项目不依赖构建工具，直接打开 HTML 或启动静态服务即可预览。

## 页面结构

```text
.
├── index.html          # 首页：首屏轮播、战队概览、兵种预览、媒体预览
├── units.html          # 兵种详情页：完整展示 RoboMaster 兵种与功能
├── media.html          # 媒体中心：集中展示图片和视频
├── css/
│   └── styles.css      # 全站科技风样式和响应式布局
├── js/
│   ├── site-data.js    # 全站可维护数据
│   └── main.js         # 渲染、轮播、导航状态逻辑
└── assets/
    ├── images/         # SVG 占位图、轮播图、兵种图、封面图
    └── media/          # 放置 mp4 / webm 等视频素材
```

## 常用修改位置

- 修改战队名称、学校、简介、口号、标签：编辑 `js/site-data.js` 中的 `team`
- 修改首页轮播：编辑 `js/site-data.js` 中的 `heroSlides`
- 修改兵种内容：编辑 `js/site-data.js` 中的 `units`
- 修改媒体图片和视频：编辑 `js/site-data.js` 中的 `media`
- 替换图片资源：把图片放入 `assets/images/`，再修改对应 `image`、`src` 或 `poster`
- 添加视频资源：把视频放入 `assets/media/`，再修改媒体项的 `src`
- 修改整体视觉风格：编辑 `css/styles.css`

## 修改首页轮播

每个轮播项包含标题、说明、按钮和背景图：

```js
{
  kicker: "RoboMaster Team",
  title: "让机甲在赛场上醒来",
  description: "xxxx",
  primaryLabel: "了解战队",
  primaryHref: "index.html#team",
  secondaryLabel: "查看兵种",
  secondaryHref: "units.html",
  image: "assets/images/hero-arena.svg",
  meta: ["Mechanical", "Embedded", "Vision"]
}
```

建议保持 3 张轮播图，视觉节奏更稳定。`primaryHref` 和 `secondaryHref` 可以写页面链接，也可以写首页锚点。

## 修改兵种

兵种数据默认包含英雄、工程、步兵、哨兵、空中、飞镖系统、雷达。可以直接修改文案，也可以增删项目：

```js
{
  id: "hero",
  number: "01",
  name: "英雄机器人",
  role: "重火力核心",
  image: "assets/images/unit-hero.svg",
  summary: "xxxx",
  functions: ["远距离火力压制", "关键目标打击"],
  tags: ["高能弹丸", "高精度发射"]
}
```

`id` 会用于 `units.html#hero` 这类跳转锚点，建议使用英文小写。

## 添加图片或视频

图片示例：

```js
{
  type: "image",
  title: "训练现场",
  caption: "2026 赛季 xxxx",
  src: "assets/images/training.jpg",
  featured: true
}
```

视频示例：

```js
{
  type: "video",
  title: "赛季混剪",
  caption: "战队赛季纪录片",
  src: "assets/media/season-review.mp4",
  poster: "assets/images/video-cover.jpg",
  featured: true
}
```

如果视频暂时没有文件，可以把 `src` 留空，页面会显示 `poster` 占位图。`featured: true` 的素材会出现在首页媒体预览。

## 本地预览

直接打开 `index.html` 可以预览。更推荐启动静态服务：

```bash
python -m http.server 4173 --bind 127.0.0.1
```

然后访问：

```text
http://localhost:4173
```

## 维护建议

- 真实上线前，把 `xxxx` 替换为正式战队资料。
- 图片建议使用 `jpg`、`png`、`webp` 或 `svg`。
- 视频建议使用 `mp4` 或 `webm`，并准备一张 16:9 封面图。
- 兵种文案建议保持展示型描述，不写过细赛季参数，避免规则更新后频繁改动。
- 当前视觉资产为项目内 SVG，占位清晰且便于版本管理；后续可替换为真实图片或 AI 生成图。

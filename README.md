# Canvas Drawing Editor

[![npm version](https://img.shields.io/npm/v/canvas-drawing-editor.svg)](https://www.npmjs.com/package/canvas-drawing-editor)
[![GitHub](https://img.shields.io/github/license/typsusan-zzz/canvas-drawing-editor)](https://github.com/typsusan-zzz/canvas-drawing-editor)

[中文](#中文) | [English](#english)

**GitHub**: https://github.com/typsusan-zzz/canvas-drawing-editor

**NPM**: https://www.npmjs.com/package/canvas-drawing-editor

**在线文档 / Documentation**: https://typsusan-zzz.github.io/canvas-drawing-editor/

---

<a name="中文"></a>
## 中文

一个强大的基于 Canvas 的画布编辑器 Web Component，**零依赖**，支持 **Vue 2/3**、**React**、**Angular** 和**原生 HTML**。

### ✨ 功能特性

- 🎨 **绑图工具** - 画笔、矩形、圆形、线条、箭头、多边形、文本
- 🖼️ **图片支持** - 导入和编辑图片，支持亮度/对比度/模糊等滤镜
- 🔍 **缩放平移** - 鼠标滚轮以光标为中心缩放，拖拽平移画布
- ↩️ **撤销/重做** - 完整的历史记录支持（Ctrl+Z / Ctrl+Y）
- 📚 **图层管理** - 图层上移/下移/置顶/置底，可见性和锁定控制
- 🔗 **组合/解组** - 多选对象组合（Ctrl+G）和解组（Ctrl+Shift+G）
- 📐 **对齐/分布** - 左/中/右对齐，水平/垂直分布
- 🔥 **热区功能** - 给文本绑定动态变量，实现模板化动态替换
- 💾 **导入导出** - JSON 格式保存/加载项目，PNG 格式导出
- ⚡ **零依赖** - 纯 JavaScript 实现，无需 React/Vue
- 🎛️ **可配置** - 通过 tool 配置对象显示/隐藏任意工具
- 📦 **轻量级** - gzip 后约 33KB
- 🔄 **旋转控制** - 对象旋转手柄，支持自由旋转
- ⚖️ **等比缩放** - Shift + 拖拽角点保持宽高比
- ⭐ **更多形状** - 星形、心形、三角形、菱形、贝塞尔曲线
- ✏️ **线条样式** - 实线/虚线/点线样式，单向/双向箭头
- 🖋️ **富文本** - 支持部分加粗、部分改色、部分斜体
- 🎬 **Tween 动画** - 对象属性过渡动画（位置、大小、透明度等）
- 📱 **移动端支持** - 单指拖拽、双指缩放/旋转、长按选择、响应式布局

### 📦 安装

```bash
npm install canvas-drawing-editor
```

### 🚀 使用方法

#### 原生 HTML

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    canvas-drawing-editor { width: 100%; height: 600px; display: block; }
  </style>
</head>
<body>
  <canvas-drawing-editor title="我的画板"></canvas-drawing-editor>

  <script src="https://unpkg.com/canvas-drawing-editor/dist/canvas-drawing-editor.umd.js"></script>
</body>
</html>
```

#### Vue 3

```vue
<template>
  <canvas-drawing-editor
    title="Vue 画板"
    style="width: 100%; height: 600px;"
  ></canvas-drawing-editor>
</template>

<script setup>
import 'canvas-drawing-editor';
</script>
```

**可选配置：** 如果控制台出现 `Failed to resolve component: canvas-drawing-editor` 警告，可在 `vite.config.ts` 中添加以下配置来消除警告：
```ts
export default defineConfig({
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag === 'canvas-drawing-editor'
      }
    }
  }
});
```

#### Vue 2

```javascript
// main.js
import 'canvas-drawing-editor'

// 可选：如需消除控制台警告
// Vue.config.ignoredElements = ['canvas-drawing-editor']
```

```vue
<template>
  <canvas-drawing-editor
    title="Vue2 画板"
    style="width: 100%; height: 600px;"
  ></canvas-drawing-editor>
</template>
```

#### React

```tsx
import 'canvas-drawing-editor';

function App() {
  return (
    <canvas-drawing-editor
      title="React 画板"
      style={{ width: '100%', height: '600px' }}
    />
  );
}
```

#### Angular

```typescript
// app.module.ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import 'canvas-drawing-editor';

@NgModule({
  // ...
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
```

```html
<!-- app.component.html -->
<canvas-drawing-editor
  title="Angular 画板"
  style="width: 100%; height: 600px;"
></canvas-drawing-editor>
```

### ⚙️ 配置项

#### 基础属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | string | "Canvas Editor" | 编辑器标题 |
| `lang` | string | "zh" | 界面语言（"zh" 中文，"en" 英文） |
| `theme-color` | string | "#5450dc" | 主题色（影响按钮、悬停状态等） |
| `initial-data` | string | - | 初始化 JSON 数据（格式见下方） |
| `enable-hotzone` | boolean | false | 是否启用热区功能（管理员模式） |
| `hotzone-data` | string | - | 热区变量数据（JSON 格式，用于动态替换文本） |
| `tool-config` | string | - | 工具配置对象（JSON 格式，见下方） |

#### 工具配置（tool-config）

推荐使用 `tool-config` 属性统一配置工具显示：

```html
<canvas-drawing-editor
  tool-config='{"pencil":true,"rectangle":true,"circle":true,"line":true,"arrow":true,"polygon":true,"text":true,"image":true,"undo":true,"redo":true,"zoom":true,"download":true,"exportJson":true,"importJson":true,"clear":true,"color":true,"layers":true,"group":true,"align":true}'
></canvas-drawing-editor>
```

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `pencil` | boolean | true | 画笔工具 |
| `rectangle` | boolean | true | 矩形工具 |
| `circle` | boolean | true | 圆形工具 |
| `line` | boolean | true | 线条工具 |
| `arrow` | boolean | true | 箭头工具 |
| `polygon` | boolean | true | 多边形工具 |
| `text` | boolean | true | 文本工具 |
| `image` | boolean | true | 图片导入 |
| `undo` | boolean | true | 撤销按钮 |
| `redo` | boolean | true | 重做按钮 |
| `zoom` | boolean | true | 缩放控制 |
| `download` | boolean | true | PNG 导出 |
| `exportJson` | boolean | true | JSON 保存 |
| `importJson` | boolean | true | JSON 加载 |
| `clear` | boolean | true | 清空画布 |
| `color` | boolean | true | 颜色选择器 |
| `layers` | boolean | true | 图层管理 |
| `group` | boolean | true | 组合/解组 |
| `align` | boolean | true | 对齐/分布 |

#### 旧版属性（向后兼容）

仍支持单独的 `show-*` 属性，但推荐使用 `tool-config`：

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `show-pencil` | boolean | true | 显示画笔工具 |
| `show-rectangle` | boolean | true | 显示矩形工具 |
| `show-circle` | boolean | true | 显示圆形工具 |
| `show-line` | boolean | true | 显示线条工具 |
| `show-arrow` | boolean | true | 显示箭头工具 |
| `show-polygon` | boolean | true | 显示多边形工具 |
| `show-text` | boolean | true | 显示文本工具 |
| `show-image` | boolean | true | 显示图片导入 |
| `show-undo` | boolean | true | 显示撤销按钮 |
| `show-redo` | boolean | true | 显示重做按钮 |
| `show-zoom` | boolean | true | 显示缩放控制 |
| `show-download` | boolean | true | 显示 PNG 导出 |
| `show-export` | boolean | true | 显示 JSON 保存 |
| `show-import` | boolean | true | 显示 JSON 加载 |
| `show-color` | boolean | true | 显示颜色选择器 |
| `show-clear` | boolean | true | 显示清空画布按钮 |
| `show-layers` | boolean | true | 显示图层管理 |
| `show-group` | boolean | true | 显示组合/解组 |
| `show-align` | boolean | true | 显示对齐/分布 |

### 📊 初始化数据

可以通过 `initial-data` 属性传入 JSON 数据来初始化画布内容：

```html
<canvas-drawing-editor
  initial-data='{"objects":[{"id":"abc123","type":"RECTANGLE","x":100,"y":100,"width":200,"height":150,"color":"#3b82f6","lineWidth":2}]}'
></canvas-drawing-editor>
```

### 📡 事件监听

#### `editor-change` 事件

当画布内容变化时触发。`e.detail.objects` 数组包含所有绑图对象。

```javascript
document.addEventListener('editor-change', (e) => {
  console.log('对象列表:', e.detail.objects);
  // 保存到服务器或 localStorage
  localStorage.setItem('canvas-data', JSON.stringify({ objects: e.detail.objects }));
});
```

#### 对象类型和属性说明

`e.detail.objects` 中每个对象都有以下基础属性：

| 属性 | 类型 | 说明 |
|------|------|------|
| `id` | string | 唯一标识符 |
| `type` | string | 对象类型：`RECTANGLE`、`CIRCLE`、`PATH`、`TEXT`、`RICH_TEXT`、`IMAGE`、`LINE`、`ARROW`、`POLYGON`、`TRIANGLE`、`STAR`、`HEART`、`DIAMOND`、`BEZIER`、`GROUP` |
| `rotation` | number | 旋转角度（弧度，可选，默认 0） |
| `opacity` | number | 透明度（0-1，可选，默认 1） |
| `x` | number | X 坐标 |
| `y` | number | Y 坐标 |
| `color` | string | 描边/填充颜色（十六进制格式，如 `#3b82f6`） |
| `lineWidth` | number | 线条宽度（像素） |
| `visible` | boolean | 是否可见（可选，默认 true） |
| `locked` | boolean | 是否锁定（可选，默认 false） |

**矩形** (`type: "RECTANGLE"`)：
| 属性 | 类型 | 说明 |
|------|------|------|
| `width` | number | 矩形宽度 |
| `height` | number | 矩形高度 |

**圆形** (`type: "CIRCLE"`)：
| 属性 | 类型 | 说明 |
|------|------|------|
| `radius` | number | 圆形半径 |

**画笔路径** (`type: "PATH"`)：
| 属性 | 类型 | 说明 |
|------|------|------|
| `points` | Array<{x, y}> | 点坐标数组 |

**线条** (`type: "LINE"`)：
| 属性 | 类型 | 说明 |
|------|------|------|
| `x2` | number | 终点 X 坐标 |
| `y2` | number | 终点 Y 坐标 |

**箭头** (`type: "ARROW"`)：
| 属性 | 类型 | 说明 |
|------|------|------|
| `x2` | number | 终点 X 坐标 |
| `y2` | number | 终点 Y 坐标 |

**多边形** (`type: "POLYGON"`)：
| 属性 | 类型 | 说明 |
|------|------|------|
| `radius` | number | 外接圆半径 |
| `sides` | number | 边数（如 3=三角形，6=六边形） |

**文本** (`type: "TEXT"`)：
| 属性 | 类型 | 说明 |
|------|------|------|
| `text` | string | 文本内容 |
| `fontSize` | number | 字体大小（像素） |
| `fontFamily` | string | 字体（可选，默认 sans-serif） |
| `bold` | boolean | 是否加粗（可选） |
| `italic` | boolean | 是否斜体（可选） |
| `hotzone` | object | 热区配置（可选，详见下方热区功能） |

**图片** (`type: "IMAGE"`)：
| 属性 | 类型 | 说明 |
|------|------|------|
| `width` | number | 图片宽度 |
| `height` | number | 图片高度 |
| `dataUrl` | string | Base64 编码的图片数据 |

**组合** (`type: "GROUP"`)：
| 属性 | 类型 | 说明 |
|------|------|------|
| `width` | number | 组合宽度 |
| `height` | number | 组合高度 |
| `children` | Array | 子对象数组 |

**富文本** (`type: "RICH_TEXT"`)：
| 属性 | 类型 | 说明 |
|------|------|------|
| `segments` | Array | 文本段落数组，每段包含 `text`, `color`, `bold`, `italic`, `fontSize` |
| `fontSize` | number | 默认字体大小（像素） |

**星形** (`type: "STAR"`)：
| 属性 | 类型 | 说明 |
|------|------|------|
| `outerRadius` | number | 外圆半径 |
| `innerRadius` | number | 内圆半径 |
| `points` | number | 星形角数（默认 5） |

**心形** (`type: "HEART"`)、**三角形** (`type: "TRIANGLE"`)、**菱形** (`type: "DIAMOND"`)：
| 属性 | 类型 | 说明 |
|------|------|------|
| `width` | number | 宽度 |
| `height` | number | 高度 |

**贝塞尔曲线** (`type: "BEZIER"`)：
| 属性 | 类型 | 说明 |
|------|------|------|
| `points` | Array | 控制点数组（包含锚点和控制柄） |
| `closed` | boolean | 是否闭合路径 |

#### 示例：保存和加载画布

```javascript
// 保存画布内容
document.addEventListener('editor-change', (e) => {
  const data = JSON.stringify({ objects: e.detail.objects });
  localStorage.setItem('my-canvas', data);
});

// 加载画布内容
const savedData = localStorage.getItem('my-canvas');
if (savedData) {
  document.querySelector('canvas-drawing-editor').setAttribute('initial-data', savedData);
}
```

#### `editor-close` 事件

```javascript
document.addEventListener('editor-close', () => {
  console.log('编辑器已关闭');
});
```

#### `animation-start` 事件

当动画开始时触发。

```javascript
document.addEventListener('animation-start', (e) => {
  console.log('动画开始:', e.detail);
  // e.detail: { tweenId, objectId }
});
```

#### `animation-complete` 事件

当动画完成时触发。

```javascript
document.addEventListener('animation-complete', (e) => {
  console.log('动画完成:', e.detail);
  // e.detail: { tweenId, objectId }
});
```

#### `animation-update` 事件

动画每帧更新时触发。

```javascript
document.addEventListener('animation-update', (e) => {
  console.log('动画进度:', e.detail.progress);
  // e.detail: { tweenId, objectId, progress }
});
```

### 🔥 热区功能

热区功能允许你给文本对象绑定动态变量，实现模板化的动态文本替换。

#### 使用场景

1. 设计模板（如证书、名片、海报）
2. 给文本添加热区，绑定变量名
3. 使用时传入变量值，动态替换文本内容

#### 管理员端（设计模板）

```html
<!-- 启用热区编辑功能 -->
<canvas-drawing-editor
  title="模板设计器"
  enable-hotzone="true"
></canvas-drawing-editor>
```

操作步骤：
1. 创建文本（如："姓名"）
2. 右键点击文本 → 选择「新建热区」
3. 输入变量名（如：`name`）→ 保存
4. 导出 JSON 保存模板

#### 用户端（展示动态数据）

```html
<!-- 传入模板数据和变量值 -->
<canvas-drawing-editor
  initial-data='{"objects":[...]}'
  hotzone-data='{"name": "张三", "company": "XX公司"}'
></canvas-drawing-editor>
```

#### 热区数据结构

```javascript
// 文本对象的热区配置
{
  "type": "TEXT",
  "text": "姓名",
  "hotzone": {
    "variableName": "name",      // 变量名（必填）
    "defaultValue": "默认值",     // 默认值（可选）
    "description": "用户姓名"     // 描述（可选）
  }
}
```

### 🎬 Tween 动画 API

通过 `tweenAnimate()` 方法可以为对象创建平滑的属性过渡动画：

```javascript
const editor = document.querySelector('canvas-drawing-editor');

// 基本用法
editor.tweenAnimate(objectId, { x: 300, y: 200 }, {
  duration: 1000,        // 动画时长（毫秒）
  easing: 'easeOutQuad', // 缓动函数
  onComplete: () => console.log('动画完成')
});

// 可动画属性：x, y, width, height, rotation, opacity, fontSize, radius

// 缓动函数：linear, easeInQuad, easeOutQuad, easeInOutQuad,
//          easeInElastic, easeOutElastic, easeInBounce, easeOutBounce,
//          easeInBack, easeOutBack

// 循环动画
editor.tweenAnimate(objectId, { x: 400 }, {
  duration: 1000,
  repeat: -1,    // 无限循环
  yoyo: true     // 往返
});

// 停止动画
editor.stopAllAnimations();
```

### 🛠️ 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建库
npm run build:lib
```

---

<a name="english"></a>
## English

A powerful canvas-based drawing editor Web Component with **zero dependencies**. Works with **Vue 2/3**, **React**, **Angular**, and **vanilla HTML**.

### ✨ Features

- 🎨 **Drawing Tools** - Pencil, Rectangle, Circle, Line, Arrow, Polygon, Text
- 🖼️ **Image Support** - Import and manipulate images with brightness/contrast/blur filters
- 🔍 **Zoom & Pan** - Mouse wheel zoom centered on cursor, drag to pan
- ↩️ **Undo/Redo** - Full history support (Ctrl+Z / Ctrl+Y)
- 📚 **Layer Management** - Move up/down/top/bottom, visibility and lock control
- 🔗 **Group/Ungroup** - Multi-select and group objects (Ctrl+G / Ctrl+Shift+G)
- 📐 **Align/Distribute** - Left/center/right alignment, horizontal/vertical distribution
- 🔥 **Hotzone** - Bind dynamic variables to text for template-based replacement
- 💾 **Import/Export** - Save and load projects as JSON, export as PNG
- ⚡ **Zero Dependencies** - Pure JavaScript, no React/Vue required
- 🎛️ **Configurable** - Show/hide any tool via tool config object
- 📦 **Lightweight** - ~33KB gzipped
- 🔄 **Rotation Control** - Object rotation handle for free rotation
- ⚖️ **Proportional Scaling** - Shift + drag corner to maintain aspect ratio
- ⭐ **More Shapes** - Star, Heart, Triangle, Diamond, Bezier curves
- ✏️ **Line Styles** - Solid/dashed/dotted styles, single/double arrows
- 🖋️ **Rich Text** - Support partial bold, partial color, partial italic
- 🎬 **Tween Animation** - Object property transition animations (position, size, opacity, etc.)
- 📱 **Mobile Support** - Single finger drag, two-finger zoom/rotate, long press selection, responsive layout

### 📦 Installation

```bash
npm install canvas-drawing-editor
```

### 🚀 Usage

#### Vanilla HTML

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    canvas-drawing-editor { width: 100%; height: 600px; display: block; }
  </style>
</head>
<body>
  <canvas-drawing-editor title="My Canvas"></canvas-drawing-editor>

  <script src="https://unpkg.com/canvas-drawing-editor/dist/canvas-drawing-editor.umd.js"></script>
</body>
</html>
```

#### Vue 3

```vue
<template>
  <canvas-drawing-editor
    title="Vue Canvas"
    style="width: 100%; height: 600px;"
  ></canvas-drawing-editor>
</template>

<script setup>
import 'canvas-drawing-editor';
</script>
```

**Optional:** To suppress the `Failed to resolve component: canvas-drawing-editor` warning in the console, add to `vite.config.ts`:
```ts
export default defineConfig({
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag === 'canvas-drawing-editor'
      }
    }
  }
});
```

#### Vue 2

```javascript
// main.js
import 'canvas-drawing-editor'

// Optional: To suppress console warnings
// Vue.config.ignoredElements = ['canvas-drawing-editor']
```

```vue
<template>
  <canvas-drawing-editor
    title="Vue2 Canvas"
    style="width: 100%; height: 600px;"
  ></canvas-drawing-editor>
</template>
```

#### React

```tsx
import 'canvas-drawing-editor';

function App() {
  return (
    <canvas-drawing-editor
      title="React Canvas"
      style={{ width: '100%', height: '600px' }}
    />
  );
}
```

#### Angular

```typescript
// app.module.ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import 'canvas-drawing-editor';

@NgModule({
  // ...
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
```

```html
<!-- app.component.html -->
<canvas-drawing-editor
  title="Angular Canvas"
  style="width: 100%; height: 600px;"
></canvas-drawing-editor>
```

### ⚙️ Configuration

#### Basic Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | string | "Canvas Editor" | Editor title |
| `lang` | string | "zh" | UI language ("zh" for Chinese, "en" for English) |
| `theme-color` | string | "#5450dc" | Theme color (affects buttons, hover states, etc.) |
| `initial-data` | string | - | Initial JSON data to render (see format below) |
| `enable-hotzone` | boolean | false | Enable hotzone feature (admin mode) |
| `hotzone-data` | string | - | Hotzone variable data (JSON format for dynamic text replacement) |
| `tool-config` | string | - | Tool configuration object (JSON format, see below) |

#### Tool Configuration (tool-config)

Recommended: Use `tool-config` attribute for unified tool configuration:

```html
<canvas-drawing-editor
  tool-config='{"pencil":true,"rectangle":true,"circle":true,"line":true,"arrow":true,"polygon":true,"text":true,"image":true,"undo":true,"redo":true,"zoom":true,"download":true,"exportJson":true,"importJson":true,"clear":true,"color":true,"layers":true,"group":true,"align":true}'
></canvas-drawing-editor>
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `pencil` | boolean | true | Pencil tool |
| `rectangle` | boolean | true | Rectangle tool |
| `circle` | boolean | true | Circle tool |
| `line` | boolean | true | Line tool |
| `arrow` | boolean | true | Arrow tool |
| `polygon` | boolean | true | Polygon tool |
| `text` | boolean | true | Text tool |
| `image` | boolean | true | Image import |
| `undo` | boolean | true | Undo button |
| `redo` | boolean | true | Redo button |
| `zoom` | boolean | true | Zoom controls |
| `download` | boolean | true | PNG export |
| `exportJson` | boolean | true | JSON save |
| `importJson` | boolean | true | JSON load |
| `clear` | boolean | true | Clear canvas |
| `color` | boolean | true | Color picker |
| `layers` | boolean | true | Layer management |
| `group` | boolean | true | Group/Ungroup |
| `align` | boolean | true | Align/Distribute |

#### Legacy Attributes (Backward Compatible)

Individual `show-*` attributes are still supported but `tool-config` is recommended:

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `show-pencil` | boolean | true | Show pencil tool |
| `show-rectangle` | boolean | true | Show rectangle tool |
| `show-circle` | boolean | true | Show circle tool |
| `show-line` | boolean | true | Show line tool |
| `show-arrow` | boolean | true | Show arrow tool |
| `show-polygon` | boolean | true | Show polygon tool |
| `show-text` | boolean | true | Show text tool |
| `show-image` | boolean | true | Show image import |
| `show-undo` | boolean | true | Show undo button |
| `show-redo` | boolean | true | Show redo button |
| `show-zoom` | boolean | true | Show zoom controls |
| `show-download` | boolean | true | Show PNG export |
| `show-export` | boolean | true | Show JSON save |
| `show-import` | boolean | true | Show JSON load |
| `show-color` | boolean | true | Show color picker |
| `show-clear` | boolean | true | Show clear canvas button |
| `show-layers` | boolean | true | Show layer management |
| `show-group` | boolean | true | Show group/ungroup |
| `show-align` | boolean | true | Show align/distribute |

### 📊 Initial Data

You can pass JSON data to initialize the canvas content:

```html
<canvas-drawing-editor
  initial-data='{"objects":[{"id":"abc123","type":"RECTANGLE","x":100,"y":100,"width":200,"height":150,"color":"#3b82f6","lineWidth":2}]}'
></canvas-drawing-editor>
```

### 📡 Events

#### `editor-change` Event

Fires when canvas content changes. The `e.detail.objects` array contains all drawing objects.

```javascript
document.addEventListener('editor-change', (e) => {
  console.log('Objects:', e.detail.objects);
  // Save to server or localStorage
  localStorage.setItem('canvas-data', JSON.stringify({ objects: e.detail.objects }));
});
```

#### Object Types & Properties

Each object in `e.detail.objects` has the following base properties:

| Property | Type | Description |
|----------|------|-------------|
| `id` | string | Unique identifier |
| `type` | string | Object type: `RECTANGLE`, `CIRCLE`, `PATH`, `TEXT`, `IMAGE`, `LINE`, `ARROW`, `POLYGON`, `GROUP` |
| `x` | number | X coordinate |
| `y` | number | Y coordinate |
| `color` | string | Stroke/fill color (hex format, e.g., `#3b82f6`) |
| `lineWidth` | number | Line width in pixels |
| `visible` | boolean | Visibility (optional, default true) |
| `locked` | boolean | Lock state (optional, default false) |

**Rectangle** (`type: "RECTANGLE"`):
| Property | Type | Description |
|----------|------|-------------|
| `width` | number | Rectangle width |
| `height` | number | Rectangle height |

**Circle** (`type: "CIRCLE"`):
| Property | Type | Description |
|----------|------|-------------|
| `radius` | number | Circle radius |

**Path/Pencil** (`type: "PATH"`):
| Property | Type | Description |
|----------|------|-------------|
| `points` | Array<{x, y}> | Array of point coordinates |

**Line** (`type: "LINE"`):
| Property | Type | Description |
|----------|------|-------------|
| `x2` | number | End point X coordinate |
| `y2` | number | End point Y coordinate |

**Arrow** (`type: "ARROW"`):
| Property | Type | Description |
|----------|------|-------------|
| `x2` | number | End point X coordinate |
| `y2` | number | End point Y coordinate |

**Polygon** (`type: "POLYGON"`):
| Property | Type | Description |
|----------|------|-------------|
| `radius` | number | Circumscribed circle radius |
| `sides` | number | Number of sides (e.g., 3=triangle, 6=hexagon) |

**Text** (`type: "TEXT"`):
| Property | Type | Description |
|----------|------|-------------|
| `text` | string | Text content |
| `fontSize` | number | Font size in pixels |
| `fontFamily` | string | Font family (optional, default sans-serif) |
| `bold` | boolean | Bold style (optional) |
| `italic` | boolean | Italic style (optional) |
| `hotzone` | object | Hotzone config (optional, see Hotzone section) |

**Image** (`type: "IMAGE"`):
| Property | Type | Description |
|----------|------|-------------|
| `width` | number | Image width |
| `height` | number | Image height |
| `dataUrl` | string | Base64 encoded image data |

**Group** (`type: "GROUP"`):
| Property | Type | Description |
|----------|------|-------------|
| `width` | number | Group width |
| `height` | number | Group height |
| `children` | Array | Array of child objects |

#### Example: Saving and Loading

```javascript
// Save canvas content
document.addEventListener('editor-change', (e) => {
  const data = JSON.stringify({ objects: e.detail.objects });
  localStorage.setItem('my-canvas', data);
});

// Load canvas content
const savedData = localStorage.getItem('my-canvas');
if (savedData) {
  document.querySelector('canvas-drawing-editor').setAttribute('initial-data', savedData);
}
```

#### `editor-close` Event

```javascript
document.addEventListener('editor-close', () => {
  console.log('Editor closed');
});
```

#### `animation-start` Event

Triggered when an animation starts.

```javascript
document.addEventListener('animation-start', (e) => {
  console.log('Animation started:', e.detail);
  // e.detail: { tweenId, objectId }
});
```

#### `animation-complete` Event

Triggered when an animation completes.

```javascript
document.addEventListener('animation-complete', (e) => {
  console.log('Animation completed:', e.detail);
  // e.detail: { tweenId, objectId }
});
```

#### `animation-update` Event

Triggered on each animation frame update.

```javascript
document.addEventListener('animation-update', (e) => {
  console.log('Animation progress:', e.detail.progress);
  // e.detail: { tweenId, objectId, progress }
});
```

### 🔥 Hotzone Feature

The hotzone feature allows you to bind dynamic variables to text objects for template-based dynamic text replacement.

#### Use Cases

1. Design templates (certificates, business cards, posters)
2. Add hotzones to text, bind variable names
3. Pass variable values at runtime to dynamically replace text

#### Admin Mode (Design Templates)

```html
<!-- Enable hotzone editing -->
<canvas-drawing-editor
  title="Template Designer"
  enable-hotzone="true"
></canvas-drawing-editor>
```

Steps:
1. Create text (e.g., "Name")
2. Right-click on text → Select "Create Hotzone"
3. Enter variable name (e.g., `name`) → Save
4. Export JSON to save template

#### User Mode (Display Dynamic Data)

```html
<!-- Pass template data and variable values -->
<canvas-drawing-editor
  initial-data='{"objects":[...]}'
  hotzone-data='{"name": "John Doe", "company": "Acme Inc"}'
></canvas-drawing-editor>
```

#### Hotzone Data Structure

```javascript
// Text object with hotzone config
{
  "type": "TEXT",
  "text": "Name",
  "hotzone": {
    "variableName": "name",       // Variable name (required)
    "defaultValue": "Default",    // Default value (optional)
    "description": "User name"    // Description (optional)
  }
}
```

### 🎬 Tween Animation API

Use `tweenAnimate()` method to create smooth property transition animations:

```javascript
const editor = document.querySelector('canvas-drawing-editor');

// Basic usage
editor.tweenAnimate(objectId, { x: 300, y: 200 }, {
  duration: 1000,        // Animation duration (ms)
  easing: 'easeOutQuad', // Easing function
  onComplete: () => console.log('Animation complete')
});

// Animatable properties: x, y, width, height, rotation, opacity, fontSize, radius

// Easing functions: linear, easeInQuad, easeOutQuad, easeInOutQuad,
//                   easeInElastic, easeOutElastic, easeInBounce, easeOutBounce,
//                   easeInBack, easeOutBack

// Loop animation
editor.tweenAnimate(objectId, { x: 400 }, {
  duration: 1000,
  repeat: -1,    // Infinite loop
  yoyo: true     // Reverse on repeat
});

// Stop animations
editor.stopAllAnimations();
```

### 🛠️ Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build library
npm run build:lib
```

---

## 📄 License

MIT © typsusan

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

- 🎨 **绑图工具** - 画笔、矩形、圆形、文本
- 🖼️ **图片支持** - 导入和编辑图片
- 🔍 **缩放平移** - 鼠标滚轮以光标为中心缩放，拖拽平移画布

- 💾 **导入导出** - JSON 格式保存/加载项目，PNG 格式导出
- ⚡ **零依赖** - 纯 JavaScript 实现，无需 React/Vue
- 🎛️ **可配置** - 通过配置显示/隐藏任意工具
- 📦 **轻量级** - gzip 后约 10KB

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

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | string | "Canvas Editor" | 编辑器标题 |
| `show-pencil` | boolean | true | 显示画笔工具 |
| `show-rectangle` | boolean | true | 显示矩形工具 |
| `show-circle` | boolean | true | 显示圆形工具 |
| `show-text` | boolean | true | 显示文本工具 |
| `show-image` | boolean | true | 显示图片导入 |
| `show-zoom` | boolean | true | 显示缩放控制 |
| `show-download` | boolean | true | 显示 PNG 导出 |
| `show-export` | boolean | true | 显示 JSON 保存 |
| `show-import` | boolean | true | 显示 JSON 加载 |
| `show-color` | boolean | true | 显示颜色选择器 |
| `show-clear` | boolean | true | 显示清空画布按钮 |
| `lang` | string | "zh" | 界面语言（"zh" 中文，"en" 英文） |
| `theme-color` | string | "#5450dc" | 主题色（影响按钮、悬停状态等） |
| `initial-data` | string | - | 初始化 JSON 数据（格式见下方） |

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
| `type` | string | 对象类型：`RECTANGLE`、`CIRCLE`、`PATH`、`TEXT`、`IMAGE` |
| `x` | number | X 坐标 |
| `y` | number | Y 坐标 |
| `color` | string | 描边/填充颜色（十六进制格式，如 `#3b82f6`） |
| `lineWidth` | number | 线条宽度（像素） |

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

**文本** (`type: "TEXT"`)：
| 属性 | 类型 | 说明 |
|------|------|------|
| `text` | string | 文本内容 |
| `fontSize` | number | 字体大小（像素） |

**图片** (`type: "IMAGE"`)：
| 属性 | 类型 | 说明 |
|------|------|------|
| `width` | number | 图片宽度 |
| `height` | number | 图片高度 |
| `dataUrl` | string | Base64 编码的图片数据 |

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

- 🎨 **Drawing Tools** - Pencil, Rectangle, Circle, Text
- 🖼️ **Image Support** - Import and manipulate images
- 🔍 **Zoom & Pan** - Mouse wheel zoom centered on cursor, drag to pan

- 💾 **Import/Export** - Save and load projects as JSON, export as PNG
- ⚡ **Zero Dependencies** - Pure JavaScript, no React/Vue required
- 🎛️ **Configurable** - Show/hide any tool via configuration
- 📦 **Lightweight** - ~10KB gzipped

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

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | string | "Canvas Editor" | Editor title |
| `show-pencil` | boolean | true | Show pencil tool |
| `show-rectangle` | boolean | true | Show rectangle tool |
| `show-circle` | boolean | true | Show circle tool |
| `show-text` | boolean | true | Show text tool |
| `show-image` | boolean | true | Show image import |
| `show-zoom` | boolean | true | Show zoom controls |
| `show-download` | boolean | true | Show PNG export |
| `show-export` | boolean | true | Show JSON save |
| `show-import` | boolean | true | Show JSON load |
| `show-color` | boolean | true | Show color picker |
| `show-clear` | boolean | true | Show clear canvas button |
| `lang` | string | "zh" | UI language ("zh" for Chinese, "en" for English) |
| `theme-color` | string | "#5450dc" | Theme color (affects buttons, hover states, etc.) |
| `initial-data` | string | - | Initial JSON data to render (see format below) |

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
| `type` | string | Object type: `RECTANGLE`, `CIRCLE`, `PATH`, `TEXT`, `IMAGE` |
| `x` | number | X coordinate |
| `y` | number | Y coordinate |
| `color` | string | Stroke/fill color (hex format, e.g., `#3b82f6`) |
| `lineWidth` | number | Line width in pixels |

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

**Text** (`type: "TEXT"`):
| Property | Type | Description |
|----------|------|-------------|
| `text` | string | Text content |
| `fontSize` | number | Font size in pixels |

**Image** (`type: "IMAGE"`):
| Property | Type | Description |
|----------|------|-------------|
| `width` | number | Image width |
| `height` | number | Image height |
| `dataUrl` | string | Base64 encoded image data |

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

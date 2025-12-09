/**
 * Canvas Drawing Editor - 纯 JavaScript Web Component
 * 无任何框架依赖，可在 Vue、React、Angular、原生 HTML 中使用
 */

// 导出 Web Component 类和类型
export {
  CanvasDrawingEditor,
  type ToolType,
  type Point,
  type BaseObject,
  type RectObject,
  type CircleObject,
  type PathObject,
  type TextObject,
  type RichTextSegment,
  type RichTextObject,
  type ImageObject,
  type CanvasObject,
  type EditorConfig,
  // Tween动画相关导出
  Easing,
  type EasingFunction,
  type TweenConfig,
  type TweenProps,
  type TweenInstance
} from './core/CanvasDrawingEditor';

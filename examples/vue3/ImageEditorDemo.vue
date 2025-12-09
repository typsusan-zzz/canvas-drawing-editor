<template>
  <!-- 使用 Web Component - 零依赖 -->
  <canvas-drawing-editor
    :title="editorTitle"
    :lang="lang"
    :theme-color="themeColor"
    :tool-config="toolConfigStr"
    class="editor"
  ></canvas-drawing-editor>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import 'canvas-drawing-editor';

// 配置项
const editorTitle = ref('Vue3 画板');
const lang = ref('zh');
const themeColor = ref('#5450dc');

// 工具配置
const toolConfig = ref({
  pencil: true,
  rectangle: true,
  circle: true,
  line: true,
  arrow: true,
  polygon: true,
  text: true,
  image: true,
  undo: true,
  redo: true,
  zoom: true,
  download: true,
  exportJson: true,
  importJson: true,
  clear: true,
  color: true,
  layers: true,
  group: true,
  align: true
});

// 转换为 JSON 字符串
const toolConfigStr = computed(() => JSON.stringify(toolConfig.value));

// 事件处理
const handleEditorChange = (e: CustomEvent) => {
  console.log('画布内容变化:', e.detail.objects);
};

const handleEditorClose = () => {
  console.log('编辑器已关闭');
};

onMounted(() => {
  // 监听 Web Component 事件
  document.addEventListener('editor-change', handleEditorChange as EventListener);
  document.addEventListener('editor-close', handleEditorClose as EventListener);
});

onUnmounted(() => {
  // 清理事件监听
  document.removeEventListener('editor-change', handleEditorChange as EventListener);
  document.removeEventListener('editor-close', handleEditorClose as EventListener);
});
</script>

<style scoped>
.editor {
  width: 100%;
  height: 100vh;
  display: block;
}
</style>

<template>
  <section class="demo-shell">
    <header class="demo-hero">
      <p class="eyebrow">Vue 3 · Web Component</p>
      <h1>Canvas Drawing Editor</h1>
      <p>
        Smooth curves, customizable shapes, and fill-mode controls combine in a zero-dependency Web Component.
        This demo mirrors the dialog-driven usage from a real production layout.
      </p>
    </header>

    <div class="demo-controls">
      <button type="button" class="primary" @click="openEditor">Launch editor</button>
      <label class="control-field">
        Theme color
        <input type="color" v-model="themeColor" />
      </label>
      <label class="control-field">
        Language
        <select v-model="lang">
          <option value="en">English</option>
          <option value="zh">中文</option>
        </select>
      </label>
    </div>

    <p class="demo-hint">
      Use the toolbar to toggle bezier and smooth curve tools, pick stroke/fill/both modes, and see how fills stay alongside smooth paths.
    </p>

    <transition name="fade">
      <div v-if="dialogVisible" class="dialog-backdrop">
        <div class="dialog-panel" role="dialog" aria-modal="true">
          <header class="dialog-header">
            <div>
              <p class="tag">Dialog mode</p>
              <h2>{{ editorTitle }}</h2>
            </div>
            <button class="dialog-close" type="button" @click="handleClose" aria-label="Close editor">×</button>
          </header>

          <canvas-drawing-editor
            class="editor-frame"
            :title="editorTitle"
            :lang="lang"
            :theme-color="themeColor"
            :initial-data="initialDataStr"
            :tool-config="toolConfigStr"
          ></canvas-drawing-editor>

          <footer class="dialog-actions">
            <span class="status">{{ changeSummary }}</span>
            <div class="dialog-buttons">
              <button type="button" class="ghost" @click="handleClose">Cancel</button>
              <button type="button" class="primary" :disabled="saving" @click="handleConfirm">
                {{ saving ? 'Saving…' : 'Confirm' }}
              </button>
            </div>
          </footer>
        </div>
      </div>
    </transition>

    <section class="log-card">
      <h3>Editor events</h3>
      <p class="log-summary">
        Latest change: <strong>{{ changeSummary }}</strong>
      </p>
      <ul>
        <li v-for="entry in logItems" :key="entry">{{ entry }}</li>
      </ul>
    </section>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import 'canvas-drawing-editor';

type Localization = 'zh' | 'en';

const themeColor = ref('#2563eb');
const lang = ref<Localization>('en');
const dialogVisible = ref(false);
const saving = ref(false);
const changeSummary = ref('Awaiting renderer events...');
const logItems = ref<string[]>(['Ready to draw smooth curves.']);
const currentData = ref<{ objects?: unknown[] } | null>(null);

const toolConfig = ref({
  pencil: true,
  rectangle: true,
  circle: true,
  line: true,
  arrow: true,
  doubleArrow: true,
  polygon: true,
  triangle: true,
  star: true,
  heart: true,
  diamond: true,
  bezier: true,
  smoothCurve: true,
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
  align: true,
  fontFamily: true,
  bold: true,
  italic: true,
});

const sampleObjects = [
  {
    id: 'rect-fill',
    type: 'RECTANGLE',
    x: 60,
    y: 90,
    width: 220,
    height: 120,
    color: '#0ea5e9',
    lineWidth: 3,
    fillMode: 'both',
  },
  {
    id: 'circle-fill',
    type: 'CIRCLE',
    x: 360,
    y: 150,
    radius: 80,
    color: '#f59e0b',
    lineWidth: 3,
    fillMode: 'fill',
  },
  {
    id: 'star-stroke',
    type: 'STAR',
    x: 220,
    y: 260,
    points: 5,
    innerRadius: 40,
    outerRadius: 70,
    color: '#ec4899',
    lineWidth: 3,
    fillMode: 'stroke',
  },
  {
    id: 'smooth-curve',
    type: 'SMOOTH_CURVE',
    points: [
      { x: 80, y: 330 },
      { x: 150, y: 300 },
      { x: 250, y: 370 },
      { x: 340, y: 320 },
    ],
    color: '#22c55e',
    lineWidth: 5,
  },
];

const initialData = ref({
  objects: sampleObjects.map(obj => ({ ...obj })),
});

const initialDataStr = computed(() => JSON.stringify(initialData.value));
const toolConfigStr = computed(() => JSON.stringify(toolConfig.value));
const editorTitle = computed(() => (lang.value === 'zh' ? '在线画板' : 'Canvas Drawing Editor'));

const openEditor = () => {
  changeSummary.value = 'Ready for edits — draw a smooth curve or fill a shape.';
  dialogVisible.value = true;
};

const handleClose = () => {
  dialogVisible.value = false;
};

const handleConfirm = () => {
  saving.value = true;
  setTimeout(() => {
    saving.value = false;
    const count = currentData.value?.objects?.length ?? 0;
    logItems.value = [
      `${new Date().toLocaleTimeString()} · Saved ${count} objects`,
      ...logItems.value.slice(0, 2),
    ];
    handleClose();
  }, 400);
};

const handleEditorChange = (event: CustomEvent) => {
  const objects = Array.isArray(event.detail?.objects) ? event.detail.objects : [];
  currentData.value = { objects };
  const lastType = objects.length ? (objects[objects.length - 1] as { type?: string }).type ?? 'shape' : 'shape';
  changeSummary.value = `${objects.length} objects · last build: ${lastType}`;
  logItems.value = [
    `${new Date().toLocaleTimeString()} · ${changeSummary.value}`,
    ...logItems.value.slice(0, 3),
  ];
};

const handleEditorClose = () => {
  dialogVisible.value = false;
  logItems.value = [
    `${new Date().toLocaleTimeString()} · Editor requested close`,
    ...logItems.value.slice(0, 3),
  ];
};

onMounted(() => {
  document.addEventListener('editor-change', handleEditorChange as EventListener);
  document.addEventListener('editor-close', handleEditorClose as EventListener);
});

onUnmounted(() => {
  document.removeEventListener('editor-change', handleEditorChange as EventListener);
  document.removeEventListener('editor-close', handleEditorClose as EventListener);
});
</script>

<style scoped>
.demo-shell {
  min-height: 100vh;
  padding: 2rem;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.demo-hero h1 {
  margin: 0.3rem 0 0.5rem;
  font-size: 2.4rem;
  color: #0f172a;
}

.demo-hero p {
  max-width: 740px;
  color: #475569;
  margin: 0;
}

.eyebrow {
  margin: 0;
  font-size: 0.85rem;
  letter-spacing: 0.2rem;
  text-transform: uppercase;
  color: #64748b;
}

.demo-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.control-field {
  display: inline-flex;
  flex-direction: column;
  font-weight: 500;
  color: #475569;
  font-size: 0.9rem;
  gap: 0.35rem;
}

input,
select {
  margin-top: 0.2rem;
  border-radius: 0.4rem;
  border: 1px solid #cbd5f5;
  padding: 0.35rem 0.6rem;
}

button {
  border: none;
  border-radius: 999px;
  padding: 0.45rem 1.2rem;
  cursor: pointer;
  font-weight: 600;
  background: #2563eb;
  color: #fff;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.ghost {
  background: #e2e8f0;
  color: #0f172a;
}

.primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.primary:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.25);
}

.demo-hint {
  margin: 0;
  color: #334155;
  font-size: 0.95rem;
}

.dialog-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.dialog-panel {
  background: #fff;
  border-radius: 1rem;
  width: min(960px, 100%);
  height: min(720px, 90vh);
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 40px rgba(15, 23, 42, 0.35);
}

.dialog-header {
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
}

.dialog-header h2 {
  margin: 0.25rem 0 0;
}

.tag {
  font-size: 0.8rem;
  color: #64748b;
  margin: 0;
}

.dialog-close {
  background: transparent;
  color: #0f172a;
  font-size: 1.5rem;
  padding: 0.1rem 0.6rem;
  border-radius: 0.35rem;
}

.editor-frame {
  flex: 1;
  display: block;
  border-radius: 0.4rem;
  margin: 1rem 1.5rem;
  overflow: hidden;
}

.dialog-actions {
  padding: 0 1.5rem 1rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.dialog-buttons {
  display: flex;
  gap: 0.5rem;
}

.status {
  color: #475569;
  font-size: 0.9rem;
}

.log-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  padding: 1.25rem 1.5rem;
  max-width: 720px;
}

.log-card ul {
  margin: 0.6rem 0 0;
  padding-left: 1.2rem;
  color: #0f172a;
  font-size: 0.95rem;
}

.log-summary {
  margin: 0;
  color: #475569;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

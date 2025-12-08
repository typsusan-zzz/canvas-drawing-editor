/**
 * Canvas Drawing Editor - 纯 JavaScript Web Component
 * 无任何框架依赖
 */

// 类型定义
export type ToolType = 'SELECT' | 'PENCIL' | 'RECTANGLE' | 'CIRCLE' | 'TEXT' | 'IMAGE';

export interface Point {
  x: number;
  y: number;
}

export interface BaseObject {
  id: string;
  type: string;
  x: number;
  y: number;
  color: string;
  lineWidth: number;
}

export interface RectObject extends BaseObject {
  type: 'RECTANGLE';
  width: number;
  height: number;
}

export interface CircleObject extends BaseObject {
  type: 'CIRCLE';
  radius: number;
}

export interface PathObject extends BaseObject {
  type: 'PATH';
  points: Point[];
}

// 热区配置接口
export interface HotzoneConfig {
  variableName: string;   // 变量名（唯一标识）
  defaultValue?: string;  // 默认值（可选）
  description?: string;   // 描述说明（可选）
}

export interface TextObject extends BaseObject {
  type: 'TEXT';
  text: string;
  fontSize: number;
  hotzone?: HotzoneConfig; // 热区配置（可选）
}

export interface ImageObject extends BaseObject {
  type: 'IMAGE';
  width: number;
  height: number;
  dataUrl: string;
  imageElement?: HTMLImageElement;
}

export type CanvasObject = RectObject | CircleObject | PathObject | TextObject | ImageObject;

export type LangType = 'zh' | 'en';

export interface EditorConfig {
  title?: string;
  showPencil?: boolean;
  showRectangle?: boolean;
  showCircle?: boolean;
  showText?: boolean;
  showImage?: boolean;
  showZoom?: boolean;
  showDownload?: boolean;
  showExport?: boolean;
  showImport?: boolean;
  showColor?: boolean;
  showClear?: boolean;
  lang?: LangType;
  themeColor?: string;
  enableHotzone?: boolean; // 是否启用热区功能，默认false（管理员开启，用户端关闭）
}

// 国际化文本
const i18n: Record<LangType, Record<string, string>> = {
  zh: {
    select: '选择 (V)',
    pencil: '画笔 (P)',
    rectangle: '矩形 (R)',
    circle: '圆形 (O)',
    text: '文本 (T)',
    insertImage: '插入图片',
    undo: '撤销 (Ctrl+Z)',
    colorPicker: '颜色选择',
    zoomOut: '缩小',
    zoomIn: '放大',
    resetZoom: '重置缩放',
    saveProject: '保存项目 (JSON)',
    loadProject: '加载项目 (JSON)',
    exportPng: '导出 PNG',
    clearCanvas: '清空画布',
    clearConfirm: '确定清空画布吗？',
    confirm: '确定',
    cancel: '取消',
    textInputHint: '按 Enter 确认，Esc 取消',
    textPlaceholder: '输入文本...',
    startCreating: '开始创作',
    selectToolHint: '选择左侧的工具开始绘制',
    // 热区相关
    hotzoneCreate: '新建热区',
    hotzoneEdit: '编辑热区',
    hotzoneRemove: '取消热区',
    hotzoneTitle: '热区配置',
    hotzoneVariableName: '变量名',
    hotzoneVariableNamePlaceholder: '请输入变量名（如：name）',
    hotzoneDefaultValue: '默认值',
    hotzoneDefaultValuePlaceholder: '请输入默认值（可选）',
    hotzoneDescription: '描述',
    hotzoneDescriptionPlaceholder: '请输入描述说明（可选）',
    hotzoneSave: '保存',
    hotzoneCancel: '取消',
    hotzoneVariableNameRequired: '变量名不能为空',
  },
  en: {
    select: 'Select (V)',
    pencil: 'Pencil (P)',
    rectangle: 'Rectangle (R)',
    circle: 'Circle (O)',
    text: 'Text (T)',
    insertImage: 'Insert Image',
    undo: 'Undo (Ctrl+Z)',
    colorPicker: 'Color Picker',
    zoomOut: 'Zoom Out',
    zoomIn: 'Zoom In',
    resetZoom: 'Reset Zoom',
    saveProject: 'Save Project (JSON)',
    loadProject: 'Load Project (JSON)',
    exportPng: 'Export PNG',
    clearCanvas: 'Clear Canvas',
    clearConfirm: 'Clear canvas?',
    confirm: 'Confirm',
    cancel: 'Cancel',
    textInputHint: 'Press Enter to confirm, Esc to cancel',
    textPlaceholder: 'Enter text...',
    startCreating: 'Start Creating',
    selectToolHint: 'Select a tool on the left to start drawing',
    // Hotzone related
    hotzoneCreate: 'Create Hotzone',
    hotzoneEdit: 'Edit Hotzone',
    hotzoneRemove: 'Remove Hotzone',
    hotzoneTitle: 'Hotzone Configuration',
    hotzoneVariableName: 'Variable Name',
    hotzoneVariableNamePlaceholder: 'Enter variable name (e.g., name)',
    hotzoneDefaultValue: 'Default Value',
    hotzoneDefaultValuePlaceholder: 'Enter default value (optional)',
    hotzoneDescription: 'Description',
    hotzoneDescriptionPlaceholder: 'Enter description (optional)',
    hotzoneSave: 'Save',
    hotzoneCancel: 'Cancel',
    hotzoneVariableNameRequired: 'Variable name is required',
  },
};

// 默认主题色
const DEFAULT_THEME_COLOR = '#5450dc';

// 默认配置
const defaultConfig: EditorConfig = {
  title: 'Canvas Editor',
  showPencil: true,
  showRectangle: true,
  showCircle: true,
  showText: true,
  showImage: true,
  showZoom: true,
  showDownload: true,
  showExport: true,
  showImport: true,
  showColor: true,
  showClear: true,
  lang: 'zh',
  themeColor: DEFAULT_THEME_COLOR,
  enableHotzone: false, // 默认关闭热区功能
};

/**
 * Canvas Drawing Editor Web Component
 */
export class CanvasDrawingEditor extends HTMLElement {
  // Shadow DOM
  private shadow: ShadowRoot;

  // DOM 元素
  private container!: HTMLDivElement;
  private toolbar!: HTMLDivElement;
  private topBar!: HTMLDivElement;
  private canvasContainer!: HTMLDivElement;
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private textInput!: HTMLInputElement;
  private textInputContainer!: HTMLDivElement;

  // 配置
  private config: EditorConfig = { ...defaultConfig };

  // 状态
  private objects: CanvasObject[] = [];
  private selectedId: string | null = null;
  private tool: ToolType = 'SELECT';
  private color: string = '#000000';
  private lineWidth: number = 3;

  // 交互状态
  private isDragging: boolean = false;
  private dragStart: Point | null = null;
  private currentObject: CanvasObject | null = null;
  private dragOffset: Point = { x: 0, y: 0 };

  // 文本输入状态
  private isTextInputVisible: boolean = false;
  private textInputPos: Point = { x: 0, y: 0 };
  private textInputScreenPos: Point = { x: 0, y: 0 };
  private editingTextId: string | null = null;

  // 调整大小状态
  private isResizing: boolean = false;
  private resizeHandle: string | null = null;
  private resizeStartBounds: { x: number; y: number; width: number; height: number } | null = null;
  private resizeOriginalObject: CanvasObject | null = null;

  // 历史记录
  private history: CanvasObject[][] = [];
  private clipboard: CanvasObject | null = null;

  // 缩放状态
  private scale: number = 1;
  private panOffset: Point = { x: 0, y: 0 };

  // 平移状态
  private isPanning: boolean = false;
  private panStart: Point = { x: 0, y: 0 };

  // 绑定的事件处理器（用于移除监听）
  private boundHandleResize: () => void;
  private boundHandleKeyDown: (e: KeyboardEvent) => void;
  private boundHandleWheel: (e: WheelEvent) => void;

  // 热区相关状态
  private contextMenu!: HTMLDivElement;
  private hotzoneDrawer!: HTMLDivElement;
  private hotzoneEditingTextId: string | null = null;
  private hotzoneData: Record<string, string> = {};

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    
    // 绑定事件处理器
    this.boundHandleResize = this.handleResize.bind(this);
    this.boundHandleKeyDown = this.handleKeyDown.bind(this);
    this.boundHandleWheel = this.handleWheel.bind(this);
  }

  // 观察的属性
  static get observedAttributes(): string[] {
    return [
      'title', 'show-pencil', 'show-rectangle', 'show-circle', 'show-text',
      'show-image', 'show-zoom', 'show-download', 'show-export', 'show-import',
      'show-color', 'show-clear', 'initial-data', 'lang', 'theme-color',
      'enable-hotzone', 'hotzone-data'
    ];
  }

  // 生命周期：连接到 DOM
  connectedCallback(): void {
    this.parseAttributes();
    this.render();
    this.setupEventListeners();
    this.initCanvas(true); // 首次初始化需要加载初始数据
  }

  // 生命周期：从 DOM 断开
  disconnectedCallback(): void {
    this.removeEventListeners();
  }

  // 生命周期：属性变化
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;

    // 处理 initial-data 属性变化
    if (name === 'initial-data' && newValue && this.canvas) {
      this.loadInitialData();
      // 动态更新时需要手动触发渲染（画布已初始化完成）
      this.renderCanvas();
      return;
    }

    this.parseAttributes();
    if (this.container) {
      this.updateUI();
    }
  }

  // 解析 HTML 属性
  private parseAttributes(): void {
    const langAttr = this.getAttribute('lang');
    const lang: LangType = (langAttr === 'en' || langAttr === 'zh') ? langAttr : defaultConfig.lang!;

    this.config = {
      title: this.getAttribute('title') || defaultConfig.title,
      showPencil: this.getAttribute('show-pencil') !== 'false',
      showRectangle: this.getAttribute('show-rectangle') !== 'false',
      showCircle: this.getAttribute('show-circle') !== 'false',
      showText: this.getAttribute('show-text') !== 'false',
      showImage: this.getAttribute('show-image') !== 'false',
      showZoom: this.getAttribute('show-zoom') !== 'false',
      showDownload: this.getAttribute('show-download') !== 'false',
      showExport: this.getAttribute('show-export') !== 'false',
      showImport: this.getAttribute('show-import') !== 'false',
      showColor: this.getAttribute('show-color') !== 'false',
      showClear: this.getAttribute('show-clear') !== 'false',
      lang: lang,
      themeColor: this.getAttribute('theme-color') || defaultConfig.themeColor,
      enableHotzone: this.getAttribute('enable-hotzone') === 'true',
    };

    // 解析热区数据
    this.parseHotzoneData();
  }

  // 解析热区数据属性
  private parseHotzoneData(): void {
    const hotzoneDataAttr = this.getAttribute('hotzone-data');
    if (hotzoneDataAttr) {
      try {
        this.hotzoneData = JSON.parse(hotzoneDataAttr);
      } catch (err) {
        console.error('Failed to parse hotzone-data:', err);
        this.hotzoneData = {};
      }
    }
  }

  // 获取国际化文本
  private t(key: string): string {
    const lang = this.config.lang || 'zh';
    return i18n[lang][key] || key;
  }

  // 生成唯一 ID
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // 精确测量文本宽度
  private measureTextWidth(text: string, fontSize: number): number {
    if (!this.ctx) {
      // 回退方案：粗略估算（中文字符1倍，英文0.6倍）
      let width = 0;
      for (const char of text) {
        width += char.charCodeAt(0) > 127 ? fontSize : fontSize * 0.6;
      }
      return width;
    }
    this.ctx.save();
    this.ctx.font = `${fontSize}px sans-serif`;
    const metrics = this.ctx.measureText(text);
    this.ctx.restore();
    return metrics.width;
  }

  // 加载初始数据
  private loadInitialData(): void {
    const initialData = this.getAttribute('initial-data');
    if (!initialData) return;

    try {
      const parsed = JSON.parse(initialData);

      // 支持两种格式：
      // 1. 对象格式：{ "objects": [...] }
      // 2. 数组格式：[...] （用户可能直接传入 e.detail.objects）
      let objectsArray: CanvasObject[];
      if (Array.isArray(parsed)) {
        // 数组格式，直接使用
        objectsArray = parsed;
      } else if (parsed.objects && Array.isArray(parsed.objects)) {
        // 对象格式，取 objects 属性
        objectsArray = parsed.objects;
      } else {
        console.error('initial-data 格式无效，需要数组或包含 objects 数组的对象');
        return;
      }

      this.objects = objectsArray;
      this.selectedId = null;

      // 每次通过 initial-data 加载数据时，重置缩放和平移
      // 确保主画布和小地图都从统一的 100% 缩放、无平移状态开始
      this.scale = 1;
      this.panOffset = { x: 0, y: 0 };
      this.updateZoomDisplay();

      // 应用热区数据（替换文本内容）
      this.applyHotzoneData();

      // 重新加载图片（异步加载完成后需要重新渲染）
      this.objects.forEach(obj => {
        if (obj.type === 'IMAGE' && (obj as ImageObject).dataUrl) {
          const img = new Image();
          img.onload = () => {
            (obj as ImageObject).imageElement = img;
            this.renderCanvas();
          };
          img.src = (obj as ImageObject).dataUrl;
        }
      });

      // 更新UI状态（隐藏空画布提示等）
      this.updateUI();
    } catch (err) {
      console.error('Failed to parse initial-data:', err);
    }
  }

  // 设置事件监听
  private setupEventListeners(): void {
    window.addEventListener('resize', this.boundHandleResize);
    window.addEventListener('keydown', this.boundHandleKeyDown);
  }

  // 移除事件监听
  private removeEventListeners(): void {
    window.removeEventListener('resize', this.boundHandleResize);
    window.removeEventListener('keydown', this.boundHandleKeyDown);
    if (this.canvas) {
      this.canvas.removeEventListener('wheel', this.boundHandleWheel);
    }
  }

  // 窗口大小变化处理
  private handleResize(): void {
    this.initCanvas(false);
  }

  // 初始化画布
  private initCanvas(loadInitial: boolean = false): void {
    if (!this.canvasContainer || !this.canvas) return;

    // 使用 requestAnimationFrame 确保 DOM 已经渲染
    requestAnimationFrame(() => {
      this.canvas.width = this.canvasContainer.clientWidth;
      this.canvas.height = this.canvasContainer.clientHeight;

      // 首次初始化时加载初始数据（确保画布尺寸已设置）
      if (loadInitial) {
        this.loadInitialData();
      }

      this.renderCanvas();
    });
  }

  // 获取鼠标在画布上的位置（考虑缩放和平移）
  private getMousePos(e: MouseEvent | TouchEvent): Point {
    const rect = this.canvas.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      return { x: 0, y: 0 };
    }

    const x = (clientX - rect.left - this.panOffset.x) / this.scale;
    const y = (clientY - rect.top - this.panOffset.y) / this.scale;
    return { x, y };
  }

  // 获取屏幕坐标（不考虑缩放和平移）
  private getScreenPos(e: MouseEvent | TouchEvent): Point {
    const rect = this.canvas.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      return { x: 0, y: 0 };
    }

    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  // 获取对象边界
  private getObjectBounds(obj: CanvasObject): { x: number; y: number; width: number; height: number } {
    switch (obj.type) {
      case 'RECTANGLE':
      case 'IMAGE': {
        const r = obj as RectObject | ImageObject;
        return { x: r.x, y: r.y, width: r.width, height: r.height };
      }
      case 'CIRCLE': {
        const c = obj as CircleObject;
        return { x: c.x - c.radius, y: c.y - c.radius, width: c.radius * 2, height: c.radius * 2 };
      }
      case 'TEXT': {
        const t = obj as TextObject;
        const width = this.measureTextWidth(t.text, t.fontSize);
        return { x: t.x, y: t.y - t.fontSize, width, height: t.fontSize * 1.2 };
      }
      case 'PATH': {
        const p = obj as PathObject;
        if (p.points.length === 0) return { x: 0, y: 0, width: 0, height: 0 };
        const minX = Math.min(...p.points.map(pt => pt.x));
        const maxX = Math.max(...p.points.map(pt => pt.x));
        const minY = Math.min(...p.points.map(pt => pt.y));
        const maxY = Math.max(...p.points.map(pt => pt.y));
        return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
      }
    }
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  // 检查调整大小手柄
  private getResizeHandleAtPoint(obj: CanvasObject, x: number, y: number): string | null {
    const bounds = this.getObjectBounds(obj);
    const handleSize = 8;

    const handles = [
      { name: 'nw', x: bounds.x, y: bounds.y },
      { name: 'ne', x: bounds.x + bounds.width, y: bounds.y },
      { name: 'sw', x: bounds.x, y: bounds.y + bounds.height },
      { name: 'se', x: bounds.x + bounds.width, y: bounds.y + bounds.height },
    ];

    for (const handle of handles) {
      if (Math.abs(x - handle.x) <= handleSize && Math.abs(y - handle.y) <= handleSize) {
        return handle.name;
      }
    }
    return null;
  }

  // 碰撞检测
  private isHit(obj: CanvasObject, x: number, y: number): boolean {
    switch (obj.type) {
      case 'RECTANGLE': {
        const r = obj as RectObject;
        return x >= r.x && x <= r.x + r.width && y >= r.y && y <= r.y + r.height;
      }
      case 'CIRCLE': {
        const c = obj as CircleObject;
        const dist = Math.sqrt(Math.pow(x - c.x, 2) + Math.pow(y - c.y, 2));
        return dist <= c.radius;
      }
      case 'IMAGE': {
        const img = obj as ImageObject;
        return x >= img.x && x <= img.x + img.width && y >= img.y && y <= img.y + img.height;
      }
      case 'TEXT': {
        const t = obj as TextObject;
        const width = this.measureTextWidth(t.text, t.fontSize);
        return x >= t.x && x <= t.x + width && y >= t.y - t.fontSize && y <= t.y + t.fontSize * 0.2;
      }
      case 'PATH': {
        const p = obj as PathObject;
        if (p.points.length === 0) return false;
        const minX = Math.min(...p.points.map(pt => pt.x));
        const maxX = Math.max(...p.points.map(pt => pt.x));
        const minY = Math.min(...p.points.map(pt => pt.y));
        const maxY = Math.max(...p.points.map(pt => pt.y));
        return x >= minX && x <= maxX && y >= minY && y <= maxY;
      }
    }
    return false;
  }

  // 保存历史
  private saveHistory(): void {
    this.history.push(JSON.parse(JSON.stringify(this.objects)));
  }

  // 撤销
  private undo(): void {
    if (this.history.length === 0) return;
    const previousState = this.history.pop();
    if (previousState) {
      this.objects = previousState;
      this.selectedId = null;
      this.renderCanvas();
      this.dispatchChangeEvent();
    }
  }

  // 删除选中对象
  private deleteSelected(): void {
    if (this.selectedId) {
      this.saveHistory();
      this.objects = this.objects.filter(o => o.id !== this.selectedId);
      this.selectedId = null;
      this.renderCanvas();
      this.updateUI();
      this.dispatchChangeEvent();
    }
  }

  // 复制选中对象
  private copySelected(): void {
    if (this.selectedId) {
      const selectedObj = this.objects.find(o => o.id === this.selectedId);
      if (selectedObj) {
        this.clipboard = JSON.parse(JSON.stringify(selectedObj));
      }
    }
  }

  // 粘贴对象
  private pasteObject(): void {
    if (this.clipboard) {
      this.saveHistory();
      const newObj = {
        ...JSON.parse(JSON.stringify(this.clipboard)),
        id: this.generateId(),
        x: this.clipboard.x + 20,
        y: this.clipboard.y + 20
      };
      if (newObj.type === 'PATH' && newObj.points) {
        newObj.points = newObj.points.map((pt: Point) => ({
          x: pt.x + 20,
          y: pt.y + 20
        }));
      }
      this.objects.push(newObj);
      this.selectedId = newObj.id;
      this.clipboard = newObj;
      this.renderCanvas();
      this.updateUI();
      this.dispatchChangeEvent();
    }
  }

  // 派发变化事件
  private dispatchChangeEvent(): void {
    this.dispatchEvent(new CustomEvent('editor-change', {
      bubbles: true,
      composed: true,
      detail: { objects: this.objects }
    }));
  }

  // 键盘事件处理
  private handleKeyDown(e: KeyboardEvent): void {
    if (this.isTextInputVisible) return;

    // 如果焦点在输入框或文本域中，不处理快捷键
    const activeElement = this.shadow.activeElement || document.activeElement;
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
      return;
    }

    // Ctrl+Z: 撤销
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.preventDefault();
      this.undo();
      return;
    }

    // Ctrl+C: 复制
    if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
      if (this.selectedId) {
        e.preventDefault();
        this.copySelected();
      }
      return;
    }

    // Ctrl+V: 粘贴
    if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
      if (this.clipboard) {
        e.preventDefault();
        this.pasteObject();
      }
      return;
    }

    // Delete/Backspace: 删除
    if ((e.key === 'Delete' || e.key === 'Backspace') && this.selectedId) {
      e.preventDefault();
      this.deleteSelected();
      return;
    }

    // 快捷键切换工具
    if (!e.ctrlKey && !e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'v':
          this.setTool('SELECT');
          break;
        case 'p':
        case 'b':
          this.setTool('PENCIL');
          break;
        case 'r':
          this.setTool('RECTANGLE');
          break;
        case 'o':
          this.setTool('CIRCLE');
          break;
        case 't':
          this.setTool('TEXT');
          break;
        case 'escape':
          this.selectedId = null;
          this.hideTextInput();
          this.renderCanvas();
          this.updateUI();
          break;
      }
    }
  }

  // 滚轮缩放
  private handleWheel(e: WheelEvent): void {
    e.preventDefault();
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = this.scale * delta;

    this.zoomAtPoint(newScale, mouseX, mouseY);
  }

  // 以指定点为中心缩放
  private zoomAtPoint(newScale: number, centerX: number, centerY: number): void {
    const clampedScale = Math.min(Math.max(newScale, 0.2), 5);

    const mouseXBeforeZoom = (centerX - this.panOffset.x) / this.scale;
    const mouseYBeforeZoom = (centerY - this.panOffset.y) / this.scale;

    const newPanOffsetX = centerX - mouseXBeforeZoom * clampedScale;
    const newPanOffsetY = centerY - mouseYBeforeZoom * clampedScale;

    this.scale = clampedScale;
    this.panOffset = { x: newPanOffsetX, y: newPanOffsetY };

    this.renderCanvas();
    this.updateZoomDisplay();
  }

  // 放大
  private zoomIn(): void {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    this.zoomAtPoint(this.scale * 1.2, centerX, centerY);
  }

  // 缩小
  private zoomOut(): void {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    this.zoomAtPoint(this.scale / 1.2, centerX, centerY);
  }

  // 重置缩放
  private resetZoom(): void {
    this.scale = 1;
    this.panOffset = { x: 0, y: 0 };
    this.renderCanvas();
    this.updateZoomDisplay();
  }

  // 更新缩放显示
  private updateZoomDisplay(): void {
    const zoomText = this.shadow.querySelector('.zoom-text');
    if (zoomText) {
      zoomText.textContent = `${Math.round(this.scale * 100)}%`;
    }
  }

  // 设置工具
  private setTool(tool: ToolType): void {
    this.tool = tool;
    this.updateToolButtons();
  }

  // 更新工具按钮状态
  private updateToolButtons(): void {
    const buttons = this.shadow.querySelectorAll('.tool-btn');
    buttons.forEach(btn => {
      const btnTool = btn.getAttribute('data-tool');
      if (btnTool === this.tool) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // 隐藏文本输入
  private hideTextInput(): void {
    this.isTextInputVisible = false;
    if (this.textInputContainer) {
      this.textInputContainer.style.display = 'none';
    }
    this.editingTextId = null;
  }

  // 显示文本输入
  private showTextInput(screenX: number, screenY: number, text: string = ''): void {
    this.isTextInputVisible = true;
    this.textInputScreenPos = { x: screenX, y: screenY };

    if (this.textInputContainer && this.textInput) {
      this.textInputContainer.style.display = 'block';
      this.textInputContainer.style.left = `${screenX}px`;
      this.textInputContainer.style.top = `${screenY - 30}px`;
      this.textInput.value = text;
      this.textInput.style.color = this.color;
      setTimeout(() => {
        this.textInput.focus();
        if (text) this.textInput.select();
      }, 0);
    }
  }

  // 提交文本
  private submitText(): void {
    const value = this.textInput?.value?.trim();
    if (value) {
      if (this.editingTextId) {
        const existingObj = this.objects.find(o => o.id === this.editingTextId) as TextObject | undefined;
        if (existingObj && existingObj.text !== value) {
          this.saveHistory();
          existingObj.text = value;
        }
        this.selectedId = this.editingTextId;
      } else {
        this.saveHistory();
        const newObj: TextObject = {
          id: this.generateId(),
          type: 'TEXT',
          x: this.textInputPos.x,
          y: this.textInputPos.y,
          text: value,
          fontSize: 24,
          color: this.color,
          lineWidth: this.lineWidth
        };
        this.objects.push(newObj);
        this.selectedId = newObj.id;
      }
      this.dispatchChangeEvent();
    }
    this.hideTextInput();
    this.setTool('SELECT');
    this.renderCanvas();
    this.updateUI();
  }

  // 画布鼠标按下
  private handleCanvasPointerDown(e: MouseEvent | TouchEvent): void {
    const { x, y } = this.getMousePos(e);
    const screenPos = this.getScreenPos(e);
    this.dragStart = { x, y };
    this.isDragging = true;

    // 如果文本输入可见且不是文本工具，先保存文本
    if (this.isTextInputVisible && this.tool !== 'TEXT') {
      this.submitText();
    }

    if (this.tool === 'SELECT') {
      // 检查是否点击调整大小手柄
      if (this.selectedId) {
        const selectedObj = this.objects.find(o => o.id === this.selectedId);
        if (selectedObj) {
          const handle = this.getResizeHandleAtPoint(selectedObj, x, y);
          if (handle) {
            this.saveHistory();
            this.isResizing = true;
            this.resizeHandle = handle;
            this.resizeStartBounds = this.getObjectBounds(selectedObj);
            this.resizeOriginalObject = JSON.parse(JSON.stringify(selectedObj));
            return;
          }
        }
      }

      // 查找点击的对象
      const clickedObject = [...this.objects].reverse().find(obj => this.isHit(obj, x, y));

      if (clickedObject) {
        this.selectedId = clickedObject.id;
        this.dragOffset = { x: x - clickedObject.x, y: y - clickedObject.y };
        this.saveHistory();
        this.updateUI();
      } else {
        // 开始拖拽画布
        this.selectedId = null;
        this.isPanning = true;
        this.panStart = screenPos;
        this.updateUI();
      }
    } else if (this.tool === 'TEXT') {
      // 显示文本输入
      this.textInputPos = { x, y };
      this.showTextInput(screenPos.x, screenPos.y);
      this.isDragging = false;
    } else {
      // 开始绘制图形
      this.saveHistory();
      const id = this.generateId();
      if (this.tool === 'RECTANGLE') {
        this.currentObject = { id, type: 'RECTANGLE', x, y, width: 0, height: 0, color: this.color, lineWidth: this.lineWidth };
      } else if (this.tool === 'CIRCLE') {
        this.currentObject = { id, type: 'CIRCLE', x, y, radius: 0, color: this.color, lineWidth: this.lineWidth };
      } else if (this.tool === 'PENCIL') {
        this.currentObject = { id, type: 'PATH', x, y, points: [{ x, y }], color: this.color, lineWidth: this.lineWidth };
      }
    }

    this.renderCanvas();
  }

  // 画布鼠标移动
  private handleCanvasPointerMove(e: MouseEvent | TouchEvent): void {
    // 处理画布拖拽
    if (this.isPanning) {
      const screenPos = this.getScreenPos(e);
      const dx = screenPos.x - this.panStart.x;
      const dy = screenPos.y - this.panStart.y;
      this.panOffset = { x: this.panOffset.x + dx, y: this.panOffset.y + dy };
      this.panStart = screenPos;
      this.renderCanvas();
      return;
    }

    if (!this.isDragging || !this.dragStart) return;
    const { x, y } = this.getMousePos(e);

    // 处理调整大小
    if (this.isResizing && this.selectedId && this.resizeHandle && this.resizeStartBounds && this.resizeOriginalObject) {
      const obj = this.objects.find(o => o.id === this.selectedId);
      if (!obj) return;

      const dx = x - this.dragStart.x;
      const dy = y - this.dragStart.y;
      let newX = this.resizeStartBounds.x;
      let newY = this.resizeStartBounds.y;
      let newWidth = this.resizeStartBounds.width;
      let newHeight = this.resizeStartBounds.height;

      if (this.resizeHandle.includes('e')) newWidth = this.resizeStartBounds.width + dx;
      if (this.resizeHandle.includes('w')) {
        newX = this.resizeStartBounds.x + dx;
        newWidth = this.resizeStartBounds.width - dx;
      }
      if (this.resizeHandle.includes('s')) newHeight = this.resizeStartBounds.height + dy;
      if (this.resizeHandle.includes('n')) {
        newY = this.resizeStartBounds.y + dy;
        newHeight = this.resizeStartBounds.height - dy;
      }

      newWidth = Math.max(10, newWidth);
      newHeight = Math.max(10, newHeight);

      // 根据对象类型应用变化
      switch (obj.type) {
        case 'RECTANGLE':
        case 'IMAGE':
          (obj as RectObject | ImageObject).x = newX;
          (obj as RectObject | ImageObject).y = newY;
          (obj as RectObject | ImageObject).width = newWidth;
          (obj as RectObject | ImageObject).height = newHeight;
          break;
        case 'CIRCLE': {
          const radius = Math.max(newWidth, newHeight) / 2;
          (obj as CircleObject).x = newX + radius;
          (obj as CircleObject).y = newY + radius;
          (obj as CircleObject).radius = radius;
          break;
        }
        case 'TEXT': {
          const origT = this.resizeOriginalObject as TextObject;
          const scaleFactor = newWidth / this.resizeStartBounds.width;
          (obj as TextObject).x = newX;
          (obj as TextObject).y = newY + newHeight;
          (obj as TextObject).fontSize = Math.max(8, Math.round(origT.fontSize * scaleFactor));
          break;
        }
        case 'PATH': {
          const origP = this.resizeOriginalObject as PathObject;
          const scaleX = newWidth / this.resizeStartBounds.width;
          const scaleY = newHeight / this.resizeStartBounds.height;
          (obj as PathObject).points = origP.points.map(pt => ({
            x: newX + (pt.x - this.resizeStartBounds!.x) * scaleX,
            y: newY + (pt.y - this.resizeStartBounds!.y) * scaleY
          }));
          break;
        }
      }

      this.renderCanvas();
      return;
    }

    // 移动选中对象
    if (this.tool === 'SELECT' && this.selectedId) {
      const obj = this.objects.find(o => o.id === this.selectedId);
      if (obj) {
        if (obj.type === 'PATH') {
          const p = obj as PathObject;
          const dx = x - this.dragStart.x;
          const dy = y - this.dragStart.y;
          p.points = p.points.map(pt => ({ x: pt.x + dx, y: pt.y + dy }));
          this.dragStart = { x, y };
        } else {
          obj.x = x - this.dragOffset.x;
          obj.y = y - this.dragOffset.y;
        }
        this.renderCanvas();
      }
    } else if (this.currentObject) {
      // 更新正在绘制的图形
      if (this.currentObject.type === 'RECTANGLE') {
        (this.currentObject as RectObject).width = x - this.currentObject.x;
        (this.currentObject as RectObject).height = y - this.currentObject.y;
      } else if (this.currentObject.type === 'CIRCLE') {
        const radius = Math.sqrt(Math.pow(x - this.currentObject.x, 2) + Math.pow(y - this.currentObject.y, 2));
        (this.currentObject as CircleObject).radius = radius;
      } else if (this.currentObject.type === 'PATH') {
        (this.currentObject as PathObject).points.push({ x, y });
      }
      this.renderCanvas();
    }
  }

  // 画布鼠标抬起
  private handleCanvasPointerUp(): void {
    this.isDragging = false;
    this.dragStart = null;
    this.isResizing = false;
    this.resizeHandle = null;
    this.resizeStartBounds = null;
    this.resizeOriginalObject = null;
    this.isPanning = false;

    if (this.currentObject) {
      this.objects.push(this.currentObject);
      this.currentObject = null;
      this.dispatchChangeEvent();
    }

    this.renderCanvas();
    this.updateUI();
  }

  // 双击编辑文本
  private handleCanvasDoubleClick(e: MouseEvent): void {
    e.preventDefault();
    const { x, y } = this.getMousePos(e);

    const clickedObject = [...this.objects].reverse().find(obj => this.isHit(obj, x, y));

    if (clickedObject && clickedObject.type === 'TEXT') {
      const textObj = clickedObject as TextObject;
      this.editingTextId = textObj.id;
      this.textInputPos = { x: textObj.x, y: textObj.y };
      const screenX = textObj.x * this.scale + this.panOffset.x;
      const screenY = textObj.y * this.scale + this.panOffset.y;
      this.showTextInput(screenX, screenY, textObj.text);
      this.setTool('SELECT');
    }
  }

  // 渲染画布
  private renderCanvas(): void {
    if (!this.ctx) return;

    // 清空画布
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 绘制背景
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 应用缩放和平移
    this.ctx.save();
    this.ctx.translate(this.panOffset.x, this.panOffset.y);
    this.ctx.scale(this.scale, this.scale);

    // 绘制所有对象
    this.objects.forEach(obj => this.drawObject(this.ctx, obj));

    // 绘制正在创建的对象
    if (this.currentObject) {
      this.drawObject(this.ctx, this.currentObject);
    }

    // 绘制选中对象的调整手柄
    if (this.selectedId && this.tool === 'SELECT') {
      const selectedObj = this.objects.find(o => o.id === this.selectedId);
      if (selectedObj) {
        this.drawSelectionHandles(this.ctx, selectedObj);
      }
    }

    this.ctx.restore();
  }

  // 绘制单个对象
  private drawObject(ctx: CanvasRenderingContext2D, obj: CanvasObject): void {
    ctx.beginPath();
    ctx.strokeStyle = obj.color;
    ctx.lineWidth = obj.lineWidth;
    ctx.fillStyle = obj.color;

    // 选中高亮
    if (obj.id === this.selectedId) {
      ctx.shadowColor = 'rgba(0, 100, 255, 0.5)';
      ctx.shadowBlur = 10;
    } else {
      ctx.shadowBlur = 0;
    }

    switch (obj.type) {
      case 'RECTANGLE': {
        const r = obj as RectObject;
        ctx.strokeRect(r.x, r.y, r.width, r.height);
        break;
      }
      case 'CIRCLE': {
        const c = obj as CircleObject;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radius, 0, 2 * Math.PI);
        ctx.stroke();
        break;
      }
      case 'PATH': {
        const p = obj as PathObject;
        if (p.points.length < 2) break;
        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.moveTo(p.points[0].x, p.points[0].y);
        for (let i = 1; i < p.points.length; i++) {
          ctx.lineTo(p.points[i].x, p.points[i].y);
        }
        ctx.stroke();
        break;
      }
      case 'TEXT': {
        const t = obj as TextObject;
        ctx.font = `${t.fontSize}px sans-serif`;
        ctx.fillText(t.text, t.x, t.y);

        // 如果启用热区功能且文本有热区配置，绘制热区标识
        if (this.config.enableHotzone && t.hotzone) {
          const textWidth = this.measureTextWidth(t.text, t.fontSize);
          const themeColor = this.config.themeColor || DEFAULT_THEME_COLOR;

          // 绘制虚线边框
          ctx.save();
          ctx.strokeStyle = themeColor;
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 2]);
          ctx.strokeRect(t.x - 2, t.y - t.fontSize - 2, textWidth + 4, t.fontSize * 1.2 + 4);
          ctx.setLineDash([]);

          // 绘制热区图标（小圆点）
          ctx.fillStyle = themeColor;
          ctx.beginPath();
          ctx.arc(t.x + textWidth + 8, t.y - t.fontSize / 2, 4, 0, 2 * Math.PI);
          ctx.fill();
          ctx.restore();
        }
        break;
      }
      case 'IMAGE': {
        const imgObj = obj as ImageObject;
        if (imgObj.imageElement && imgObj.imageElement.complete) {
          ctx.drawImage(imgObj.imageElement, imgObj.x, imgObj.y, imgObj.width, imgObj.height);
        } else if (imgObj.dataUrl) {
          // 加载图片
          const img = new Image();
          img.onload = () => {
            imgObj.imageElement = img;
            this.renderCanvas();
          };
          img.src = imgObj.dataUrl;
        }
        break;
      }
    }
  }

  // 绘制选中手柄
  private drawSelectionHandles(ctx: CanvasRenderingContext2D, obj: CanvasObject): void {
    const bounds = this.getObjectBounds(obj);
    const handleSize = 8;

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#3b82f6';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;

    // 绘制角落手柄
    const corners = [
      { x: bounds.x, y: bounds.y },
      { x: bounds.x + bounds.width, y: bounds.y },
      { x: bounds.x, y: bounds.y + bounds.height },
      { x: bounds.x + bounds.width, y: bounds.y + bounds.height },
    ];

    corners.forEach(corner => {
      ctx.beginPath();
      ctx.rect(corner.x - handleSize / 2, corner.y - handleSize / 2, handleSize, handleSize);
      ctx.fill();
      ctx.stroke();
    });

    // 绘制选择边框
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
    ctx.setLineDash([]);
  }

  // 图片上传处理
  private handleImageUpload(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        this.saveHistory();
        const maxSize = 300;
        let width = img.width;
        let height = img.height;
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height);
          width *= ratio;
          height *= ratio;
        }

        const newObj: ImageObject = {
          id: this.generateId(),
          type: 'IMAGE',
          x: 100,
          y: 100,
          width,
          height,
          color: '#000000',
          lineWidth: 1,
          dataUrl,
          imageElement: img
        };
        this.objects.push(newObj);
        this.selectedId = newObj.id;
        this.setTool('SELECT');
        this.renderCanvas();
        this.updateUI();
        this.dispatchChangeEvent();
      };
      img.src = dataUrl;
    };

    reader.readAsDataURL(file);
    input.value = '';
  }

  // 保存 JSON
  private saveJson(): void {
    const data = {
      version: '1.0',
      objects: this.objects.map(obj => {
        const { imageElement, ...rest } = obj as ImageObject;
        return rest;
      })
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'canvas-project.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  // 加载 JSON
  private loadJson(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.objects && Array.isArray(data.objects)) {
          this.saveHistory();
          this.objects = data.objects;
          this.selectedId = null;

          // 重新加载图片
          this.objects.forEach(obj => {
            if (obj.type === 'IMAGE' && (obj as ImageObject).dataUrl) {
              const img = new Image();
              img.onload = () => {
                (obj as ImageObject).imageElement = img;
                this.renderCanvas();
              };
              img.src = (obj as ImageObject).dataUrl;
            }
          });

          this.renderCanvas();
          this.updateUI();
          this.dispatchChangeEvent();
        }
      } catch (err) {
        console.error('Failed to load JSON:', err);
      }
    };

    reader.readAsText(file);
    input.value = '';
  }

  // 导出 PNG
  private exportPng(): void {
    // 创建临时画布
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = this.canvas.width;
    tempCanvas.height = this.canvas.height;
    const tempCtx = tempCanvas.getContext('2d')!;

    // 绘制白色背景
    tempCtx.fillStyle = '#ffffff';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // 应用缩放和平移
    tempCtx.translate(this.panOffset.x, this.panOffset.y);
    tempCtx.scale(this.scale, this.scale);

    // 绘制所有对象
    this.objects.forEach(obj => this.drawObject(tempCtx, obj));

    // 下载
    const url = tempCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'canvas-export.png';
    a.click();
  }

  // 清空画布
  private clearCanvas(): void {
    if (this.objects.length === 0) return;

    this.saveHistory();
    this.objects = [];
    this.selectedId = null;
    this.renderCanvas();
    this.dispatchChangeEvent();
    this.updateUI();
  }

  // 更新 UI
  private updateUI(): void {
    // 更新选中状态显示
    const selectionInfo = this.shadow.querySelector('.selection-info');
    if (selectionInfo) {
      if (this.selectedId) {
        const selectedObj = this.objects.find(o => o.id === this.selectedId);
        if (selectedObj) {
          const typeLabels: Record<string, string> = {
            'RECTANGLE': '矩形',
            'CIRCLE': '圆形',
            'PATH': '画笔',
            'TEXT': '文本',
            'IMAGE': '图片'
          };
          const typeLabel = typeLabels[selectedObj.type] || selectedObj.type;
          selectionInfo.innerHTML = `
            <span class="selection-label">已选择: ${typeLabel}</span>
            <button class="delete-btn" title="删除">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
              </svg>
            </button>
          `;
          selectionInfo.classList.add('visible');
          const deleteBtn = selectionInfo.querySelector('.delete-btn');
          if (deleteBtn) {
            deleteBtn.addEventListener('click', () => this.deleteSelected());
          }
        }
      } else {
        selectionInfo.classList.remove('visible');
        selectionInfo.innerHTML = '';
      }
    }

    // 更新撤销按钮状态
    const undoBtn = this.shadow.querySelector('.undo-btn') as HTMLButtonElement;
    if (undoBtn) {
      undoBtn.disabled = this.history.length === 0;
    }

    // 更新空画布提示显示
    const emptyHint = this.shadow.querySelector('.empty-hint') as HTMLElement;
    if (emptyHint) {
      emptyHint.style.display = this.objects.length === 0 ? 'flex' : 'none';
    }
  }

  // ========== 热区功能相关方法 ==========

  // 绑定热区相关事件
  private bindHotzoneEvents(): void {
    // 右键菜单项点击
    this.contextMenu.querySelectorAll('.context-menu-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const action = (e.target as HTMLElement).getAttribute('data-action');
        this.handleHotzoneAction(action);
        this.hideContextMenu();
      });
    });

    // 点击其他地方隐藏右键菜单
    this.shadow.addEventListener('mousedown', (e) => {
      if (!this.contextMenu.contains(e.target as Node)) {
        this.hideContextMenu();
      }
    });

    // 抽屉关闭按钮
    const closeBtn = this.hotzoneDrawer.querySelector('.hotzone-drawer-close');
    closeBtn?.addEventListener('click', () => this.hideHotzoneDrawer());

    // 抽屉取消按钮
    const cancelBtn = this.hotzoneDrawer.querySelector('.hotzone-btn-cancel');
    cancelBtn?.addEventListener('click', () => this.hideHotzoneDrawer());

    // 抽屉保存按钮
    const saveBtn = this.hotzoneDrawer.querySelector('.hotzone-btn-save');
    saveBtn?.addEventListener('click', () => this.saveHotzone());
  }

  // 处理右键菜单
  private handleContextMenu(e: MouseEvent): void {
    e.preventDefault();

    const { x, y } = this.getMousePos(e);
    const clickedObject = [...this.objects].reverse().find(obj => this.isHit(obj, x, y));

    // 只对文本对象显示右键菜单
    if (clickedObject && clickedObject.type === 'TEXT') {
      const textObj = clickedObject as TextObject;
      this.hotzoneEditingTextId = textObj.id;

      // 根据是否有热区显示不同菜单项
      const hasHotzone = !!textObj.hotzone;
      const createItem = this.contextMenu.querySelector('[data-action="hotzone-create"]') as HTMLElement;
      const editItem = this.contextMenu.querySelector('[data-action="hotzone-edit"]') as HTMLElement;
      const removeItem = this.contextMenu.querySelector('[data-action="hotzone-remove"]') as HTMLElement;

      if (hasHotzone) {
        createItem.style.display = 'none';
        editItem.style.display = 'block';
        removeItem.style.display = 'block';
      } else {
        createItem.style.display = 'block';
        editItem.style.display = 'none';
        removeItem.style.display = 'none';
      }

      // 显示右键菜单
      this.contextMenu.style.display = 'block';
      this.contextMenu.style.left = `${e.offsetX}px`;
      this.contextMenu.style.top = `${e.offsetY}px`;
    } else {
      this.hideContextMenu();
    }
  }

  // 隐藏右键菜单
  private hideContextMenu(): void {
    this.contextMenu.style.display = 'none';
  }

  // 处理热区操作
  private handleHotzoneAction(action: string | null): void {
    if (!action || !this.hotzoneEditingTextId) return;

    const textObj = this.objects.find(o => o.id === this.hotzoneEditingTextId) as TextObject | undefined;
    if (!textObj) return;

    switch (action) {
      case 'hotzone-create':
      case 'hotzone-edit':
        this.showHotzoneDrawer(textObj);
        break;
      case 'hotzone-remove':
        this.removeHotzone(textObj);
        break;
    }
  }

  // 显示热区配置抽屉
  private showHotzoneDrawer(textObj: TextObject): void {
    // 填充表单
    const variableNameInput = this.hotzoneDrawer.querySelector('input[name="variableName"]') as HTMLInputElement;
    const defaultValueInput = this.hotzoneDrawer.querySelector('input[name="defaultValue"]') as HTMLInputElement;
    const descriptionInput = this.hotzoneDrawer.querySelector('textarea[name="description"]') as HTMLTextAreaElement;

    if (textObj.hotzone) {
      variableNameInput.value = textObj.hotzone.variableName || '';
      defaultValueInput.value = textObj.hotzone.defaultValue || '';
      descriptionInput.value = textObj.hotzone.description || '';
    } else {
      variableNameInput.value = '';
      defaultValueInput.value = '';
      descriptionInput.value = '';
    }

    this.hotzoneDrawer.style.display = 'flex';
  }

  // 隐藏热区配置抽屉
  private hideHotzoneDrawer(): void {
    this.hotzoneDrawer.style.display = 'none';
    this.hotzoneEditingTextId = null;
  }

  // 保存热区配置
  private saveHotzone(): void {
    if (!this.hotzoneEditingTextId) return;

    const textObj = this.objects.find(o => o.id === this.hotzoneEditingTextId) as TextObject | undefined;
    if (!textObj) return;

    const variableNameInput = this.hotzoneDrawer.querySelector('input[name="variableName"]') as HTMLInputElement;
    const defaultValueInput = this.hotzoneDrawer.querySelector('input[name="defaultValue"]') as HTMLInputElement;
    const descriptionInput = this.hotzoneDrawer.querySelector('textarea[name="description"]') as HTMLTextAreaElement;

    const variableName = variableNameInput.value.trim();
    if (!variableName) {
      variableNameInput.focus();
      return;
    }

    this.saveHistory();

    textObj.hotzone = {
      variableName,
      defaultValue: defaultValueInput.value.trim() || undefined,
      description: descriptionInput.value.trim() || undefined,
    };

    this.hideHotzoneDrawer();
    this.renderCanvas();
    this.dispatchChangeEvent();
  }

  // 移除热区
  private removeHotzone(textObj: TextObject): void {
    this.saveHistory();
    delete textObj.hotzone;
    this.renderCanvas();
    this.dispatchChangeEvent();
  }

  // 应用热区数据（替换文本内容）
  private applyHotzoneData(): void {
    if (Object.keys(this.hotzoneData).length === 0) return;

    this.objects.forEach(obj => {
      if (obj.type === 'TEXT') {
        const textObj = obj as TextObject;
        if (textObj.hotzone && textObj.hotzone.variableName) {
          const value = this.hotzoneData[textObj.hotzone.variableName];
          if (value !== undefined) {
            textObj.text = value;
          } else if (textObj.hotzone.defaultValue) {
            textObj.text = textObj.hotzone.defaultValue;
          }
        }
      }
    });
  }

  // 渲染 DOM 结构
  private render(): void {
    const themeColor = this.config.themeColor || DEFAULT_THEME_COLOR;

    this.shadow.innerHTML = `
      <style>${this.getStyles()}</style>
      <div class="editor-container">
        <!-- 左侧工具栏 -->
        <div class="toolbar">
          ${this.createToolButton('SELECT', 'select-icon', this.t('select'))}
          <div class="divider"></div>
          ${this.config.showPencil ? this.createToolButton('PENCIL', 'pencil-icon', this.t('pencil')) : ''}
          ${this.config.showRectangle ? this.createToolButton('RECTANGLE', 'rect-icon', this.t('rectangle')) : ''}
          ${this.config.showCircle ? this.createToolButton('CIRCLE', 'circle-icon', this.t('circle')) : ''}
          ${this.config.showText ? this.createToolButton('TEXT', 'text-icon', this.t('text')) : ''}
          ${this.config.showImage ? `
            <label class="tool-btn" title="${this.t('insertImage')}">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
              </svg>
              <input type="file" accept="image/*" class="hidden image-input" />
            </label>
          ` : ''}
          <div class="divider"></div>
          <button class="tool-btn undo-btn" title="${this.t('undo')}" disabled>
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 4v6h6"/>
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
            </svg>
          </button>
          <div class="spacer"></div>
          ${this.config.showColor ? `
            <input type="color" class="color-picker" value="${this.color}" title="${this.t('colorPicker')}" />
          ` : ''}
        </div>

        <!-- 主区域 -->
        <div class="main-area">
          <!-- 顶部栏 -->
          <div class="top-bar">
            <div class="top-bar-left">
              <h2 class="title">${this.config.title}</h2>
              <div class="selection-info"></div>
            </div>
            <div class="top-bar-right">
              ${this.config.showZoom ? `
                <div class="zoom-controls">
                  <button class="zoom-btn zoom-out-btn" title="${this.t('zoomOut')}">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35M8 11h6"/>
                    </svg>
                  </button>
                  <button class="zoom-text" title="${this.t('resetZoom')}">100%</button>
                  <button class="zoom-btn zoom-in-btn" title="${this.t('zoomIn')}">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35M11 8v6M8 11h6"/>
                    </svg>
                  </button>
                </div>
              ` : ''}
              ${(this.config.showExport || this.config.showImport || this.config.showDownload || this.config.showClear) ? `
                <div class="file-controls">
                  ${this.config.showExport ? `
                    <button class="file-btn save-json-btn" title="${this.t('saveProject')}">
                      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                        <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
                      </svg>
                    </button>
                  ` : ''}
                  ${this.config.showImport ? `
                    <label class="file-btn" title="${this.t('loadProject')}">
                      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
                      </svg>
                      <input type="file" accept=".json" class="hidden load-json-input" />
                    </label>
                  ` : ''}
                  ${this.config.showDownload ? `
                    <button class="file-btn export-png-btn" title="${this.t('exportPng')}">
                      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                      </svg>
                    </button>
                  ` : ''}
                  ${this.config.showClear ? `
                    <div class="clear-btn-wrapper">
                      <button class="file-btn clear-canvas-btn" title="${this.t('clearCanvas')}">
                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                          <line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
                        </svg>
                      </button>
                      <div class="clear-confirm-popup">
                        <p class="clear-confirm-text">${this.t('clearConfirm')}</p>
                        <div class="clear-confirm-actions">
                          <button class="clear-confirm-yes">${this.t('confirm')}</button>
                          <button class="clear-confirm-no">${this.t('cancel')}</button>
                        </div>
                      </div>
                    </div>
                  ` : ''}
                </div>
              ` : ''}
            </div>
          </div>

          <!-- 画布容器 -->
          <div class="canvas-container">
            <canvas class="main-canvas"></canvas>

            <!-- 文本输入 -->
            <div class="text-input-container" style="display: none;">
              <div class="text-input-hint">${this.t('textInputHint')}</div>
              <input type="text" class="text-input" placeholder="${this.t('textPlaceholder')}" />
            </div>

            <!-- 空画布提示 -->
            <div class="empty-hint" style="display: ${this.getAttribute('initial-data') ? 'none' : 'flex'};">
              <h3>${this.t('startCreating')}</h3>
              <p>${this.t('selectToolHint')}</p>
            </div>

            <!-- 右键菜单 -->
            <div class="context-menu" style="display: none;">
              <div class="context-menu-item" data-action="hotzone-create">${this.t('hotzoneCreate')}</div>
              <div class="context-menu-item" data-action="hotzone-edit" style="display: none;">${this.t('hotzoneEdit')}</div>
              <div class="context-menu-item context-menu-item-danger" data-action="hotzone-remove" style="display: none;">${this.t('hotzoneRemove')}</div>
            </div>
          </div>
        </div>

        <!-- 热区配置抽屉 -->
        <div class="hotzone-drawer" style="display: none;">
          <div class="hotzone-drawer-header">
            <h3>${this.t('hotzoneTitle')}</h3>
            <button class="hotzone-drawer-close">&times;</button>
          </div>
          <div class="hotzone-drawer-body">
            <div class="hotzone-form-group">
              <label>${this.t('hotzoneVariableName')} <span class="required">*</span></label>
              <input type="text" class="hotzone-input" name="variableName" placeholder="${this.t('hotzoneVariableNamePlaceholder')}" />
            </div>
            <div class="hotzone-form-group">
              <label>${this.t('hotzoneDefaultValue')}</label>
              <input type="text" class="hotzone-input" name="defaultValue" placeholder="${this.t('hotzoneDefaultValuePlaceholder')}" />
            </div>
            <div class="hotzone-form-group">
              <label>${this.t('hotzoneDescription')}</label>
              <textarea class="hotzone-textarea" name="description" placeholder="${this.t('hotzoneDescriptionPlaceholder')}"></textarea>
            </div>
          </div>
          <div class="hotzone-drawer-footer">
            <button class="hotzone-btn hotzone-btn-cancel">${this.t('hotzoneCancel')}</button>
            <button class="hotzone-btn hotzone-btn-save">${this.t('hotzoneSave')}</button>
          </div>
        </div>
      </div>
    `;

    // 获取 DOM 引用
    this.container = this.shadow.querySelector('.editor-container')!;
    this.toolbar = this.shadow.querySelector('.toolbar')!;
    this.topBar = this.shadow.querySelector('.top-bar')!;
    this.canvasContainer = this.shadow.querySelector('.canvas-container')!;
    this.canvas = this.shadow.querySelector('.main-canvas')!;
    this.ctx = this.canvas.getContext('2d')!;

    this.textInputContainer = this.shadow.querySelector('.text-input-container')!;
    this.textInput = this.shadow.querySelector('.text-input')!;

    // 热区相关 DOM 引用
    this.contextMenu = this.shadow.querySelector('.context-menu')!;
    this.hotzoneDrawer = this.shadow.querySelector('.hotzone-drawer')!;

    // 绑定事件
    this.bindEvents();
  }

  // 绑定事件
  private bindEvents(): void {
    // 画布事件
    this.canvas.addEventListener('mousedown', (e) => this.handleCanvasPointerDown(e));
    this.canvas.addEventListener('mousemove', (e) => this.handleCanvasPointerMove(e));
    this.canvas.addEventListener('mouseup', () => this.handleCanvasPointerUp());
    this.canvas.addEventListener('mouseleave', () => this.handleCanvasPointerUp());
    this.canvas.addEventListener('dblclick', (e) => this.handleCanvasDoubleClick(e));
    this.canvas.addEventListener('touchstart', (e) => this.handleCanvasPointerDown(e));
    this.canvas.addEventListener('touchmove', (e) => this.handleCanvasPointerMove(e));
    this.canvas.addEventListener('touchend', () => this.handleCanvasPointerUp());
    this.canvas.addEventListener('wheel', this.boundHandleWheel, { passive: false });

    // 右键菜单事件（仅在启用热区时）
    if (this.config.enableHotzone) {
      this.canvas.addEventListener('contextmenu', (e) => this.handleContextMenu(e));
      this.bindHotzoneEvents();
    }

    // 工具按钮
    this.shadow.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
      btn.addEventListener('mousedown', (e) => {
        // 阻止 blur 事件触发，在点击后手动处理
        e.preventDefault();
      });
      btn.addEventListener('click', () => {
        // 如果有文本输入，先提交
        if (this.isTextInputVisible) {
          this.submitText();
        }
        const tool = btn.getAttribute('data-tool') as ToolType;
        this.setTool(tool);
      });
    });

    // 撤销按钮
    const undoBtn = this.shadow.querySelector('.undo-btn');
    if (undoBtn) {
      undoBtn.addEventListener('click', () => this.undo());
    }

    // 颜色选择器
    const colorPicker = this.shadow.querySelector('.color-picker') as HTMLInputElement;
    if (colorPicker) {
      colorPicker.addEventListener('input', (e) => {
        this.color = (e.target as HTMLInputElement).value;
      });
    }

    // 图片上传
    const imageInput = this.shadow.querySelector('.image-input');
    if (imageInput) {
      imageInput.addEventListener('change', (e) => this.handleImageUpload(e));
    }

    // 缩放按钮
    const zoomInBtn = this.shadow.querySelector('.zoom-in-btn');
    const zoomOutBtn = this.shadow.querySelector('.zoom-out-btn');
    const zoomText = this.shadow.querySelector('.zoom-text');
    if (zoomInBtn) zoomInBtn.addEventListener('click', () => this.zoomIn());
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => this.zoomOut());
    if (zoomText) zoomText.addEventListener('click', () => this.resetZoom());

    // 文件操作
    const saveJsonBtn = this.shadow.querySelector('.save-json-btn');
    const loadJsonInput = this.shadow.querySelector('.load-json-input');
    const exportPngBtn = this.shadow.querySelector('.export-png-btn');
    if (saveJsonBtn) saveJsonBtn.addEventListener('click', () => this.saveJson());
    if (loadJsonInput) loadJsonInput.addEventListener('change', (e) => this.loadJson(e));
    if (exportPngBtn) exportPngBtn.addEventListener('click', () => this.exportPng());

    // 清空画布确认弹窗
    const clearCanvasBtn = this.shadow.querySelector('.clear-canvas-btn');
    const clearConfirmPopup = this.shadow.querySelector('.clear-confirm-popup') as HTMLElement;
    const clearConfirmYes = this.shadow.querySelector('.clear-confirm-yes');
    const clearConfirmNo = this.shadow.querySelector('.clear-confirm-no');

    if (clearCanvasBtn && clearConfirmPopup) {
      clearCanvasBtn.addEventListener('click', () => {
        clearConfirmPopup.classList.toggle('show');
      });
    }
    if (clearConfirmYes && clearConfirmPopup) {
      clearConfirmYes.addEventListener('click', () => {
        this.clearCanvas();
        clearConfirmPopup.classList.remove('show');
      });
    }
    if (clearConfirmNo && clearConfirmPopup) {
      clearConfirmNo.addEventListener('click', () => {
        clearConfirmPopup.classList.remove('show');
      });
    }

    // 文本输入
    if (this.textInput) {
      this.textInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.submitText();
        } else if (e.key === 'Escape') {
          this.hideTextInput();
        }
      });
      this.textInput.addEventListener('blur', () => {
        if (this.isTextInputVisible) {
          this.submitText();
        }
      });
    }
  }

  // 创建工具按钮 HTML
  private createToolButton(tool: ToolType, iconClass: string, title: string): string {
    const icons: Record<string, string> = {
      'select-icon': '<path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="M13 13l6 6"/>',
      'pencil-icon': '<path d="M17 3a2.85 2.85 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>',
      'rect-icon': '<rect x="3" y="3" width="18" height="18" rx="2"/>',
      'circle-icon': '<circle cx="12" cy="12" r="10"/>',
      'text-icon': '<path d="M4 7V4h16v3M9 20h6M12 4v16"/>',
    };
    const isActive = this.tool === tool;
    return `
      <button class="tool-btn ${isActive ? 'active' : ''}" data-tool="${tool}" title="${title}">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          ${icons[iconClass]}
        </svg>
      </button>
    `;
  }

  // 将 hex 颜色转换为 rgba
  private hexToRgba(hex: string, alpha: number): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return `rgba(84, 80, 220, ${alpha})`; // 默认颜色
  }

  // 获取样式
  private getStyles(): string {
    const themeColor = this.config.themeColor || DEFAULT_THEME_COLOR;
    // 计算悬停颜色（主题色加透明度）
    const hoverBgColor = this.hexToRgba(themeColor, 0.1);
    const shadowColor = this.hexToRgba(themeColor, 0.3);

    return `
      :host {
        display: block;
        width: 100%;
        height: 100%;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        --theme-color: ${themeColor};
        --theme-hover-bg: ${hoverBgColor};
        --theme-shadow: ${shadowColor};
      }

      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      .hidden {
        display: none !important;
      }

      .editor-container {
        display: flex;
        width: 100%;
        height: 100%;
        background: #f1f5f9;
      }

      /* 工具栏 */
      .toolbar {
        width: 64px;
        background: #ffffff;
        border-right: 1px solid #e2e8f0;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 12px 8px;
        gap: 4px;
      }

      .tool-btn {
        width: 44px;
        height: 44px;
        border: none;
        background: transparent;
        border-radius: 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #64748b;
        transition: all 0.2s;
      }

      .tool-btn:hover {
        background: var(--theme-hover-bg);
        color: var(--theme-color);
      }

      .tool-btn.active {
        background: var(--theme-color);
        color: #ffffff;
        box-shadow: 0 4px 12px var(--theme-shadow);
        transform: scale(1.05);
      }

      .tool-btn:disabled {
        color: #cbd5e1;
        cursor: not-allowed;
      }

      .tool-btn:disabled:hover {
        background: transparent;
        color: #cbd5e1;
      }

      .icon {
        width: 20px;
        height: 20px;
      }

      .divider {
        width: 32px;
        height: 1px;
        background: #e2e8f0;
        margin: 8px 0;
      }

      .spacer {
        flex: 1;
      }

      .color-picker {
        width: 32px;
        height: 32px;
        border: 2px solid #e2e8f0;
        border-radius: 50%;
        cursor: pointer;
        padding: 0;
        overflow: hidden;
        -webkit-appearance: none;
      }

      .color-picker::-webkit-color-swatch-wrapper {
        padding: 0;
      }

      .color-picker::-webkit-color-swatch {
        border: none;
        border-radius: 50%;
      }

      /* 主区域 */
      .main-area {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      /* 顶部栏 */
      .top-bar {
        height: 56px;
        background: #ffffff;
        border-bottom: 1px solid #e2e8f0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 16px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      }

      .top-bar-left, .top-bar-right {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .title {
        font-size: 16px;
        font-weight: 600;
        color: #334155;
      }

      .selection-info {
        display: none;
        align-items: center;
        gap: 8px;
        background: #eef2ff;
        padding: 4px 12px;
        border-radius: 20px;
        border: 1px solid #c7d2fe;
      }

      .selection-info.visible {
        display: flex;
      }

      .selection-label {
        font-size: 12px;
        font-weight: 600;
        color: var(--theme-color);
        text-transform: uppercase;
      }

      .delete-btn {
        background: none;
        border: none;
        color: #ef4444;
        cursor: pointer;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .delete-btn:hover {
        color: #dc2626;
      }

      .zoom-controls, .file-controls {
        display: flex;
        align-items: center;
        background: #f1f5f9;
        border-radius: 8px;
        padding: 4px;
      }

      .zoom-btn, .file-btn {
        width: 32px;
        height: 32px;
        border: none;
        background: transparent;
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #475569;
        transition: all 0.2s;
      }

      .zoom-btn:hover, .file-btn:hover {
        color: var(--theme-color);
      }

      .zoom-text {
        padding: 4px 8px;
        font-size: 12px;
        font-weight: 500;
        color: #475569;
        background: transparent;
        border: none;
        cursor: pointer;
        min-width: 50px;
        text-align: center;
      }

      .zoom-text:hover {
        color: var(--theme-color);
      }

      /* 清空按钮容器 */
      .clear-btn-wrapper {
        position: relative;
      }

      .clear-confirm-popup {
        display: none;
        position: absolute;
        top: 100%;
        right: 0;
        margin-top: 8px;
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 100;
        white-space: nowrap;
      }

      .clear-confirm-popup.show {
        display: block;
      }

      .clear-confirm-text {
        margin: 0 0 10px 0;
        font-size: 13px;
        color: #475569;
      }

      .clear-confirm-actions {
        display: flex;
        gap: 8px;
      }

      .clear-confirm-yes,
      .clear-confirm-no {
        padding: 6px 14px;
        border: none;
        border-radius: 6px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.15s;
      }

      .clear-confirm-yes {
        background: #ef4444;
        color: #ffffff;
      }

      .clear-confirm-yes:hover {
        background: #dc2626;
      }

      .clear-confirm-no {
        background: #f1f5f9;
        color: #475569;
      }

      .clear-confirm-no:hover {
        background: #e2e8f0;
      }

      /* 画布容器 */
      .canvas-container {
        flex: 1;
        position: relative;
        background: #f1f5f9;
        overflow: hidden;
      }

      .main-canvas {
        position: absolute;
        inset: 0;
        display: block;
        cursor: crosshair;
        touch-action: none;
      }

      /* 文本输入 */
      .text-input-container {
        position: absolute;
        z-index: 20;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }

      .text-input-hint {
        background: rgba(0, 0, 0, 0.75);
        color: #fff;
        font-size: 12px;
        padding: 4px 8px;
        border-radius: 4px;
        margin-bottom: 4px;
        white-space: nowrap;
      }

      .text-input {
        padding: 8px 12px;
        border: 2px solid var(--theme-color);
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        outline: none;
        min-width: 200px;
        font-size: 16px;
      }

      /* 空画布提示 */
      .empty-hint {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        opacity: 0.4;
      }

      .empty-hint h3 {
        font-size: 24px;
        font-weight: 700;
        color: #94a3b8;
        margin-bottom: 8px;
      }

      .empty-hint p {
        color: #94a3b8;
      }

      /* 右键菜单 */
      .context-menu {
        position: absolute;
        z-index: 100;
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        min-width: 140px;
        padding: 4px 0;
      }

      .context-menu-item {
        padding: 8px 16px;
        font-size: 14px;
        color: #334155;
        cursor: pointer;
        transition: background 0.15s;
      }

      .context-menu-item:hover {
        background: #f1f5f9;
      }

      .context-menu-item-danger {
        color: #ef4444;
      }

      .context-menu-item-danger:hover {
        background: #fef2f2;
      }

      /* 热区配置抽屉 */
      .hotzone-drawer {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        width: 320px;
        background: #ffffff;
        box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        z-index: 200;
      }

      .hotzone-drawer-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 20px;
        border-bottom: 1px solid #e2e8f0;
      }

      .hotzone-drawer-header h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: #1e293b;
      }

      .hotzone-drawer-close {
        width: 28px;
        height: 28px;
        border: none;
        background: transparent;
        font-size: 20px;
        color: #64748b;
        cursor: pointer;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .hotzone-drawer-close:hover {
        background: #f1f5f9;
        color: #1e293b;
      }

      .hotzone-drawer-body {
        flex: 1;
        padding: 20px;
        overflow-y: auto;
      }

      .hotzone-form-group {
        margin-bottom: 16px;
      }

      .hotzone-form-group label {
        display: block;
        font-size: 14px;
        font-weight: 500;
        color: #334155;
        margin-bottom: 6px;
      }

      .hotzone-form-group .required {
        color: #ef4444;
      }

      .hotzone-input,
      .hotzone-textarea {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        font-size: 14px;
        color: #1e293b;
        box-sizing: border-box;
        transition: border-color 0.2s, box-shadow 0.2s;
      }

      .hotzone-input:focus,
      .hotzone-textarea:focus {
        outline: none;
        border-color: ${this.config.themeColor || DEFAULT_THEME_COLOR};
        box-shadow: 0 0 0 3px ${this.config.themeColor || DEFAULT_THEME_COLOR}22;
      }

      .hotzone-textarea {
        min-height: 80px;
        resize: vertical;
      }

      .hotzone-drawer-footer {
        display: flex;
        gap: 12px;
        padding: 16px 20px;
        border-top: 1px solid #e2e8f0;
      }

      .hotzone-btn {
        flex: 1;
        padding: 10px 16px;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.2s;
      }

      .hotzone-btn-cancel {
        background: #f1f5f9;
        color: #475569;
      }

      .hotzone-btn-cancel:hover {
        background: #e2e8f0;
      }

      .hotzone-btn-save {
        background: ${this.config.themeColor || DEFAULT_THEME_COLOR};
        color: #ffffff;
      }

      .hotzone-btn-save:hover {
        filter: brightness(0.9);
      }
    `;
  }
}

// 注册 Web Component
if (typeof window !== 'undefined' && !customElements.get('canvas-drawing-editor')) {
  customElements.define('canvas-drawing-editor', CanvasDrawingEditor);
}

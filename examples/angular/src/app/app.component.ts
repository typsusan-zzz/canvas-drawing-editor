import { Component, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import 'canvas-drawing-editor';

@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <canvas-drawing-editor
      [attr.title]="editorTitle"
      [attr.lang]="lang"
      [attr.theme-color]="themeColor"
      [attr.tool-config]="toolConfigStr"
      style="width: 100%; height: 100vh; display: block;"
    ></canvas-drawing-editor>
  `,
  styles: [`
    :host {
      display: block;
      width: 100vw;
      height: 100vh;
    }
  `]
})
export class AppComponent implements OnInit, OnDestroy {
  editorTitle = 'Angular 画板';
  lang = 'zh';
  themeColor = '#5450dc';

  // 工具配置
  toolConfig = {
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
  };

  get toolConfigStr(): string {
    return JSON.stringify(this.toolConfig);
  }

  private handleEditorChange = (e: Event) => {
    const customEvent = e as CustomEvent;
    console.log('画布内容变化:', customEvent.detail.objects);
  };

  private handleEditorClose = () => {
    console.log('编辑器已关闭');
  };

  ngOnInit(): void {
    document.addEventListener('editor-change', this.handleEditorChange);
    document.addEventListener('editor-close', this.handleEditorClose);
  }

  ngOnDestroy(): void {
    document.removeEventListener('editor-change', this.handleEditorChange);
    document.removeEventListener('editor-close', this.handleEditorClose);
  }
}


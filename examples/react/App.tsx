import { useEffect, useRef } from 'react';
import 'canvas-drawing-editor';

// 声明 Web Component 类型
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'canvas-drawing-editor': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          title?: string;
          lang?: string;
          'theme-color'?: string;
          'tool-config'?: string;
          'initial-data'?: string;
          'enable-hotzone'?: string;
          'hotzone-data'?: string;
        },
        HTMLElement
      >;
    }
  }
}

function App() {
  const editorRef = useRef<HTMLElement>(null);

  // 工具配置
  const toolConfig = {
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

  useEffect(() => {
    // 监听编辑器事件
    const handleEditorChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      console.log('画布内容变化:', customEvent.detail.objects);
    };

    const handleEditorClose = () => {
      console.log('编辑器已关闭');
    };

    document.addEventListener('editor-change', handleEditorChange);
    document.addEventListener('editor-close', handleEditorClose);

    return () => {
      document.removeEventListener('editor-change', handleEditorChange);
      document.removeEventListener('editor-close', handleEditorClose);
    };
  }, []);

  return (
    <div className="app">
      <canvas-drawing-editor
        ref={editorRef}
        title="React 画板"
        lang="zh"
        theme-color="#5450dc"
        tool-config={JSON.stringify(toolConfig)}
        style={{ width: '100%', height: '100vh', display: 'block' }}
      />
    </div>
  );
}

export default App;


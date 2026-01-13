## ✨ New Features

### 🖼️ Image Export API

- **getImageData()** - Get canvas image data as base64 DataURL or Blob without triggering download
- Supports multiple formats: PNG, JPEG, WebP
- Configurable quality and background color
- Perfect for server uploads

## 🐛 Bug Fixes

- Fixed GROUP object color change - now properly updates child objects' fill colors when using color picker

## 💻 Usage Example

```javascript
const editor = document.querySelector('canvas-drawing-editor');

// Get base64 format (default)
const dataURL = await editor.getImageData();

// Get Blob format (for server upload)
const blob = await editor.getImageData({
  type: 'blob',
  format: 'png',        // 'png' | 'jpeg' | 'webp'
  quality: 0.92,        // jpeg/webp quality (0-1)
  background: '#ffffff' // Background color
});

// Upload to server
const formData = new FormData();
formData.append('image', blob, 'canvas.png');
await fetch('/api/upload', { method: 'POST', body: formData });
```

## 📚 Documentation

- Updated README with Image Export API documentation (Chinese & English)
- Added Image Export API section to docs/index.html
- Added interactive demo in docs/demo.html
- Updated shape-panel-demo.html with export buttons


## ✨ New Features

### 📐 Shape Library API

- **registerShapes()** - Register custom shapes with text, colors, and styles
- **Shape Panel** - Searchable dropdown panel in toolbar for quick shape selection
- **Custom Shapes with Text** - Support for shapes with centered text (creates GROUP objects)
- **shape-added Event** - Listen for when shapes are added to canvas

### 🔧 Improvements

- GROUP objects now support resize with proportional scaling of children
- Shape panel auto-hides when no shapes are registered
- Added search functionality to filter shapes by name or category

## 📚 Documentation

- Updated README with Shape Library API documentation (Chinese & English)
- Added Shape Library section to docs/index.html
- Added interactive Shape Library demo in docs/demo.html
- New example: examples/vanilla-html/shape-panel-demo.html

## 💻 Usage Example

```javascript
const editor = document.querySelector('canvas-drawing-editor');

editor.registerShapes([
  {
    id: 'btn-confirm',
    name: 'Confirm Button',
    type: 'roundedRect',
    fillColor: '#22c55e',
    fillMode: 'fill',
    text: 'Confirm',
    textColor: '#ffffff',
    fontSize: 14
  }
]);

editor.addEventListener('shape-added', (e) => {
  console.log('Shape added:', e.detail.shape.name);
});
```


## ✨ New Features

### 🎨 Smooth Curve Tool
- Added smooth curve drawing tool using Catmull-Rom splines
- Support for adjustable tension and closed/open paths
- Intuitive point-by-point drawing with double-click or Enter to finish

### 🖌️ Fill Modes
- Added fill mode support for all shapes (stroke/fill/both)
- Easy toggle between stroke-only, fill-only, and stroke+fill modes
- Applies to rectangles, circles, polygons, stars, hearts, diamonds, and triangles

## 📚 Documentation
- Updated docs with smooth curve and fill mode examples
- Enhanced Vue3 example showcasing new features
- Added i18n support for new tools

## 🚀 Performance
- Optimized bundle size to ~20KB gzipped (down from 33KB)
- Improved rendering performance for complex curves

## 🔧 Technical Details
- New `SMOOTH_CURVE` object type with Catmull-Rom interpolation
- New `fillMode` property for shape objects
- Enhanced toolbar with fill mode selector
- Keyboard shortcuts: Enter to finish curve, Escape to cancel


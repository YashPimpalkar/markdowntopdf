# Markdown to PDF Studio 📄✨

> Transform raw Markdown into publication-grade, beautifully formatted PDF documents with live A4/Letter paper simulation, mathematical typesetting, syntax-highlighted code cards, and curated themes.

[![Deploy to GitHub Pages](https://github.com/YashPimpalkar/markdowntopdf/actions/workflows/deploy.yml/badge.svg)](https://github.com/YashPimpalkar/markdowntopdf/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🌟 Key Features

- **Live Split-Pane Studio**: Side-by-side editing with synchronized preview, resizable divider, and line numbers.
- **WYSIWYG Paged Paper Simulation**: Realistic A4, US Letter, Legal, and A5 canvas with shadows, margins, and page-break markers.
- **Dual PDF Engine**:
  - **1-Click Direct Download**: Client-side multi-page PDF generation via `html2canvas-pro` + `jsPDF` with auto-slicing.
  - **Vector Print / PDF**: High-resolution browser print engine (`window.print()`) with selectable text, active hyperlinks, and CSS Paged Media.
- **5 Curated Typography Themes**:
  - 🛠️ **Tech & Dev**: Indigo accents with JetBrains Mono code cards.
  - 💼 **Executive Report**: Deep navy headings with warm gold metrics.
  - 🎓 **Academic & Research**: Merriweather serif with Oxford blue citations.
  - 📖 **Editorial / Book**: Playfair Display with literary crimson accents.
  - 🌿 **Swiss Minimal**: High-contrast monochrome with emerald touches.
- **Mathematical Formulas**: Full LaTeX / KaTeX rendering ($...$ and $$...$$).
- **Code Syntax Highlighting**: Prism.js highlighting with macOS-style window controls and language tags.
- **GitHub Callouts**: Styled admonition boxes (`[!NOTE]`, `[!TIP]`, `[!WARNING]`, `[!CAUTION]`).
- **Starter Templates**: Pre-loaded Technical Specifications, Executive Reports, Academic Papers, and Modern Resumes.
- **Zero External CSS Dependencies**: All styling dynamically computed and injected as inline CSS.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
git clone https://github.com/YashPimpalkar/markdowntopdf.git
cd markdowntopdf
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
```

The production assets will be built in the `dist/` directory.

### Running Tests

```bash
npm test
```

---

## 🛠️ Built With

- **React 19** + **TypeScript** + **Vite 8**
- **Tailwind CSS v4**
- **KaTeX** for mathematical typesetting
- **Prism.js** for syntax highlighting
- **html2canvas-pro** & **jsPDF** for PDF rendering
- **Lucide Icons**

---

## 📄 License

MIT © [Yash Pimpalkar](https://github.com/YashPimpalkar)

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';
import type { PageLayoutConfig, ThemeId } from '../types/document';
import { generateInlineStyles, PAGE_SIZES, MARGIN_VALUES_MM } from './styleGenerator';

export interface ExportPdfOptions {
  filename?: string;
  themeId: ThemeId;
  config: PageLayoutConfig;
}

/**
 * Triggers native browser vector print dialog with multi-page support
 */
export function printDocument(): void {
  window.print();
}

/**
 * Rasterizes SVGs into high-resolution PNG images for robust, cross-browser PDF generation.
 * This guarantees node shapes, labels, and text render with 100% fidelity without being stripped.
 */
async function rasterizeSvgElements(clonedEl: HTMLElement, originalEl: HTMLElement): Promise<void> {
  const originalSvgs = originalEl.querySelectorAll<SVGSVGElement>('.mermaid-diagram svg');
  const clonedSvgs = clonedEl.querySelectorAll<SVGSVGElement>('.mermaid-diagram svg');

  for (let i = 0; i < originalSvgs.length && i < clonedSvgs.length; i++) {
    const origSvg = originalSvgs[i];
    const clonedSvg = clonedSvgs[i];

    try {
      const bbox = origSvg.viewBox.baseVal;
      const width = bbox && bbox.width > 0 ? bbox.width : origSvg.clientWidth || origSvg.scrollWidth || 800;
      const height = bbox && bbox.height > 0 ? bbox.height : origSvg.clientHeight || origSvg.scrollHeight || 600;

      const svgClone = origSvg.cloneNode(true) as SVGSVGElement;
      svgClone.setAttribute('width', `${width}`);
      svgClone.setAttribute('height', `${height}`);
      if (!svgClone.getAttribute('viewBox')) {
        svgClone.setAttribute('viewBox', `0 0 ${width} ${height}`);
      }

      const svgString = new XMLSerializer().serializeToString(svgClone);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const blobUrl = URL.createObjectURL(svgBlob);

      await new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const renderScale = 2;
            canvas.width = Math.min(8000, width * renderScale);
            canvas.height = Math.min(8000, height * renderScale);
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = 'high';
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              const dataUrl = canvas.toDataURL('image/png');

              const rasterImg = document.createElement('img');
              rasterImg.src = dataUrl;
              rasterImg.style.width = '100%';
              rasterImg.style.maxWidth = '100%';
              rasterImg.style.height = 'auto';
              rasterImg.style.display = 'block';
              rasterImg.style.margin = '0 auto';

              clonedSvg.parentNode?.replaceChild(rasterImg, clonedSvg);
            }
          } catch (e) {
            console.warn('Canvas rasterization error for SVG:', e);
          } finally {
            URL.revokeObjectURL(blobUrl);
            resolve();
          }
        };
        img.onerror = () => {
          URL.revokeObjectURL(blobUrl);
          resolve();
        };
        img.src = blobUrl;
      });
    } catch (err) {
      console.warn('Failed to rasterize SVG for PDF export:', err);
    }
  }
}

/**
 * Directly downloads the rendered sheet as a multi-page PDF file using html2canvas-pro and jsPDF
 */
export async function downloadDirectPdf(
  element: HTMLElement,
  options: ExportPdfOptions
): Promise<void> {
  const isLandscape = options.config.orientation === 'landscape';
  const paper = PAGE_SIZES[options.config.pageSize] || PAGE_SIZES.a4;
  const pageWidthMm = isLandscape ? paper.heightMm : paper.widthMm;
  const pageHeightMm = isLandscape ? paper.widthMm : paper.heightMm;
  const marginMm = options.config.customMarginMm ?? MARGIN_VALUES_MM[options.config.margin] ?? 20;
  const baseName = options.filename ? options.filename.replace(/\.pdf$/i, '') : 'document';
  const filename = `${baseName}.pdf`;

  const usableWidthMm = pageWidthMm - 2 * marginMm;
  const usableHeightMm = pageHeightMm - 2 * marginMm;

  // Dynamically calculate scale to stay safely below the browser canvas height limit (16384px)
  const elementHeight = element.scrollHeight || element.offsetHeight || 1200;
  const maxCanvasDimension = 14000;
  const scale = Math.min(2, Math.max(0.8, Math.floor((maxCanvasDimension / elementHeight) * 10) / 10));

  // Render element to canvas using html2canvas-pro (supports modern CSS & oklch)
  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    onclone: async (_clonedDoc, clonedEl) => {
      // Remove preview zoom transform and shadows for crisp capture
      clonedEl.style.transform = 'none';
      clonedEl.style.boxShadow = 'none';
      clonedEl.style.margin = '0';
      clonedEl.style.width = `${pageWidthMm}mm`;
      clonedEl.style.height = 'auto';
      clonedEl.style.maxHeight = 'none';
      clonedEl.style.overflow = 'visible';

      // Hide preview-only page break markers
      const breakDividers = clonedEl.querySelectorAll('.page-break-divider');
      breakDividers.forEach((el) => {
        (el as HTMLElement).style.display = 'none';
      });

      // Rasterize all Mermaid vector SVGs to high-res PNG images
      await rasterizeSvgElements(clonedEl, element);
    },
  });

  const mmPerPx = usableWidthMm / canvas.width;
  const pageCanvasHeightPx = Math.floor(usableHeightMm / mmPerPx);

  const pdf = new jsPDF({
    orientation: options.config.orientation,
    unit: 'mm',
    format: options.config.pageSize,
  });

  // Calculate total pages needed
  const totalPages = Math.max(1, Math.ceil(canvas.height / pageCanvasHeightPx));

  for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
    if (pageIndex > 0) {
      pdf.addPage(options.config.pageSize, options.config.orientation);
    }

    const sourceY = pageIndex * pageCanvasHeightPx;
    const sourceHeight = Math.min(pageCanvasHeightPx, canvas.height - sourceY);

    // Create a page canvas slice
    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = canvas.width;
    pageCanvas.height = sourceHeight;
    const pageCtx = pageCanvas.getContext('2d');

    if (pageCtx) {
      pageCtx.fillStyle = '#ffffff';
      pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
      pageCtx.drawImage(
        canvas,
        0,
        sourceY,
        canvas.width,
        sourceHeight,
        0,
        0,
        canvas.width,
        sourceHeight
      );

      const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.98);
      const renderedHeightMm = sourceHeight * mmPerPx;
      pdf.addImage(pageImgData, 'JPEG', marginMm, marginMm, usableWidthMm, renderedHeightMm);
    }
  }

  // Save PDF using native jsPDF save with verified .pdf extension
  const finalFilename = filename.toLowerCase().endsWith('.pdf') ? filename : `${filename}.pdf`;
  pdf.save(finalFilename);
}

/**
 * Exports the document as a self-contained HTML file with inline CSS and fonts
 */
export function exportStandaloneHtml(
  contentHtml: string,
  themeId: ThemeId,
  config: PageLayoutConfig,
  title: string
): void {
  const inlineCss = generateInlineStyles(themeId, config);
  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title || 'Exported Document'}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Merriweather:wght@300;400;700&family=Playfair+Display:ital,wght@0,600;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
  <style>
    ${inlineCss}
    body {
      background-color: #f1f5f9;
      padding: 30px 10px;
      margin: 0;
      display: flex;
      justify-content: center;
    }
  </style>
</head>
<body>
  <div class="paper-sheet markdown-body">
    ${contentHtml}
  </div>
</body>
</html>`;

  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${title || 'document'}.html`;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Exports the raw markdown text file
 */
export function exportMarkdownFile(markdown: string, filename: string): void {
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${filename || 'document'}.md`;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

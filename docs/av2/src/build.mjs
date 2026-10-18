// Gera docs/av2-oncomente.docx e docs/av2-oncomente.md a partir de content.mjs.
// Uso (na raiz): python docs/av2/src/resize_prints.py && node docs/av2/src/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  AlignmentType, BorderStyle, Document, HeadingLevel, HeightRule, ImageRun, LevelFormat, Packer,
  PageBreak, PageNumber, Paragraph, ShadingType, Table, TableCell, TableRow, TextRun, Footer,
  VerticalAlign, WidthType,
} from 'docx';
import { doc } from './content.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const AV2 = path.resolve(here, '..');
const DOCS = path.resolve(AV2, '..');

// A4 com margens de 1,5 cm → largura útil 18 cm.
const CM = 567;
const PAGE_W = 11906;
const MARGIN = Math.round(1.5 * CM);
const CONTENT_W = PAGE_W - 2 * MARGIN;
const BRAND = '5B2E99';
const MUTED = '575760';
const HEADER_BG = 'EEE3FB';
const FONT = 'Calibri';
const SIZES = { xs: 15, sm: 16, md: 19 }; // meio-pontos

const border = { style: BorderStyle.SINGLE, size: 4, color: 'C8C8D0' };
const borders = { top: border, bottom: border, left: border, right: border };

function runs(text, opts = {}) {
  return [new TextRun({ text, font: FONT, ...opts })];
}

function para(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 100, line: 264 },
    alignment: opts.align,
    children: runs(text, { size: opts.size ?? SIZES.md, color: opts.color, bold: opts.bold, italics: opts.italics }),
  });
}

function table(block) {
  const total = block.cols.reduce((s, c) => s + c.w, 0);
  const widths = block.cols.map((c) => Math.floor((c.w / total) * CONTENT_W));
  widths[widths.length - 1] += CONTENT_W - widths.reduce((a, b) => a + b, 0);
  const size = SIZES[block.size ?? 'sm'];
  const cell = (text, i, header) => new TableCell({
    borders,
    width: { size: widths[i], type: WidthType.DXA },
    shading: header ? { fill: HEADER_BG, type: ShadingType.CLEAR, color: 'auto' } : undefined,
    margins: { top: 40, bottom: 40, left: 80, right: 80 },
    verticalAlign: VerticalAlign.TOP,
    children: String(text).split('\n').map((line) => new Paragraph({
      spacing: { after: 0, line: 240 },
      children: runs(line, { size, bold: header, color: header ? BRAND : undefined }),
    })),
  });
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: widths,
    rows: [
      new TableRow({ tableHeader: true, cantSplit: true, children: block.cols.map((c, i) => cell(c.h, i, true)) }),
      ...block.rows.map((r) => new TableRow({
        cantSplit: true,
        height: block.rowHeight ? { value: block.rowHeight, rule: HeightRule.ATLEAST } : undefined,
        children: r.map((v, i) => cell(v, i, false)),
      })),
    ],
  });
}

function imageGrid(block) {
  const colW = Math.floor(CONTENT_W / block.cols);
  const maxW = Math.floor((colW / 1440) * 96) - 8; // DXA → pol → px (96 dpi)
  // Altura alvo em cm permite fixar quantas linhas cabem por página (economia de papel).
  const byHeight = block.imgHeightCm ? Math.floor((block.imgHeightCm / 2.54) * 96 * 390 / 844) : maxW;
  const imgPx = Math.min(maxW, byHeight);
  const rows = [];
  for (let i = 0; i < block.items.length; i += block.cols) {
    const slice = block.items.slice(i, i + block.cols);
    while (slice.length < block.cols) slice.push(null);
    rows.push(new TableRow({
      cantSplit: true,
      children: slice.map((item) => new TableCell({
        width: { size: colW, type: WidthType.DXA },
        borders: { top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }, bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }, left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }, right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' } },
        margins: { top: 40, bottom: 60, left: 40, right: 40 },
        children: item ? [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 20 },
            children: [imageRun(item.src, imgPx)],
          }),
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: runs(item.caption, { size: SIZES.xs, color: MUTED }) }),
        ] : [new Paragraph({ children: [] })],
      })),
    }));
  }
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: Array(block.cols).fill(colW), rows });
}

function imageRun(src, widthPx) {
  const jpg = path.join(AV2, src.replace(/^prints\//, 'prints/docx/').replace(/\.png$/, '.jpg'));
  const file = fs.existsSync(jpg) ? jpg : path.join(AV2, src);
  const data = fs.readFileSync(file);
  // Prints são 390×844 (proporção fixa do viewport de captura).
  return new ImageRun({
    type: file.endsWith('.jpg') ? 'jpg' : 'png',
    data,
    transformation: { width: widthPx, height: Math.round(widthPx * 844 / 390) },
  });
}

function toDocx() {
  const children = [
    new Paragraph({ spacing: { after: 60 }, children: runs(doc.title, { size: 36, bold: true, color: BRAND }) }),
    para(doc.subtitle, { size: 22, color: MUTED }),
    para(doc.meta, { size: SIZES.sm, color: MUTED }),
  ];
  for (const b of doc.blocks) {
    if (b.type === 'h1') children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, keepNext: true, children: runs(b.text) }));
    else if (b.type === 'h2') children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, keepNext: true, children: runs(b.text) }));
    else if (b.type === 'h3') children.push(new Paragraph({ heading: HeadingLevel.HEADING_3, keepNext: true, children: runs(b.text) }));
    else if (b.type === 'p') children.push(para(b.text));
    else if (b.type === 'bullets') b.items.forEach((t) => children.push(new Paragraph({ numbering: { reference: 'bullets', level: 0 }, spacing: { after: 40 }, children: runs(t, { size: SIZES.md }) })));
    else if (b.type === 'code') b.text.split('\n').forEach((line, i, arr) => children.push(new Paragraph({ spacing: { after: i === arr.length - 1 ? 120 : 0, line: 240 }, children: runs(line, { font: 'Consolas', size: 15 }) })));
    else if (b.type === 'table') { children.push(table(b)); children.push(new Paragraph({ spacing: { after: 80 }, children: [] })); }
    else if (b.type === 'images') { children.push(imageGrid(b)); children.push(new Paragraph({ spacing: { after: 60 }, children: [] })); }
    else if (b.type === 'pagebreak') children.push(new Paragraph({ children: [new PageBreak()] }));
  }

  const heading = (id, size, before) => ({
    id, name: id, basedOn: 'Normal', next: 'Normal', quickFormat: true,
    run: { font: FONT, size, bold: true, color: BRAND },
    paragraph: { spacing: { before, after: 80 }, outlineLevel: Number(id.slice(-1)) - 1 },
  });

  return new Document({
    creator: 'OncoMente',
    title: doc.title,
    styles: {
      default: { document: { run: { font: FONT, size: SIZES.md } } },
      paragraphStyles: [heading('Heading1', 26, 200), heading('Heading2', 22, 140), heading('Heading3', 20, 100)],
    },
    numbering: {
      config: [{
        reference: 'bullets',
        levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 360, hanging: 240 } } } }],
      }],
    },
    sections: [{
      properties: { page: { size: { width: PAGE_W, height: 16838 }, margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN } } },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: 'OncoMente · AV2 UX · ', font: FONT, size: 14, color: MUTED }), new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 14, color: MUTED })],
          })],
        }),
      },
      children,
    }],
  });
}

function toMarkdown() {
  const esc = (s) => String(s).replace(/\|/g, '\\|').replace(/\n/g, '<br>');
  const out = [`# ${doc.title}`, '', `_${doc.subtitle}_`, '', doc.meta, ''];
  for (const b of doc.blocks) {
    if (b.type === 'h1') out.push(`## ${b.text}`, '');
    else if (b.type === 'h2') out.push(`### ${b.text}`, '');
    else if (b.type === 'h3') out.push(`#### ${b.text}`, '');
    else if (b.type === 'p') out.push(b.text, '');
    else if (b.type === 'bullets') out.push(...b.items.map((t) => `- ${t}`), '');
    else if (b.type === 'code') out.push('```', b.text, '```', '');
    else if (b.type === 'table') {
      out.push(`| ${b.cols.map((c) => esc(c.h)).join(' | ')} |`, `|${b.cols.map(() => '---').join('|')}|`);
      b.rows.forEach((r) => out.push(`| ${r.map((v) => esc(v) || ' ').join(' | ')} |`));
      out.push('');
    } else if (b.type === 'images') {
      for (let i = 0; i < b.items.length; i += b.cols) {
        const slice = b.items.slice(i, i + b.cols);
        out.push(`| ${slice.map((it) => esc(it.caption)).join(' | ')} |`, `|${slice.map(() => ':---:').join('|')}|`);
        out.push(`| ${slice.map((it) => `<img src="av2/${it.src}" width="160">`).join(' | ')} |`, '');
      }
    } else if (b.type === 'pagebreak') out.push('---', '');
  }
  return out.join('\n');
}

fs.writeFileSync(path.join(DOCS, 'av2-oncomente.md'), toMarkdown(), 'utf8');
const buffer = await Packer.toBuffer(toDocx());
fs.writeFileSync(path.join(DOCS, 'av2-oncomente.docx'), buffer);
console.log('docs/av2-oncomente.docx', (buffer.length / 1024).toFixed(0), 'KB');
console.log('docs/av2-oncomente.md');

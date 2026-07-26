import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const BUILD_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const SOURCE_DIR = path.resolve(BUILD_DIR, "..");
const OUTPUT_DIR = path.join(SOURCE_DIR, "真实PPT_可编辑版");
const PREVIEW_DIR = path.join(BUILD_DIR, "previews");

const DECKS = [
  { source: "module1.ppt.html", output: "模块一_3D打印与FreeCAD入门_可编辑版.pptx" },
  { source: "module2.ppt.html", output: "模块二_草图约束与特征建模_可编辑版.pptx" },
  { source: "module3.ppt.html", output: "模块三_Python编程建模_可编辑版.pptx" },
  { source: "module4.ppt.html", output: "模块四_结构设计与原生装配_可编辑版.pptx" },
  { source: "module5.ppt.html", output: "模块五_仿真切片与打印试验_可编辑版.pptx" },
  { source: "module6.ppt.html", output: "模块六_综合STEAM项目与展示_可编辑版.pptx" },
];

const SLIDE_W = 1280;
const SLIDE_H = 720;
const FONT = "Microsoft YaHei";
const MONO = "Consolas";
const COLORS = {
  purple: "#667EEA",
  purpleDark: "#4C51BF",
  dark: "#42637A",
  light: "#F8F9FE",
  warm: "#E85D75",
  cool: "#2A9DF4",
  text: "#2D3748",
  muted: "#718096",
  white: "#FFFFFF",
  code: "#1E1E2E",
  codeText: "#E2E8F0",
  accent: "#F093FB",
  pale: "#EDF2F7",
  green: "#2F855A",
  amber: "#B7791F",
};

function decodeEntities(value) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)));
}

function parseAttributes(source) {
  const attrs = {};
  const attrPattern = /([^\s=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  let match;
  while ((match = attrPattern.exec(source))) {
    attrs[match[1].toLowerCase()] = decodeEntities(match[2] ?? match[3] ?? match[4] ?? "");
  }
  return attrs;
}

function parseHtml(html) {
  const root = { tag: "root", attrs: {}, children: [], parent: null };
  const stack = [root];
  const voidTags = new Set(["img", "meta", "link", "br", "hr", "input", "source"]);
  const tokenPattern = /<!--[\s\S]*?-->|<![^>]*>|<\/?[^>]+>|[^<]+/g;
  let token;
  while ((token = tokenPattern.exec(html))) {
    const raw = token[0];
    if (raw.startsWith("<!--") || raw.startsWith("<!")) continue;
    if (raw.startsWith("</")) {
      const tag = raw.slice(2, -1).trim().toLowerCase();
      while (stack.length > 1) {
        const popped = stack.pop();
        if (popped.tag === tag) break;
      }
      continue;
    }
    if (raw.startsWith("<")) {
      const selfClosing = raw.endsWith("/>");
      const inside = raw.slice(1, raw.length - (selfClosing ? 2 : 1)).trim();
      const firstSpace = inside.search(/\s/);
      const tag = (firstSpace === -1 ? inside : inside.slice(0, firstSpace)).toLowerCase();
      const attrSource = firstSpace === -1 ? "" : inside.slice(firstSpace + 1);
      const node = { tag, attrs: parseAttributes(attrSource), children: [], parent: stack.at(-1) };
      stack.at(-1).children.push(node);
      if (!selfClosing && !voidTags.has(tag)) stack.push(node);
      continue;
    }
    const text = decodeEntities(raw);
    if (text.trim()) stack.at(-1).children.push({ tag: "#text", text, parent: stack.at(-1) });
  }
  return root;
}

function classList(node) {
  return (node.attrs?.class || "").split(/\s+/).filter(Boolean);
}

function hasClass(node, className) {
  return classList(node).includes(className);
}

function descendants(node, predicate, result = []) {
  for (const child of node.children || []) {
    if (predicate(child)) result.push(child);
    descendants(child, predicate, result);
  }
  return result;
}

function first(node, predicate) {
  return descendants(node, predicate, [])[0] || null;
}

function insideClass(node, className) {
  let current = node.parent;
  while (current) {
    if (hasClass(current, className)) return true;
    current = current.parent;
  }
  return false;
}

function textContent(node) {
  if (!node) return "";
  if (node.tag === "#text") return node.text;
  if (node.tag === "br") return "\n";
  return (node.children || []).map(textContent).join("");
}

function cleanText(value) {
  return value
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function nodeText(node) {
  return cleanText(textContent(node));
}

function extractSlide(node) {
  const title = nodeText(first(node, (n) => n.tag === "h1"));
  const subtitle = nodeText(first(node, (n) => n.tag === "h2"));
  const icon = nodeText(first(node, (n) => hasClass(n, "icon-large") || hasClass(n, "icon-medium")));
  const codeNode = first(node, (n) => n.tag === "pre");
  const cards = descendants(node, (n) => hasClass(n, "ppt-card")).map((card) => ({
    title: nodeText(first(card, (n) => n.tag === "h3")),
    body: nodeText(first(card, (n) => n.tag === "p")),
  }));
  const explainItems = descendants(node, (n) => hasClass(n, "explain-item")).map((item) => ({
    label: nodeText(first(item, (n) => hasClass(n, "explain-code"))),
    body: nodeText(first(item, (n) => hasClass(n, "explain-text"))),
  }));
  const summaryItems = descendants(node, (n) => hasClass(n, "summary-item")).map((item) => ({
    label: nodeText(first(item, (n) => n.tag === "strong")),
    body: nodeText(item).replace(nodeText(first(item, (n) => n.tag === "strong")), "").trim(),
  }));
  const listItems = descendants(node, (n) => n.tag === "li" && !insideClass(n, "ppt-card"))
    .map(nodeText)
    .filter(Boolean);
  const paragraphs = descendants(node, (n) =>
    n.tag === "p" &&
    !insideClass(n, "ppt-card") &&
    !insideClass(n, "code-summary") &&
    !insideClass(n, "code-explain") &&
    !insideClass(n, "preview-box"),
  ).map((p) => ({ text: nodeText(p), small: hasClass(p, "small") })).filter((p) => p.text);
  const previewParagraphs = descendants(node, (n) => n.tag === "p" && insideClass(n, "preview-box"))
    .map(nodeText).filter(Boolean);
  const images = descendants(node, (n) => n.tag === "img").map((img) => ({
    src: img.attrs.src,
    alt: img.attrs.alt || "课程图片",
  }));
  return {
    classes: classList(node),
    title,
    subtitle,
    icon,
    code: codeNode ? cleanText(textContent(codeNode)) : "",
    cards,
    explainItems,
    summaryItems,
    listItems,
    paragraphs: [...previewParagraphs.map((text) => ({ text, small: false })), ...paragraphs],
    images,
  };
}

function backgroundFor(classes) {
  if (classes.includes("bg-dark")) return { fill: COLORS.dark, text: COLORS.white, muted: "#CBD5E0" };
  if (classes.includes("bg-light")) return { fill: COLORS.light, text: COLORS.text, muted: COLORS.muted };
  if (classes.includes("bg-warm")) return { fill: COLORS.warm, text: COLORS.white, muted: "#FFF5F5" };
  if (classes.includes("bg-cool")) return { fill: COLORS.cool, text: COLORS.white, muted: "#EBF8FF" };
  return { fill: COLORS.purple, text: COLORS.white, muted: "#E9E8FF" };
}

function addText(slide, {
  text,
  left,
  top,
  width,
  height,
  fontSize = 24,
  color = COLORS.text,
  bold = false,
  align = "left",
  valign = "top",
  font = FONT,
  name,
  fill = "none",
  line = { style: "solid", fill: "none", width: 0 },
  radius,
  insets = { top: 4, right: 6, bottom: 4, left: 6 },
}) {
  const shape = slide.shapes.add({
    geometry: radius ? "roundRect" : "textbox",
    name,
    position: { left, top, width, height },
    fill,
    line,
    ...(radius ? { borderRadius: radius } : {}),
  });
  shape.text = text;
  shape.text.style = {
    fontSize,
    bold,
    color,
    alignment: align,
    verticalAlignment: valign,
    typeface: font,
    autoFit: "shrinkText",
    insets,
  };
  return shape;
}

function addTitle(slide, data, bg, pageNumber, moduleName) {
  slide.shapes.add({
    geometry: "rect",
    name: "top-accent",
    position: { left: 0, top: 0, width: SLIDE_W, height: 8 },
    fill: bg.text === COLORS.white ? COLORS.accent : COLORS.purple,
    line: { style: "solid", fill: "none", width: 0 },
  });
  addText(slide, {
    text: data.title,
    left: 64,
    top: 36,
    width: data.icon ? 1060 : 1140,
    height: 78,
    fontSize: 50,
    color: bg.text,
    bold: true,
    name: "slide-title",
  });
  if (data.icon) {
    addText(slide, {
      text: data.icon,
      left: 1140,
      top: 28,
      width: 76,
      height: 76,
      fontSize: 52,
      color: bg.text,
      align: "center",
      valign: "middle",
      name: "slide-icon",
    });
  }
  addText(slide, {
    text: `${moduleName}  ·  ${pageNumber}`,
    left: 64,
    top: 676,
    width: 1152,
    height: 24,
    fontSize: 15,
    color: bg.muted,
    align: "right",
    name: "footer",
  });
}

function addSubtitle(slide, text, bg, top = 116) {
  if (!text) return;
  addText(slide, {
    text,
    left: 72,
    top,
    width: 1136,
    height: 54,
    fontSize: 29,
    color: bg.muted,
    bold: true,
    align: "center",
    name: "subtitle",
  });
}

function addBulletBox(slide, items, position, bg, name = "bullet-list") {
  const box = slide.shapes.add({
    geometry: "roundRect",
    name,
    position,
    fill: bg.text === COLORS.white ? "#FFFFFF18" : COLORS.white,
    line: { style: "solid", fill: bg.text === COLORS.white ? "#FFFFFF44" : "#D8E0ED", width: 1 },
    borderRadius: 18,
  });
  box.text = items.map((item) => ({
    bulletCharacter: "•",
    marginLeft: 28,
    indent: -14,
    spaceAfter: 8,
    runs: [item],
  }));
  box.text.style = {
    fontSize: items.length > 7 ? 21 : 24,
    color: bg.text,
    typeface: FONT,
    autoFit: "shrinkText",
    insets: { top: 18, right: 20, bottom: 14, left: 22 },
  };
}

function renderTitleSlide(slide, data, bg, moduleName) {
  const accent = slide.shapes.add({
    geometry: "rect",
    position: { left: 0, top: 0, width: 20, height: SLIDE_H },
    fill: COLORS.accent,
    line: { style: "solid", fill: "none", width: 0 },
  });
  accent.sendToBack();
  if (data.icon) {
    addText(slide, {
      text: data.icon,
      left: 850,
      top: 145,
      width: 280,
      height: 230,
      fontSize: 150,
      color: bg.text,
      align: "center",
      valign: "middle",
      name: "title-icon",
    });
  }
  addText(slide, {
    text: data.title || moduleName,
    left: 80,
    top: 155,
    width: 700,
    height: 110,
    fontSize: 72,
    color: bg.text,
    bold: true,
    name: "deck-title",
  });
  addText(slide, {
    text: data.subtitle,
    left: 84,
    top: 278,
    width: 760,
    height: 92,
    fontSize: 36,
    color: bg.muted,
    bold: true,
    name: "deck-subtitle",
  });
  const meta = data.paragraphs.map((p) => p.text).join("  ·  ");
  if (meta) {
    addText(slide, {
      text: meta,
      left: 84,
      top: 420,
      width: 900,
      height: 52,
      fontSize: 22,
      color: bg.muted,
      name: "deck-meta",
    });
  }
  addText(slide, {
    text: "可编辑PowerPoint课件",
    left: 84,
    top: 610,
    width: 420,
    height: 32,
    fontSize: 18,
    color: bg.muted,
    bold: true,
    name: "editable-label",
  });
}

function renderCodeSlide(slide, data, bg, pageNumber, moduleName) {
  addTitle(slide, data, bg, pageNumber, moduleName);
  const intro = data.paragraphs.filter((p) => !p.small).map((p) => p.text).slice(0, 1).join("");
  if (intro) {
    addText(slide, {
      text: intro,
      left: 68,
      top: 112,
      width: 1140,
      height: 34,
      fontSize: 21,
      color: bg.muted,
      align: "center",
      name: "code-intro",
    });
  }
  const top = intro ? 154 : 132;
  const height = 510;
  slide.shapes.add({
    geometry: "roundRect",
    name: "code-panel",
    position: { left: 56, top, width: 700, height },
    fill: COLORS.code,
    line: { style: "solid", fill: "#4A5568", width: 1 },
    borderRadius: 16,
  });
  addText(slide, {
    text: data.code,
    left: 76,
    top: top + 18,
    width: 660,
    height: height - 36,
    fontSize: data.code.split("\n").length > 11 ? 18 : 20,
    color: COLORS.codeText,
    font: MONO,
    name: "editable-code",
    insets: { top: 4, right: 4, bottom: 4, left: 4 },
  });
  const notes = data.explainItems.length ? data.explainItems : data.summaryItems;
  const fallback = data.paragraphs.filter((p) => !p.small).slice(intro ? 1 : 0).map((p) => ({ label: "", body: p.text }));
  const entries = (notes.length ? notes : fallback).slice(0, 7);
  const rightX = 784;
  const rightW = 440;
  const gap = 10;
  const itemH = Math.min(94, Math.max(58, (height - gap * Math.max(0, entries.length - 1)) / Math.max(1, entries.length)));
  entries.forEach((entry, index) => {
    const y = top + index * (itemH + gap);
    slide.shapes.add({
      geometry: "roundRect",
      name: `explain-${index + 1}`,
      position: { left: rightX, top: y, width: rightW, height: itemH },
      fill: bg.text === COLORS.white ? "#FFFFFF14" : COLORS.white,
      line: { style: "solid", fill: "#89B4FA", width: 2 },
      borderRadius: 12,
    });
    const combined = entry.label ? `${entry.label}\n${entry.body}` : entry.body;
    addText(slide, {
      text: combined,
      left: rightX + 12,
      top: y + 6,
      width: rightW - 24,
      height: itemH - 12,
      fontSize: entries.length > 5 ? 17 : 19,
      color: bg.text,
      bold: false,
      name: `explain-text-${index + 1}`,
      insets: { top: 2, right: 2, bottom: 2, left: 2 },
    });
  });
}

function renderImageSlide(slide, data, bg, pageNumber, moduleName) {
  addTitle(slide, data, bg, pageNumber, moduleName);
  addSubtitle(slide, data.subtitle, bg, 110);
  const imageTop = data.subtitle ? 172 : 136;
  const imageBottom = 568;
  const count = data.images.length;
  const frameW = count > 1 ? 520 : 650;
  const totalW = count * frameW + Math.max(0, count - 1) * 32;
  const startX = (SLIDE_W - totalW) / 2;
  data.images.slice(0, 2).forEach(async () => {});
  return Promise.all(data.images.slice(0, 2).map(async (image, index) => {
    const imagePath = path.resolve(SOURCE_DIR, image.src);
    const bytes = await fs.readFile(imagePath);
    const ext = path.extname(imagePath).toLowerCase();
    const contentType = ext === ".gif" ? "image/gif" : ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : "image/png";
    slide.images.add({
      blob: new Uint8Array(bytes),
      contentType,
      alt: image.alt,
      fit: "contain",
      position: {
        left: startX + index * (frameW + 32),
        top: imageTop,
        width: frameW,
        height: imageBottom - imageTop,
      },
      geometry: "roundRect",
      borderRadius: 14,
    });
  })).then(() => {
    const body = data.paragraphs.map((p) => p.text).filter(Boolean).join("\n");
    if (body) {
      addText(slide, {
        text: body,
        left: 90,
        top: 578,
        width: 1100,
        height: 80,
        fontSize: 20,
        color: bg.text,
        align: "center",
        name: "image-caption",
      });
    }
  });
}

function renderCardsSlide(slide, data, bg, pageNumber, moduleName) {
  addTitle(slide, data, bg, pageNumber, moduleName);
  const intro = [data.subtitle, ...data.paragraphs.filter((p) => !p.small).map((p) => p.text)].filter(Boolean).slice(0, 2).join("\n");
  if (intro) {
    addText(slide, {
      text: intro,
      left: 80,
      top: 116,
      width: 1120,
      height: 62,
      fontSize: 24,
      color: bg.muted,
      align: "center",
      name: "cards-intro",
    });
  }
  const cards = data.cards;
  const columns = cards.length <= 2 ? cards.length : cards.length <= 4 ? 2 : 3;
  const rows = Math.ceil(cards.length / Math.max(1, columns));
  const gapX = 24;
  const gapY = 18;
  const left = 72;
  const top = intro ? 194 : 154;
  const width = 1136;
  const height = 486;
  const cardW = (width - gapX * (columns - 1)) / columns;
  const cardH = (height - gapY * (rows - 1)) / rows;
  cards.forEach((card, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    const x = left + col * (cardW + gapX);
    const y = top + row * (cardH + gapY);
    slide.shapes.add({
      geometry: "roundRect",
      name: `card-${index + 1}`,
      position: { left: x, top: y, width: cardW, height: cardH },
      fill: bg.text === COLORS.white ? "#FFFFFF18" : COLORS.white,
      line: { style: "solid", fill: bg.text === COLORS.white ? "#FFFFFF38" : "#D8E0ED", width: 1 },
      borderRadius: 16,
    });
    addText(slide, {
      text: card.title,
      left: x + 18,
      top: y + 14,
      width: cardW - 36,
      height: 42,
      fontSize: 24,
      color: bg.text,
      bold: true,
      name: `card-title-${index + 1}`,
    });
    addText(slide, {
      text: card.body,
      left: x + 18,
      top: y + 62,
      width: cardW - 36,
      height: cardH - 78,
      fontSize: cards.length > 6 ? 18 : 21,
      color: bg.text,
      name: `card-body-${index + 1}`,
    });
  });
}

function renderListSlide(slide, data, bg, pageNumber, moduleName) {
  addTitle(slide, data, bg, pageNumber, moduleName);
  addSubtitle(slide, data.subtitle, bg, 108);
  const intro = data.paragraphs.filter((p) => !p.small).map((p) => p.text).slice(0, 2).join("\n");
  const top = data.subtitle ? 174 : intro ? 176 : 144;
  if (intro) {
    addText(slide, {
      text: intro,
      left: 86,
      top: data.subtitle ? 160 : 116,
      width: 1108,
      height: 54,
      fontSize: 23,
      color: bg.muted,
      align: "center",
      name: "list-intro",
    });
  }
  if (data.listItems.length > 8) {
    const middle = Math.ceil(data.listItems.length / 2);
    addBulletBox(slide, data.listItems.slice(0, middle), { left: 70, top, width: 550, height: 480 }, bg, "bullet-list-left");
    addBulletBox(slide, data.listItems.slice(middle), { left: 660, top, width: 550, height: 480 }, bg, "bullet-list-right");
  } else {
    addBulletBox(slide, data.listItems, { left: 120, top, width: 1040, height: 480 }, bg);
  }
}

function renderGeneralSlide(slide, data, bg, pageNumber, moduleName) {
  addTitle(slide, data, bg, pageNumber, moduleName);
  addSubtitle(slide, data.subtitle, bg, 110);
  const content = data.paragraphs.map((p) => p.text).filter(Boolean);
  const top = data.subtitle ? 188 : 156;
  if (!content.length && data.icon) {
    addText(slide, {
      text: data.icon,
      left: 460,
      top: 220,
      width: 360,
      height: 260,
      fontSize: 150,
      color: bg.text,
      align: "center",
      valign: "middle",
      name: "hero-icon",
    });
    return;
  }
  const count = Math.max(1, content.length);
  const gap = 20;
  const itemH = Math.min(130, (470 - gap * (count - 1)) / count);
  content.forEach((text, index) => {
    const y = top + index * (itemH + gap);
    addText(slide, {
      text,
      left: 150,
      top: y,
      width: 980,
      height: itemH,
      fontSize: count > 4 ? 23 : 29,
      color: bg.text,
      bold: index === 0 && count <= 3,
      align: "center",
      valign: "middle",
      name: `body-${index + 1}`,
      fill: bg.text === COLORS.white ? "#FFFFFF12" : COLORS.white,
      line: { style: "solid", fill: bg.text === COLORS.white ? "#FFFFFF30" : "#D8E0ED", width: 1 },
      radius: 14,
      insets: { top: 12, right: 20, bottom: 12, left: 20 },
    });
  });
}

async function renderSlide(slide, data, index, moduleName) {
  const bg = backgroundFor(data.classes);
  slide.background.fill = bg.fill;
  if (index === 0) {
    renderTitleSlide(slide, data, bg, moduleName);
    return;
  }
  if (data.code) {
    renderCodeSlide(slide, data, bg, index + 1, moduleName);
    return;
  }
  if (data.images.length) {
    await renderImageSlide(slide, data, bg, index + 1, moduleName);
    return;
  }
  if (data.cards.length) {
    renderCardsSlide(slide, data, bg, index + 1, moduleName);
    return;
  }
  if (data.listItems.length) {
    renderListSlide(slide, data, bg, index + 1, moduleName);
    return;
  }
  renderGeneralSlide(slide, data, bg, index + 1, moduleName);
}

async function writeBlob(targetPath, blob) {
  await fs.writeFile(targetPath, new Uint8Array(await blob.arrayBuffer()));
}

async function buildDeck(deck) {
  const html = await fs.readFile(path.join(SOURCE_DIR, deck.source), "utf8");
  const root = parseHtml(html);
  const slideNodes = descendants(root, (node) => hasClass(node, "slide"));
  const slideData = slideNodes.map(extractSlide);
  const moduleName = slideData[0]?.title || path.basename(deck.source);
  const presentation = Presentation.create({ slideSize: { width: SLIDE_W, height: SLIDE_H } });

  for (let index = 0; index < slideData.length; index += 1) {
    const slide = presentation.slides.add();
    await renderSlide(slide, slideData[index], index, moduleName);
  }

  const deckPreviewDir = path.join(PREVIEW_DIR, path.basename(deck.source, ".ppt.html"));
  await fs.mkdir(deckPreviewDir, { recursive: true });
  for (const [index, slide] of presentation.slides.items.entries()) {
    const stem = `slide-${String(index + 1).padStart(2, "0")}`;
    await writeBlob(path.join(deckPreviewDir, `${stem}.png`), await presentation.export({ slide, format: "png", scale: 1 }));
    await fs.writeFile(path.join(deckPreviewDir, `${stem}.layout.json`), await (await slide.export({ format: "layout" })).text());
  }
  await writeBlob(path.join(deckPreviewDir, "montage.webp"), await presentation.export({ format: "webp", montage: true, scale: 1 }));

  const outputPath = path.join(OUTPUT_DIR, deck.output);
  const pptx = await PresentationFile.exportPptx(presentation);
  await pptx.save(outputPath);
  return { outputPath, slideCount: slideData.length };
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.mkdir(PREVIEW_DIR, { recursive: true });
  const results = [];
  for (const deck of DECKS) {
    results.push(await buildDeck(deck));
  }
  console.log(JSON.stringify(results, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

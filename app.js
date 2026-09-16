"use strict";

const ITEMS = {
  top: { name: "トップス", color: "#f2efe8" },
  pants: { name: "パンツ", color: "#414955" },
  shoes: { name: "シューズ", color: "#1c1c1c" },
  outer: { name: "アウター", color: "#847a6d" },
};

const BASIC_COLORS = [
  ["ブラック", "#111111"], ["チャコール", "#3f4143"], ["グレー", "#85878a"],
  ["ライトグレー", "#c7c7c3"], ["ホワイト", "#f7f7f4"], ["アイボリー", "#eee8da"],
  ["ベージュ", "#c8b99f"], ["キャメル", "#a77e50"], ["ブラウン", "#654b3a"],
  ["ネイビー", "#202c48"], ["カーキ", "#62614a"], ["デニム", "#4b6685"],
];

const GRID_COLORS = [
  "#7f1d1d", "#b91c1c", "#ef4444", "#fb7185", "#9f1239", "#be185d", "#ec4899", "#f472b6",
  "#581c87", "#7e22ce", "#a855f7", "#c084fc", "#312e81", "#4338ca", "#6366f1", "#818cf8",
  "#1e3a8a", "#1d4ed8", "#3b82f6", "#60a5fa", "#164e63", "#0891b2", "#22d3ee", "#67e8f9",
  "#064e3b", "#047857", "#10b981", "#6ee7b7", "#365314", "#65a30d", "#a3e635", "#bef264",
  "#713f12", "#ca8a04", "#facc15", "#fde047", "#7c2d12", "#ea580c", "#fb923c", "#fdba74",
  "#431407", "#9a3412", "#c2410c", "#f97316", "#3f3f46", "#71717a", "#a1a1aa", "#e4e4e7",
];

let selectedItem = "top";

const root = document.documentElement;
const outfit = document.querySelector("#outfit");
const outerToggle = document.querySelector("#outer-toggle");
const outerState = document.querySelector("#outer-state");
const itemName = document.querySelector("#selected-item-name");
const currentSwatch = document.querySelector("#current-color-swatch");
const hexValue = document.querySelector("#hex-value");
const spectrumPicker = document.querySelector("#spectrum-picker");
const rgbInputs = {
  r: document.querySelector("#rgb-r"),
  g: document.querySelector("#rgb-g"),
  b: document.querySelector("#rgb-b"),
};
const eyedropperButton = document.querySelector("#eyedropper-button");
const eyedropperNote = document.querySelector("#eyedropper-note");

function clampChannel(value) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return 0;
  return Math.min(255, Math.max(0, parsed));
}

function normalizeHex(hex) {
  const value = String(hex).trim().replace("#", "");
  if (/^[0-9a-f]{6}$/i.test(value)) return `#${value.toLowerCase()}`;
  if (/^[0-9a-f]{3}$/i.test(value)) {
    return `#${value.split("").map((character) => character + character).join("").toLowerCase()}`;
  }
  return null;
}

function hexToRgb(hex) {
  const normalized = normalizeHex(hex);
  if (!normalized) return { r: 0, g: 0, b: 0 };
  return {
    r: Number.parseInt(normalized.slice(1, 3), 16),
    g: Number.parseInt(normalized.slice(3, 5), 16),
    b: Number.parseInt(normalized.slice(5, 7), 16),
  };
}

function rgbToHex(r, g, b) {
  return `#${[r, g, b].map((value) => clampChannel(value).toString(16).padStart(2, "0")).join("")}`;
}

function contrastColor(hex) {
  const { r, g, b } = hexToRgb(hex);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.6 ? "#111111" : "#ffffff";
}

function renderSwatches(container, colors, named = false) {
  colors.forEach((entry, index) => {
    const [name, color] = named ? entry : [`カラー ${index + 1}`, entry];
    const button = document.createElement("button");
    button.type = "button";
    button.className = "color-swatch";
    button.style.setProperty("--swatch", color);
    button.dataset.color = color;
    button.title = `${name} ${color.toUpperCase()}`;
    button.setAttribute("aria-label", `${name} ${color.toUpperCase()}を選ぶ`);
    button.addEventListener("click", () => setColor(color));
    container.append(button);
  });
}

function syncControls() {
  const color = ITEMS[selectedItem].color;
  const rgb = hexToRgb(color);

  itemName.textContent = ITEMS[selectedItem].name;
  currentSwatch.style.backgroundColor = color;
  hexValue.textContent = color.toUpperCase();
  spectrumPicker.value = color;
  rgbInputs.r.value = rgb.r;
  rgbInputs.g.value = rgb.g;
  rgbInputs.b.value = rgb.b;

  document.querySelectorAll("[data-select-item]").forEach((button) => {
    const active = button.dataset.selectItem === selectedItem;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  document.querySelectorAll("[data-item]").forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.item === selectedItem);
  });

  document.querySelectorAll(".color-swatch").forEach((button) => {
    const current = normalizeHex(button.dataset.color) === color;
    button.classList.toggle("is-current", current);
    button.setAttribute("aria-pressed", String(current));
  });
}

function renderOutfit() {
  Object.entries(ITEMS).forEach(([key, item]) => {
    root.style.setProperty(`--${key}-color`, item.color);
    document.querySelectorAll(`[data-item="${key}"]`).forEach((part) => {
      part.style.color = contrastColor(item.color);
    });
    const chip = document.querySelector(`[data-chip-color="${key}"]`);
    if (chip) chip.style.backgroundColor = item.color;
  });
}

function setSelectedItem(item) {
  if (!ITEMS[item]) return;
  selectedItem = item;
  syncControls();
}

function setColor(color) {
  const normalized = normalizeHex(color);
  if (!normalized) return;
  ITEMS[selectedItem].color = normalized;
  renderOutfit();
  syncControls();
}

function applyRgbInputs() {
  const r = clampChannel(rgbInputs.r.value);
  const g = clampChannel(rgbInputs.g.value);
  const b = clampChannel(rgbInputs.b.value);
  setColor(rgbToHex(r, g, b));
}

renderSwatches(document.querySelector("#basic-colors"), BASIC_COLORS, true);
renderSwatches(document.querySelector("#color-grid"), GRID_COLORS);

document.querySelectorAll("[data-select-item]").forEach((button) => {
  button.addEventListener("click", () => setSelectedItem(button.dataset.selectItem));
});

document.querySelectorAll("[data-item]").forEach((button) => {
  button.addEventListener("click", () => setSelectedItem(button.dataset.item));
});

outerToggle.addEventListener("change", () => {
  outfit.classList.toggle("has-outer", outerToggle.checked);
  outerState.textContent = outerToggle.checked ? "着用中" : "なし";
  if (outerToggle.checked) setSelectedItem("outer");
  if (!outerToggle.checked && selectedItem === "outer") setSelectedItem("top");
});

spectrumPicker.addEventListener("input", (event) => setColor(event.target.value));

Object.values(rgbInputs).forEach((input) => {
  input.addEventListener("input", () => {
    if (Object.values(rgbInputs).every((field) => field.value !== "")) applyRgbInputs();
  });
  input.addEventListener("change", applyRgbInputs);
  input.addEventListener("blur", applyRgbInputs);
});

if ("EyeDropper" in window && window.isSecureContext) {
  eyedropperNote.textContent = "ボタンを押すと、画面上の好きな色を選べます。";
  eyedropperButton.addEventListener("click", async () => {
    try {
      eyedropperNote.textContent = "画面上から色を選んでください。Escキーでキャンセルできます。";
      const result = await new EyeDropper().open();
      setColor(result.sRGBHex);
      eyedropperNote.textContent = `${result.sRGBHex.toUpperCase()} を選びました。`;
    } catch (error) {
      if (error?.name === "AbortError") {
        eyedropperNote.textContent = "スポイトをキャンセルしました。";
      } else {
        eyedropperNote.textContent = "色を取得できませんでした。もう一度お試しください。";
      }
    }
  });
} else {
  eyedropperButton.disabled = true;
  eyedropperNote.textContent = "このブラウザではスポイトを利用できません。ほかの色選択方法をご利用ください。";
}

renderOutfit();
syncControls();

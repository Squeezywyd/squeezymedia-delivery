/** Derives a small palette from a single client accent color: lighter/darker
 * shades for hover states and gradients, plus a contrast-safe foreground. */

function hexToRgb(hex: string): [number, number, number] {
  const normalized = hex.replace("#", "");
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((c) => c + c)
          .join("")
      : normalized;
  const int = parseInt(full, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return (
    "#" +
    [clamp(r), clamp(g), clamp(b)]
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
  );
}

function mix(hex: string, target: [number, number, number], amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  const [tr, tg, tb] = target;
  return rgbToHex(
    r + (tr - r) * amount,
    g + (tg - g) * amount,
    b + (tb - b) * amount
  );
}

export function lighten(hex: string, amount: number): string {
  return mix(hex, [255, 255, 255], amount);
}

export function darken(hex: string, amount: number): string {
  return mix(hex, [0, 0, 0], amount);
}

/** Relative luminance (WCAG) to decide black vs white text on the accent. */
export function readableForeground(hex: string): "#000000" | "#ffffff" {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.45 ? "#000000" : "#ffffff";
}

export interface AccentPalette {
  accent: string;
  accentLight: string;
  accentDark: string;
  accentSoft: string; // low-opacity wash for backgrounds
  foreground: "#000000" | "#ffffff";
}

export function buildAccentPalette(hex: string): AccentPalette {
  return {
    accent: hex,
    accentLight: lighten(hex, 0.35),
    accentDark: darken(hex, 0.35),
    accentSoft: `${hex}26`, // ~15% opacity
    foreground: readableForeground(hex),
  };
}

/** CSS custom properties driven by the client's accent color. Spread onto a root element style. */
export function accentCssVars(hex: string): Record<string, string> {
  const p = buildAccentPalette(hex);
  return {
    "--accent": p.accent,
    "--accent-light": p.accentLight,
    "--accent-dark": p.accentDark,
    "--accent-soft": p.accentSoft,
    "--accent-foreground": p.foreground,
  };
}

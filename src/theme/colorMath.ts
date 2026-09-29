// Small dependency-free hex/HSL color helpers used to derive a full
// accent palette (bright/deep/muted/contrast-text/gradients) from any
// single base color — a rank color, not just the app's default orange —
// so "reskin the app to this rank's color" works for every rank without
// hand-authoring a palette per rank.

type Rgb = { r: number; g: number; b: number };
type Hsl = { h: number; s: number; l: number };

function hexToRgb(hex: string): Rgb {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const bigint = parseInt(full, 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}

function rgbToHex({ r, g, b }: Rgb): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  return `#${[r, g, b].map((n) => clamp(n).toString(16).padStart(2, '0')).join('')}`;
}

function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  const d = max - min;

  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = (gn - bn) / d + (gn < bn ? 6 : 0);
        break;
      case gn:
        h = (bn - rn) / d + 2;
        break;
      default:
        h = (rn - gn) / d + 4;
    }
    h *= 60;
  }

  return { h, s: s * 100, l: l * 100 };
}

function hslToRgb({ h, s, l }: Hsl): Rgb {
  const hn = h / 360;
  const sn = s / 100;
  const ln = l / 100;

  if (sn === 0) {
    const v = ln * 255;
    return { r: v, g: v, b: v };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };

  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn;
  const p = 2 * ln - q;

  return {
    r: hue2rgb(p, q, hn + 1 / 3) * 255,
    g: hue2rgb(p, q, hn) * 255,
    b: hue2rgb(p, q, hn - 1 / 3) * 255,
  };
}

export function hexToHsl(hex: string): Hsl {
  return rgbToHsl(hexToRgb(hex));
}

export function hslToHex(h: number, s: number, l: number): string {
  return rgbToHex(hslToRgb({ h, s, l }));
}

function hexToRgba(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${alpha})`;
}

export type AccentPalette = {
  base: string;
  bright: string;
  deep: string;
  muted: string;
  onAccent: string;
  gradientFab: readonly [string, string];
  gradientIcon: readonly [string, string];
  glow: string;
};

// Mirrors the shape of theme.ts's original hand-authored orange palette
// (orange/orangeBright/orangeDeep/orangeMuted/textOnOrange + gradients.fab
// = [bright, deep] + gradients.icon = [rgba(bright,.32), rgba(base,.08)])
// but computed from any base hex instead of hardcoded per color.
export function deriveAccentPalette(baseHex: string): AccentPalette {
  const { h, s, l } = hexToHsl(baseHex);
  const bright = hslToHex(h, Math.min(100, s + 5), Math.min(92, l + 14));
  const deep = hslToHex(h, Math.min(100, s + 5), Math.max(8, l - 16));
  const onAccent = l > 55 ? '#191012' : '#F6F3EF';

  return {
    base: baseHex,
    bright,
    deep,
    muted: hexToRgba(baseHex, 0.16),
    onAccent,
    gradientFab: [bright, deep] as const,
    gradientIcon: [hexToRgba(bright, 0.32), hexToRgba(baseHex, 0.08)] as const,
    glow: baseHex,
  };
}

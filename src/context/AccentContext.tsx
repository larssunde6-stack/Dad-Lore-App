import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deriveAccentPalette, hslToHex, AccentPalette } from '../theme/colorMath';
import { colors } from '../theme/theme';
import { Rank } from '../utils/level';

type AccentMode = { type: 'static'; hex: string } | { type: 'rainbow' };

const STORAGE_KEY = 'dadlore.accentMode';
// Not 60fps — a full LinearGradient re-render every tick across every
// accent-colored element app-wide would be wasteful. ~8 ticks/sec is
// plenty smooth for a hue cycle and cheap enough to run continuously.
const RAINBOW_TICK_MS = 120;
const RAINBOW_CYCLE_MS = 6000;

type AccentContextValue = {
  mode: AccentMode;
  palette: AccentPalette;
  setAccent: (rank: Rank) => void;
  resetAccent: () => void;
};

const AccentContext = createContext<AccentContextValue | undefined>(undefined);

export function AccentProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<AccentMode>({ type: 'static', hex: colors.orange });
  const [rainbowHex, setRainbowHex] = useState(colors.orange);
  const hueRef = useRef(0);
  const hydrated = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (!stored) return;
        const parsed = JSON.parse(stored) as AccentMode;
        if (parsed.type === 'rainbow' || (parsed.type === 'static' && typeof parsed.hex === 'string')) {
          setMode(parsed);
        }
      })
      .catch(() => {
        // Malformed/missing storage — keep the default orange accent.
      })
      .finally(() => {
        hydrated.current = true;
      });
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mode)).catch(() => {});
  }, [mode]);

  useEffect(() => {
    if (mode.type !== 'rainbow') return;
    const stepDeg = (360 / RAINBOW_CYCLE_MS) * RAINBOW_TICK_MS;
    const id = setInterval(() => {
      hueRef.current = (hueRef.current + stepDeg) % 360;
      setRainbowHex(hslToHex(hueRef.current, 85, 58));
    }, RAINBOW_TICK_MS);
    return () => clearInterval(id);
  }, [mode.type]);

  const palette = useMemo(
    () => deriveAccentPalette(mode.type === 'rainbow' ? rainbowHex : mode.hex),
    [mode, rainbowHex]
  );

  const setAccent = useCallback((rank: Rank) => {
    setMode(rank.isRainbow ? { type: 'rainbow' } : { type: 'static', hex: rank.color });
  }, []);

  const resetAccent = useCallback(() => {
    setMode({ type: 'static', hex: colors.orange });
  }, []);

  const value = useMemo(
    () => ({ mode, palette, setAccent, resetAccent }),
    [mode, palette, setAccent, resetAccent]
  );

  return <AccentContext.Provider value={value}>{children}</AccentContext.Provider>;
}

export function useAccent() {
  const ctx = useContext(AccentContext);
  if (!ctx) {
    throw new Error('useAccent must be used within an AccentProvider');
  }
  return ctx;
}

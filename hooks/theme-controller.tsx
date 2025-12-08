import { createContext, useContext, useMemo, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'modern';

const ThemeControllerContext = createContext<{
  mode: ThemeMode;
  toggle: () => void;
  setMode: (m: ThemeMode) => void;
} | undefined>(undefined);

export function ThemeControllerProvider({ children }: { children: React.ReactNode }) {
  const system = useRNColorScheme() ?? 'light';
  const [override, setOverride] = useState<ThemeMode | null>(null);
  const mode: ThemeMode = (override ?? system) as ThemeMode;
  const value = useMemo(
    () => ({
      mode,
      toggle: () =>
        setOverride(prev => {
          if (prev === 'light') return 'dark';
          if (prev === 'dark') return 'modern';
          return 'light';
        }),
      setMode: (m: ThemeMode) => setOverride(m),
    }),
    [mode]
  );
  return <ThemeControllerContext.Provider value={value}>{children}</ThemeControllerContext.Provider>;
}

export function useThemeController() {
  const ctx = useContext(ThemeControllerContext);
  if (ctx) return ctx;
  const system = useRNColorScheme() ?? 'light';
  return {
    mode: system as ThemeMode,
    toggle: () => {},
    setMode: () => {},
  };
}

export { ThemeControllerContext };

import { useThemeController } from './theme-controller';

export function useColorScheme() {
  const { mode } = useThemeController();
  return mode;
}

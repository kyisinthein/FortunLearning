/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type ThemeColorProps = { light?: string; dark?: string; modern?: string };
type ColorKey = keyof typeof Colors.light;

export function useThemeColor(
  props: ThemeColorProps,
  colorName: ColorKey
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme as keyof ThemeColorProps];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

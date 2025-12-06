import { useEffect, useState } from 'react';
import { useThemeController } from './theme-controller';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const { mode } = useThemeController();
  useEffect(() => {
    setHasHydrated(true);
  }, []);
  if (hasHydrated) {
    return mode;
  }
  return 'light';
}

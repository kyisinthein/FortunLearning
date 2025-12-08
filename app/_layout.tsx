import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { ThemeControllerProvider, useThemeController } from '@/hooks/theme-controller';

export const unstable_settings = {
  anchor: '(tabs)',
};

function WithTheme({ children }: { children: React.ReactNode }) {
  const { mode } = useThemeController();
  return (
    <ThemeProvider value={mode === 'dark' || mode === 'modern' ? DarkTheme : DefaultTheme}>
      {children}
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeControllerProvider>
      <WithTheme>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="result" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
      </WithTheme>
    </ThemeControllerProvider>
  );
}

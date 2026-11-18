import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, createContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-reanimated';
import { DEFAULT_THEME_COLOR, StorageKeys } from '../constants/Config';

// Create theme context
export const ThemeContext = createContext({
  themeColor: DEFAULT_THEME_COLOR,
  setThemeColor: (color: string) => {},
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [themeColor, setThemeColor] = useState(DEFAULT_THEME_COLOR);
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    // Load saved theme color
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(StorageKeys.theme);
        if (savedTheme) {
          setThemeColor(savedTheme);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    loadTheme();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ themeColor, setThemeColor }}>
      <ThemeProvider value={DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="avatar-selection" />
          <Stack.Screen name="program-weeks" />
          <Stack.Screen name="week/[weekNumber]" />
          <Stack.Screen name="exercise/[exerciseName]" />
          <Stack.Screen name="parent-code" />
          <Stack.Screen name="play" />
          <Stack.Screen name="upload-complete" />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

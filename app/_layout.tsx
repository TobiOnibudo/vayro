import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Unstable settings to set the initial route to the login page
export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: '(auth)/login',
};

export default function RootLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  useEffect(() => {
    // TODO: Implement auth here ?
    const loadUser = async () => {
      const userDataString = await AsyncStorage.getItem('userData');

      // Auto login
      if (userDataString) {
        router.push('/')
      }else
      {
        router.replace("/(auth)/login")
      }
    };
    loadUser();

    SplashScreen.hideAsync();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="listings" options={{headerShown: false}} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

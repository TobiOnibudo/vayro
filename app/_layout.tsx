import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { auth } from '@/config/firebaseConfig';
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
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.replace("/")
      } else {
        router.replace("/(auth)/login")
      }
    })
    SplashScreen.hideAsync();
    return unsubscribe;
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(price-suggestion)" options={{ 
          title: "",
          headerBackTitle: "Sell Page"
        }} 
        />
        <Stack.Screen name="listings" options={{headerShown: false}} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

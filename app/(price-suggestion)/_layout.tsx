import { Stack } from "expo-router";

export default function PriceSuggestionLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="image-upload" options={{ 
        headerShown: false,
        title: "",
        headerBackVisible: false
      }} />
      <Stack.Screen name="gemini-response" options={{ 
        headerShown: false,
        title: "",
        headerBackVisible: false
      }} />
      <Stack.Screen name="request-price-form" options={{ 
        headerShown: false,
        title: "",
        headerBackVisible: false
      }} />
    </Stack>
  );
}
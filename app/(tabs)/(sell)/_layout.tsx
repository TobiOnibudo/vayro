import { Stack } from "expo-router";

export default function PriceSuggestionLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sell-wrapper" options={{
        headerShown: false,
        title: "",
        headerBackVisible: false
      }} />
      <Stack.Screen name="(price-assistant)/price-assistant" options={{
        headerShown: true,
        title: "Price Assistant",
        headerBackVisible: true
      }} />
    </Stack>
  );
}
import { Stack } from 'expo-router';

export default function ListingsLayout() {
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="[id]"  />
    </Stack>
  );
} 
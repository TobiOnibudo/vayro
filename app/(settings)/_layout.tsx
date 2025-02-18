import React from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import tw from "twrnc";

export default function SettingsLayout() {
  return (
    <View style={tw`flex-1`}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="profile" />
        <Stack.Screen name="update-password" />
      </Stack>
    </View>
  );
}
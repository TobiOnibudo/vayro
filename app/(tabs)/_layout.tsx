import { Tabs } from 'expo-router';
import React from 'react';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          backgroundColor: 'ACA592',
          position: 'absolute',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          href: null, // This hides the tab
        }}
      />
      <Tabs.Screen
        name="buy"
        options={{
          title: 'Buy',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="cart.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="(sell)/sell-layout"
        options={{
          title: 'Sell',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="dollarsign.circle.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="filter"
        options={{
          title: 'Filter',
          href: null, 
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="sellHistory"
        options={{
          title: 'SellHistory',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="scroll" color={color} />,
        }}
      />
    </Tabs>
  );
}

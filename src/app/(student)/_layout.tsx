import React from 'react';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';
import { Dumbbell, Utensils, User } from '@tamagui/lucide-icons-2';

export default function StudentLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const themeColors = Colors[theme];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: themeColors.primary,
        tabBarInactiveTintColor: themeColors.textSecondary,
        tabBarStyle: {
          backgroundColor: themeColors.background,
          borderTopColor: themeColors.backgroundSelected,
          borderTopWidth: 1,
          elevation: 8,
          shadowOpacity: 0.1,
          shadowRadius: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Treino',
          tabBarIcon: ({ color, size }) => <Dumbbell size={size} color={color as any} />,
          tabBarAccessibilityLabel: 'Aba de Treinos',
        }}
      />
      <Tabs.Screen
        name="nutrition"
        options={{
          title: 'Diário',
          tabBarIcon: ({ color, size }) => <Utensils size={size} color={color as any} />,
          tabBarAccessibilityLabel: 'Aba de Diário de Refeições',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <User size={size} color={color as any} />,
          tabBarAccessibilityLabel: 'Aba de Perfil',
        }}
      />
    </Tabs>
  );
}


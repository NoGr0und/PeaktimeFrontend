import React, { useEffect, useState } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { TabBar } from '../../components/layout/TabBar';
import { Theme } from '../../constants/theme';

export default function StudentLayout() {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Início',
          tabBarIcon: 'house.fill' as any,
        }}
      />
      <Tabs.Screen
        name="nutrition"
        options={{
          title: 'Nutrição',
          tabBarIcon: 'leaf.fill' as any,
        }}
      />
      <Tabs.Screen
        name="student-profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="student-occupancy"
        options={{
          title: 'Ocupação',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'bar-chart' : 'bar-chart-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

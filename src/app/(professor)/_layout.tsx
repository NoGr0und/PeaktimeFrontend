import React from 'react';
import { Tabs } from 'expo-router';
import { TabBar } from '../../components/layout/TabBar';

export default function ProfessorLayout() {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="students"
        options={{
          title: 'Alunos',
          tabBarIcon: 'person.2.fill' as any,
        }}
      />
      <Tabs.Screen
        name="invite"
        options={{
          title: 'Convites',
          tabBarIcon: 'link' as any,
        }}
      />
      <Tabs.Screen
        name="plan-builder"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="occupancy"
        options={{
          title: 'Ocupação',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'bar-chart' : 'bar-chart-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

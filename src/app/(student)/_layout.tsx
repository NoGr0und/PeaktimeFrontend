import React, { useEffect, useState } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { TabBar } from '../../components/layout/TabBar';
import { enrollmentService } from '../../services/enrollmentService';
import { View, ActivityIndicator } from 'react-native';
import { Theme } from '../../constants/theme';

export default function StudentLayout() {
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkEnrollment() {
      const prof = await enrollmentService.getProfessor();
      if (!prof) {
        router.replace('/(student)/join');
      }
      setIsChecking(false);
    }
    
    checkEnrollment();
  }, []);

  if (isChecking) {
    return (
      <View style={{ flex: 1, backgroundColor: Theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={Theme.colors.primary} />
      </View>
    );
  }

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
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
          ),
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
    </Tabs>
  );
}

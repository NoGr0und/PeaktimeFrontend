import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider, useAuth } from '../services/AuthContext';
import { Theme } from '../constants/theme';
import { View, ActivityIndicator } from 'react-native';
import { notificationService } from '../services/notificationService';
import { 
  useFonts,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_700Bold,
  Outfit_900Black
} from '@expo-google-fonts/outfit';

SplashScreen.preventAutoHideAsync();

const RootLayoutNav = () => {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      // Register for push notifications when user is logged in
      notificationService.registerForPushNotificationsAsync();
    }
  }, [user]);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      if (user.role === 'ALUNO') {
        router.replace('/(student)/dashboard');
      } else if (user.role === 'PROFESSOR') {
        router.replace('/(professor)/students');
      }
    }
  }, [user, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: Theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Theme.colors.background } }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(student)" options={{ headerShown: false }} />
      <Stack.Screen name="(professor)" options={{ headerShown: false }} />
      <Stack.Screen name="create-workout" options={{ presentation: 'modal', headerShown: false }} />
      <Stack.Screen name="workout-history" options={{ presentation: 'modal', headerShown: false }} />
    </Stack>
  );
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_700Bold,
    Outfit_900Black,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return <View style={{ flex: 1, backgroundColor: Theme.colors.background }} />;
  }

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

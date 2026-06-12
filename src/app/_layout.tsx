import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider, useAuth } from '../services/AuthContext';
import { Theme } from '../constants/theme';
import { View, ActivityIndicator, LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { notificationService } from '../services/notificationService';
import { 
  useFonts,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_700Bold,
  Outfit_900Black
} from '@expo-google-fonts/outfit';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

LogBox.ignoreLogs([
  'Invalid DOM property `transform-origin`',
  'Did you mean `transformOrigin`?'
]);

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
      <Stack.Screen name="student-workouts" options={{ presentation: 'modal', headerShown: false }} />
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <PersistQueryClientProvider 
          client={queryClient}
          persistOptions={{ persister: asyncStoragePersister }}
        >
          <RootLayoutNav />
        </PersistQueryClientProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

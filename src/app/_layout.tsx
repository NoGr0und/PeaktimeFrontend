import React, { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider, Slot, useRouter, useSegments } from 'expo-router';
import { useColorScheme, View, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { TamaguiProvider } from 'tamagui';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import config from '@/tamagui.config';
import { Colors, MaxContentWidth } from '@/constants/theme';
import { AuthProvider, useAuth } from '@/hooks/use-auth';
import { useSettings } from '@/hooks/use-settings';
import { AnimatedSplashOverlay } from '@/components/animated-icon';

// Configure notification handling when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return null;
  }

  if (!Device.isDevice) {
    console.warn('Deve ser usado um dispositivo físico para Notificações Push');
    return null;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Permissão de notificações push não concedida!');
      return null;
    }

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    if (!projectId) {
      console.warn('Project ID não configurado no app.json. Ignorando registro de Push Token.');
      return null;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId,
    });
    return tokenData.data;
  } catch (error) {
    console.error('Erro ao obter token de push:', error);
    return null;
  }
}

function RootNavigation() {
  const { user, isLoading } = useAuth();
  const { registerPushToken } = useSettings();
  const segments = useSegments() as string[];
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user) {
      // Redirect to login if not in auth group
      if (!inAuthGroup) {
        router.replace('/(auth)/login' as any);
      }
    } else {
      // User is authenticated
      const role = user.role;
      if (role === 'ALUNO') {
        if (segments[0] !== '(student)') {
          router.replace('/(student)' as any);
        }
      } else if (role === 'PROFESSOR') {
        if (segments[0] !== '(professor)') {
          router.replace('/(professor)' as any);
        }
      }
    }
  }, [user, isLoading, segments, router]);

  useEffect(() => {
    if (user) {
      registerForPushNotificationsAsync().then((token) => {
        if (token) {
          registerPushToken(token).catch((err) => {
            console.error('Erro ao salvar o push token no backend:', err);
          });
        }
      });
    }
  }, [user, registerPushToken]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const themeColors = Colors[theme];

  const content = (
    <>
      <AnimatedSplashOverlay />
      <RootNavigation />
    </>
  );

  return (
    <TamaguiProvider config={config} defaultTheme={theme}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          {Platform.OS === 'web' ? (
            <View style={[styles.webContainer, { backgroundColor: themeColors.backgroundElement }]}>
              <View
                style={[
                  styles.webContent,
                  {
                    backgroundColor: themeColors.background,
                    borderColor: themeColors.backgroundSelected,
                  },
                ]}
              >
                {content}
              </View>
            </View>
          ) : (
            content
          )}
        </AuthProvider>
      </ThemeProvider>
    </TamaguiProvider>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webContent: {
    width: '100%',
    maxWidth: MaxContentWidth,
    height: '100%',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

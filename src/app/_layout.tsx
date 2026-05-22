import React, { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider, Slot, useRouter, useSegments } from 'expo-router';
import { useColorScheme, View, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { TamaguiProvider } from 'tamagui';
import config from '@/tamagui.config';
import { Colors, MaxContentWidth } from '@/constants/theme';
import { AuthProvider, useAuth } from '@/hooks/use-auth';
import { AnimatedSplashOverlay } from '@/components/animated-icon';

function RootNavigation() {
  const { user, isLoading } = useAuth();
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

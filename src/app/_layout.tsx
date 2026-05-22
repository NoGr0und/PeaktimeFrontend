import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { useColorScheme, View, StyleSheet, Platform } from 'react-native';
import { TamaguiProvider } from 'tamagui';
import config from '@/tamagui.config';
import { Colors, MaxContentWidth } from '@/constants/theme';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const themeColors = Colors[theme];

  const content = (
    <>
      <AnimatedSplashOverlay />
      <AppTabs />
    </>
  );

  return (
    <TamaguiProvider config={config} defaultTheme={theme}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        {Platform.OS === 'web' ? (
          <View style={[styles.webContainer, { backgroundColor: themeColors.backgroundElement }]}>
            <View
              style={[
                styles.webContent,
                {
                  backgroundColor: themeColors.background,
                  borderColor: themeColors.backgroundSelected,
                },
              ]}>
              {content}
            </View>
          </View>
        ) : (
          content
        )}
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
});


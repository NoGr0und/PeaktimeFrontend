import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Theme } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';

export const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  return (
    <View style={styles.container}>
      <BlurView intensity={80} tint="dark" style={styles.blurView}>
        <LinearGradient
          colors={['rgba(26,26,26,0.6)', 'rgba(42,42,42,0.6)']}
          style={styles.gradient}
        >
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            // Using Ionicons mapping
            const getIconName = () => {
              switch(route.name) {
                case 'dashboard': return isFocused ? 'home' : 'home-outline';
                case 'nutrition': return isFocused ? 'restaurant' : 'restaurant-outline';
                case 'profile':
                case 'student-profile':
                case 'prof-profile': return isFocused ? 'person' : 'person-outline';
                case 'students': return isFocused ? 'people' : 'people-outline';
                case 'invite': return isFocused ? 'link' : 'link-outline';
                case 'occupancy':
                case 'student-occupancy':
                case 'prof-occupancy': return isFocused ? 'bar-chart' : 'bar-chart-outline';
                default: return isFocused ? 'ellipse' : 'ellipse-outline';
              }
            };

            const iconName = getIconName();

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                style={styles.tabItem}
              >
                <MotiView
                  animate={{
                    translateY: isFocused ? -8 : 0,
                    scale: isFocused ? 1.1 : 1,
                  }}
                  transition={{
                    type: 'spring',
                    damping: 12,
                    stiffness: 200,
                  }}
                  style={{ alignItems: 'center' }}
                >
                  <Ionicons
                    name={iconName as any}
                    size={24}
                    color={isFocused ? Theme.colors.primary : Theme.colors.textSecondary}
                  />
                  {isFocused && (
                    <MotiView
                      from={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'spring' }}
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: Theme.colors.primary,
                        marginTop: 4,
                        shadowColor: Theme.colors.primary,
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.8,
                        shadowRadius: 4,
                      }}
                    />
                  )}
                </MotiView>
              </TouchableOpacity>
            );
          })}
        </LinearGradient>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Theme.spacing.lg,
    left: Theme.spacing.xl,
    right: Theme.spacing.xl,
    borderRadius: Theme.borderRadius.xl,
    overflow: 'hidden',
    height: 64,
  },
  blurView: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.sm,
  },
});

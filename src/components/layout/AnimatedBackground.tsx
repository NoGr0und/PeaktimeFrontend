import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import Svg, { Path } from 'react-native-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Theme } from '../../constants/theme';

interface AnimatedBackgroundProps {
  iconName?: keyof typeof MaterialCommunityIcons.glyphMap;
  variant?: 'ecg' | 'trending-up' | 'profile-pulse';
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ iconName, variant = 'ecg' }) => {
  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 0, overflow: 'hidden' }]} pointerEvents="none">
      
      {/* ECG Variant */}
      {variant === 'ecg' && (
        <>
          <MotiView
            from={{ translateX: 0 }}
            animate={{ translateX: -1000 }}
            transition={{ loop: true, type: 'timing', duration: 15000, ease: 'linear' }}
            style={{ position: 'absolute', top: 120, width: 2000, flexDirection: 'row', opacity: 0.15 }}
          >
            <Svg width="1000" height="200" viewBox="0 0 1000 200">
              <Path 
                d="M0,100 L300,100 L330,60 L370,170 L420,30 L460,100 L1000,100" 
                stroke={Theme.colors.primary} 
                strokeWidth="4" 
                fill="none" 
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Svg width="1000" height="200" viewBox="0 0 1000 200">
              <Path 
                d="M0,100 L300,100 L330,60 L370,170 L420,30 L460,100 L1000,100" 
                stroke={Theme.colors.primary} 
                strokeWidth="4" 
                fill="none" 
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </MotiView>
          <MotiView
            from={{ translateX: -1000 }}
            animate={{ translateX: 0 }}
            transition={{ loop: true, type: 'timing', duration: 22000, ease: 'linear' }}
            style={{ position: 'absolute', top: 400, width: 2000, flexDirection: 'row', opacity: 0.05 }}
          >
            <Svg width="1000" height="200" viewBox="0 0 1000 200">
              <Path 
                d="M0,100 L500,100 L530,70 L570,140 L610,60 L640,100 L1000,100" 
                stroke={Theme.colors.accent} 
                strokeWidth="2" 
                fill="none" 
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Svg width="1000" height="200" viewBox="0 0 1000 200">
              <Path 
                d="M0,100 L500,100 L530,70 L570,140 L610,60 L640,100 L1000,100" 
                stroke={Theme.colors.accent} 
                strokeWidth="2" 
                fill="none" 
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </MotiView>
        </>
      )}

      {/* Trending Up (Chart) Variant */}
      {variant === 'trending-up' && (
        <View style={StyleSheet.absoluteFill}>
          {[...Array(6)].map((_, i) => (
            <MotiView
              key={`bar-${i}`}
              from={{ height: 40, opacity: 0.02 }}
              animate={{ height: 100 + (i * 30), opacity: 0.1 }}
              transition={{ loop: true, type: 'timing', duration: 3000 + (i * 500), direction: 'alternate' }}
              style={{
                position: 'absolute',
                bottom: 0,
                left: i * 80 + 20,
                width: 40,
                backgroundColor: Theme.colors.primary,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}
            />
          ))}
          <MotiView
            from={{ opacity: 0.05, transform: [{ translateY: 10 }] }}
            animate={{ opacity: 0.15, transform: [{ translateY: -10 }] }}
            transition={{ loop: true, type: 'timing', duration: 4000, direction: 'alternate' }}
            style={{ position: 'absolute', bottom: 120, right: -50 }}
          >
            <MaterialCommunityIcons name="trending-up" size={400} color={Theme.colors.accent} />
          </MotiView>
        </View>
      )}

      {/* Profile Pulse Variant */}
      {variant === 'profile-pulse' && (
        <View style={{ position: 'absolute', top: 100, right: -100, alignItems: 'center', justifyContent: 'center' }}>
          <MotiView
            from={{ scale: 0.5, opacity: 0.1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ loop: true, type: 'timing', duration: 4000 }}
            style={{ position: 'absolute', width: 400, height: 400, borderRadius: 200, borderWidth: 4, borderColor: Theme.colors.primary }}
          />
          <MotiView
            from={{ scale: 0.5, opacity: 0.1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ loop: true, type: 'timing', duration: 4000, delay: 1000 }}
            style={{ position: 'absolute', width: 400, height: 400, borderRadius: 200, borderWidth: 4, borderColor: Theme.colors.accent }}
          />
        </View>
      )}

      {/* Parallax Thematic Watermark (For all variants if iconName provided) */}
      {iconName && (
        <MotiView
          from={{ transform: [{ translateY: 0 }, { scale: 1 }] }}
          animate={{ transform: [{ translateY: -30 }, { scale: 1.05 }] }}
          transition={{ loop: true, type: 'timing', duration: 8000, direction: 'alternate' }}
          style={{ position: 'absolute', bottom: -50, right: -120, opacity: 0.04 }}
        >
          <MaterialCommunityIcons name={iconName} size={500} color={Theme.colors.text} />
        </MotiView>
      )}
    </View>
  );
};

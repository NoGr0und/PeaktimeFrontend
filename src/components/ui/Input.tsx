import React, { useState } from 'react';
import { Input as TInput, XStack, YStack, Text } from 'tamagui';
import { Pressable, StyleSheet } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { useTheme } from '@/hooks/use-theme';

export interface InputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  isPassword?: boolean;
  secureTextEntry?: boolean;
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  accessibilityLabel?: string;
  maxLength?: number;
  autoCorrect?: boolean;
}

export const Input = React.forwardRef<any, InputProps>(
  ({ label, error, leftIcon, isPassword, secureTextEntry, ...props }, ref) => {
    const theme = useTheme();
    const [isSecure, setIsSecure] = useState(secureTextEntry ?? isPassword);

    const toggleSecure = () => {
      setIsSecure(!isSecure);
    };

    return (
      <YStack width="100%" gap="$one">
        {label && (
          <Text fontSize={14} fontWeight="600" color="$textSecondary" marginLeft={4}>
            {label}
          </Text>
        )}
        <XStack position="relative" alignItems="center" width="100%">
          {leftIcon && (
            <XStack position="absolute" left={12} zIndex={10}>
              {leftIcon}
            </XStack>
          )}
          <TInput
            ref={ref}
            borderWidth={1}
            borderRadius="$radius.one"
            borderColor={error ? '#ff4d4f' : '$backgroundSelected'}
            backgroundColor="$background"
            color="$color"
            fontSize={16}
            height={48}
            paddingHorizontal={16}
            paddingLeft={leftIcon ? 40 : 16}
            paddingRight={isPassword || secureTextEntry ? 44 : 16}
            flex={1}
            focusStyle={{
              borderColor: '$primary',
              borderWidth: 1.5,
            }}
            secureTextEntry={isSecure}
            accessibilityRole="text"
            placeholderTextColor={theme.textSecondary as any}
            {...(props as any)}
          />
          {(isPassword || secureTextEntry) && (
            <Pressable
              onPress={toggleSecure}
              style={styles.eyeButton}
              accessibilityRole="button"
              accessibilityLabel={isSecure ? 'Mostrar senha' : 'Ocultar senha'}
            >
              <SymbolView
                name={{
                  ios: isSecure ? 'eye' : 'eye.slash',
                  android: isSecure ? 'visibility' : 'visibility_off',
                  web: isSecure ? 'visibility' : 'visibility_off',
                }}
                size={20}
                tintColor={theme.textSecondary}
              />
            </Pressable>
          )}
        </XStack>
        {error && (
          <Text fontSize={12} color="#ff4d4f" marginLeft={4} marginTop={2}>
            {error}
          </Text>
        )}
      </YStack>
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  eyeButton: {
    position: 'absolute',
    right: 12,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    zIndex: 10,
  },
});

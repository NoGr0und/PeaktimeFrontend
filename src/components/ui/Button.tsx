import React from 'react';
import { Button as TButton, Spinner, Text, styled, ButtonProps as TButtonProps } from 'tamagui';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends Omit<TButtonProps, 'size' | 'variant'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  textStyle?: any;
}

const StyledButton = styled(TButton, {
  name: 'CustomButton',
  role: 'button',
  pressStyle: {
    opacity: 0.8,
    scale: 0.98,
  },
  borderRadius: '$radius.one',
  borderWidth: 1,
  borderColor: 'transparent',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
  gap: '$two',

  variants: {
    variant: {
      primary: {
        backgroundColor: '$primary',
        borderColor: '$primary',
        hoverStyle: {
          backgroundColor: '$accent',
          borderColor: '$accent',
        },
      },
      secondary: {
        backgroundColor: '$primaryLight',
        borderColor: 'transparent',
        hoverStyle: {
          backgroundColor: '$backgroundSelected',
        },
      },
      outline: {
        backgroundColor: 'transparent',
        borderColor: '$primary',
        hoverStyle: {
          backgroundColor: '$primaryLight',
        },
      },
      ghost: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        hoverStyle: {
          backgroundColor: '$backgroundSelected',
        },
      },
    },
    size: {
      small: {
        height: 36,
        paddingHorizontal: '$three',
      },
      medium: {
        height: 48,
        paddingHorizontal: '$four',
      },
      large: {
        height: 56,
        paddingHorizontal: '$five',
      },
    },
  } as const,

  defaultVariants: {
    variant: 'primary',
    size: 'medium',
  },
});

export const Button = React.forwardRef<any, ButtonProps>(
  ({ children, variant = 'primary', size = 'medium', isLoading, disabled, textStyle, ...props }, ref) => {
    // Determine text colors based on variant
    const getTextColor = () => {
      if (disabled) return '$textSecondary';
      if (variant === 'primary') return '#ffffff';
      if (variant === 'outline' || variant === 'ghost') return '$primary';
      return '$color'; // default themed text color
    };

    return (
      <StyledButton
        ref={ref}
        variant={variant}
        size={size}
        disabled={disabled || isLoading}
        opacity={disabled || isLoading ? 0.6 : 1}
        accessibilityRole="button"
        accessibilityState={{ disabled: !!(disabled || isLoading), busy: !!isLoading }}
        {...props}
      >
        {isLoading ? (
          <Spinner color={variant === 'primary' ? '#ffffff' : '$primary'} />
        ) : typeof children === 'string' ? (
          <Text
            color={getTextColor()}
            fontWeight="600"
            fontSize={size === 'small' ? 14 : size === 'large' ? 18 : 16}
            style={textStyle}
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </StyledButton>
    );
  }
);

Button.displayName = 'Button';

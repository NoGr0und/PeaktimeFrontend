import { YStack, styled } from 'tamagui';

export const Card = styled(YStack, {
  name: 'CustomCard',
  backgroundColor: '$background',
  borderRadius: '$radius.three',
  padding: '$four',
  borderWidth: 1,
  borderColor: '$backgroundSelected',
  
  // Subtle premium drop-shadow for iOS/Android/Web
  shadowColor: '#0f172a',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.03,
  shadowRadius: 16,
  elevation: 2,

  variants: {
    variant: {
      flat: {
        borderWidth: 1,
        borderColor: '$backgroundSelected',
        shadowOpacity: 0,
        elevation: 0,
      },
      elevated: {
        borderWidth: 0,
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 4,
      },
      outlined: {
        borderWidth: 1.5,
        borderColor: '$primary',
        shadowOpacity: 0,
        elevation: 0,
      },
    },
  } as const,

  defaultVariants: {
    variant: 'elevated',
  },
});

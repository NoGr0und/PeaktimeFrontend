import React from 'react';
import { YStack, XStack, Text, Button as TButton } from 'tamagui';
import { Mail, ChevronRight } from '@tamagui/lucide-icons-2';
import { Card } from './ui/Card';
import { Enrollment } from '@/types/enrollment';

interface StudentListItemProps {
  enrollment: Enrollment;
  onPressAction?: () => void;
}

export function StudentListItem({ enrollment, onPressAction }: StudentListItemProps) {
  const student = enrollment.student;
  if (!student) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const formattedDate = new Date(enrollment.createdAt).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Card variant="flat" padding="$three" marginVertical="$one" width="100%">
      <XStack gap="$three" alignItems="center" justifyContent="space-between">
        <XStack gap="$three" alignItems="center" flex={1}>
          {/* Avatar circle */}
          <XStack
            width={48}
            height={48}
            borderRadius={24}
            backgroundColor="$primaryLight"
            justifyContent="center"
            alignItems="center"
          >
            <Text color="$primary" fontWeight="bold" fontSize={16}>
              {getInitials(student.name)}
            </Text>
          </XStack>

          {/* Student Info */}
          <YStack flex={1} gap="$half">
            <Text fontSize={16} fontWeight="bold" color="$color">
              {student.name}
            </Text>
            <XStack alignItems="center" gap="$one">
              <Mail size={12} color="$textSecondary" />
              <Text fontSize={13} color="$textSecondary" numberOfLines={1}>
                {student.email}
              </Text>
            </XStack>
            <Text fontSize={11} color="$textSecondary">
              Vinculado em: {formattedDate}
            </Text>
          </YStack>
        </XStack>

        {/* Action Button */}
        {onPressAction && (
          <TButton
            size="$small"
            circular
            backgroundColor="$backgroundSelected"
            pressStyle={{ opacity: 0.7 }}
            onPress={onPressAction}
            accessibilityLabel={`Gerenciar treinos de ${student.name}`}
            icon={<ChevronRight size={18} color="#0052cc" />}
          />
        )}
      </XStack>
    </Card>
  );
}

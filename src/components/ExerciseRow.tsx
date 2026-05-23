import React from 'react';
import { YStack, XStack, Text } from 'tamagui';
import { Dumbbell, Clock } from '@tamagui/lucide-icons-2';
import { Exercise } from '@/types/workout';
import { Card } from './ui/Card';

interface ExerciseRowProps {
  exercise: Exercise;
}

export function ExerciseRow({ exercise }: ExerciseRowProps) {
  return (
    <Card 
      variant="elevated" 
      padding="$four" 
      marginVertical="$two" 
      width="100%"
      backgroundColor="$background"
      accessibilityLabel={`Exercício ${exercise.order + 1}: ${exercise.name}, ${exercise.sets} séries de ${exercise.reps} repetições${exercise.loadKg ? `, carga de ${exercise.loadKg} quilos` : ''}`}
      accessibilityRole="text"
    >
      <XStack gap="$three" alignItems="center" justifyContent="space-between">
        {/* Left Side: Order & Name */}
        <XStack gap="$three" alignItems="center" flex={1}>
          {/* Order Badge */}
          <XStack
            width={36}
            height={36}
            borderRadius={18}
            backgroundColor="$primaryLight"
            borderWidth={1}
            borderColor="$backgroundSelected"
            justifyContent="center"
            alignItems="center"
          >
            <Text color="$primary" fontWeight="800" fontSize={14}>
              {exercise.order + 1}
            </Text>
          </XStack>

          {/* Exercise Info */}
          <YStack flex={1} gap="$half">
            <Text fontSize={15} fontWeight="800" color="$color">
              {exercise.name}
            </Text>
            {exercise.notes ? (
              <Text fontSize={12} color="$textSecondary" fontStyle="italic" lineHeight={16}>
                {exercise.notes}
              </Text>
            ) : null}
          </YStack>
        </XStack>

        {/* Right Side: Sets, Reps, Load & Rest */}
        <YStack alignItems="flex-end" gap="$two">
          <XStack backgroundColor="$primaryLight" paddingHorizontal="$two" paddingVertical="$half" borderRadius="$radius.one">
            <Text fontSize={13} fontWeight="800" color="$primary">
              {exercise.sets} x {exercise.reps}
            </Text>
          </XStack>
          
          <XStack gap="$two" alignItems="center">
            {exercise.loadKg !== undefined && exercise.loadKg !== null ? (
              <XStack alignItems="center" gap="$one" backgroundColor="$backgroundElement" paddingHorizontal="$two" paddingVertical="$half" borderRadius="$radius.half">
                <Dumbbell size={11} color="$textSecondary" />
                <Text fontSize={11} color="$textSecondary" fontWeight="600">
                  {exercise.loadKg} kg
                </Text>
              </XStack>
            ) : null}

            {exercise.restSeconds !== undefined && exercise.restSeconds !== null ? (
              <XStack alignItems="center" gap="$one" backgroundColor="$backgroundElement" paddingHorizontal="$two" paddingVertical="$half" borderRadius="$radius.half">
                <Clock size={11} color="$textSecondary" />
                <Text fontSize={11} color="$textSecondary" fontWeight="600">
                  {exercise.restSeconds}s
                </Text>
              </XStack>
            ) : null}
          </XStack>
        </YStack>
      </XStack>
    </Card>
  );
}

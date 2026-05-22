import React from 'react';
import { YStack, XStack, Text } from 'tamagui';
import { Dumbbell, Clock } from '@tamagui/lucide-icons';
import { Exercise } from '@/types/workout';
import { Card } from './ui/Card';

interface ExerciseRowProps {
  exercise: Exercise;
}

export function ExerciseRow({ exercise }: ExerciseRowProps) {
  return (
    <Card 
      variant="flat" 
      padding="$three" 
      marginVertical="$one" 
      width="100%"
      accessibilityLabel={`Exercício ${exercise.order + 1}: ${exercise.name}, ${exercise.sets} séries de ${exercise.reps} repetições${exercise.loadKg ? `, carga de ${exercise.loadKg} quilos` : ''}`}
      accessibilityRole="text"
    >
      <XStack gap="$three" alignItems="center" justifyContent="space-between">
        {/* Left Side: Order & Name */}
        <XStack gap="$three" alignItems="center" flex={1}>
          {/* Order Badge */}
          <XStack
            width={32}
            height={32}
            borderRadius={16}
            backgroundColor="$primaryLight"
            justifyContent="center"
            alignItems="center"
          >
            <Text color="$primary" fontWeight="bold" fontSize={14}>
              {exercise.order + 1}
            </Text>
          </XStack>

          {/* Exercise Info */}
          <YStack flex={1} gap="$one">
            <Text fontSize={16} fontWeight="bold" color="$color">
              {exercise.name}
            </Text>
            {exercise.notes ? (
              <Text fontSize={12} color="$textSecondary" fontStyle="italic">
                {exercise.notes}
              </Text>
            ) : null}
          </YStack>
        </XStack>

        {/* Right Side: Sets, Reps, Load & Rest */}
        <YStack alignItems="flex-end" gap="$one">
          <Text fontSize={14} fontWeight="bold" color="$primary">
            {exercise.sets} x {exercise.reps}
          </Text>
          
          <XStack gap="$two" alignItems="center">
            {exercise.loadKg !== undefined && exercise.loadKg !== null ? (
              <XStack alignItems="center" gap="$one">
                <Dumbbell size={12} color="$textSecondary" />
                <Text fontSize={12} color="$textSecondary">
                  {exercise.loadKg} kg
                </Text>
              </XStack>
            ) : null}

            {exercise.restSeconds !== undefined && exercise.restSeconds !== null ? (
              <XStack alignItems="center" gap="$one">
                <Clock size={12} color="$textSecondary" />
                <Text fontSize={12} color="$textSecondary">
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

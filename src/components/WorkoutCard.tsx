import React from 'react';
import { YStack, Text, XStack } from 'tamagui';
import { Dumbbell } from '@tamagui/lucide-icons';
import { DayPlan } from '@/types/workout';
import { ExerciseRow } from './ExerciseRow';
import { Card } from './ui/Card';

interface WorkoutCardProps {
  dayPlan: DayPlan;
}

const DAY_OF_WEEK_LABELS: Record<string, string> = {
  MONDAY: 'Segunda-feira',
  TUESDAY: 'Terça-feira',
  WEDNESDAY: 'Quarta-feira',
  THURSDAY: 'Quinta-feira',
  FRIDAY: 'Sexta-feira',
  SATURDAY: 'Sábado',
  SUNDAY: 'Domingo',
};

export function WorkoutCard({ dayPlan }: WorkoutCardProps) {
  const sortedExercises = [...dayPlan.exercises].sort((a, b) => a.order - b.order);
  const dayLabel = DAY_OF_WEEK_LABELS[dayPlan.dayOfWeek] || dayPlan.dayOfWeek;

  return (
    <YStack gap="$three" width="100%">
      {/* Header Info */}
      <Card 
        variant="flat" 
        backgroundColor="$primary" 
        padding="$four" 
        width="100%"
        accessibilityLabel={`Treino de hoje, ${dayLabel}: ${dayPlan.name}`}
        accessibilityRole="summary"
      >
        <XStack gap="$three" alignItems="center">
          <XStack
            width={40}
            height={40}
            borderRadius={20}
            backgroundColor="rgba(255, 255, 255, 0.2)"
            justifyContent="center"
            alignItems="center"
          >
            <Dumbbell size={20} color="#ffffff" />
          </XStack>
          <YStack flex={1}>
            <Text color="#ffffff" fontSize={14} fontWeight="bold" opacity={0.8} textTransform="uppercase">
              {dayLabel}
            </Text>
            <Text color="#ffffff" fontSize={20} fontWeight="bold">
              {dayPlan.name}
            </Text>
          </YStack>
        </XStack>
      </Card>

      {/* Exercises List */}
      <YStack gap="$two" width="100%">
        {sortedExercises.map((exercise) => (
          <ExerciseRow key={exercise.id} exercise={exercise} />
        ))}
      </YStack>
    </YStack>
  );
}

import React from 'react';
import { YStack, Text, XStack } from 'tamagui';
import { Dumbbell } from '@tamagui/lucide-icons-2';
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
        variant="elevated" 
        backgroundColor="$background" 
        padding="$four" 
        width="100%"
        borderLeftWidth={4}
        borderLeftColor="$primary"
        accessibilityLabel={`Treino de hoje, ${dayLabel}: ${dayPlan.name}`}
        accessibilityRole="summary"
      >
        <XStack gap="$three" alignItems="center">
          <XStack
            width={44}
            height={44}
            borderRadius={22}
            backgroundColor="$primaryLight"
            justifyContent="center"
            alignItems="center"
          >
            <Dumbbell size={22} color="#0252e3" />
          </XStack>
          <YStack flex={1}>
            <Text color="$primary" fontSize={12} fontWeight="bold" textTransform="uppercase" letterSpacing={0.5}>
              {dayLabel} • FOCO DE HOJE
            </Text>
            <Text color="$color" fontSize={18} fontWeight="800" marginTop="$half">
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

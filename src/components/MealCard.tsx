import React from 'react';
import { YStack, XStack, Text, Button } from 'tamagui';
import { Coffee, Utensils, Apple, Trash2 } from '@tamagui/lucide-icons-2';
import { Card } from './ui/Card';
import { Meal, MealType } from '@/types/nutrition';

interface MealCardProps {
  meal: Meal;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

const MEAL_META: Record<MealType, { label: string; icon: React.ReactNode }> = {
  BREAKFAST: {
    label: 'Café da Manhã',
    icon: <Coffee size={20} color="#0052cc" />,
  },
  LUNCH: {
    label: 'Almoço',
    icon: <Utensils size={20} color="#0052cc" />,
  },
  SNACK: {
    label: 'Lanche',
    icon: <Apple size={20} color="#0052cc" />,
  },
  DINNER: {
    label: 'Jantar',
    icon: <Utensils size={20} color="#0052cc" />,
  },
};

export function MealCard({ meal, onDelete, isDeleting }: MealCardProps) {
  const meta = MEAL_META[meal.type] || { label: 'Refeição', icon: <Utensils size={20} color="#0052cc" /> };

  // Calculate totals
  const totalCalories = meal.items.reduce((sum, item) => sum + (item.calories || 0), 0);
  const totalProtein = meal.items.reduce((sum, item) => sum + (item.protein || 0), 0);
  const totalCarbs = meal.items.reduce((sum, item) => sum + (item.carbs || 0), 0);
  const totalFat = meal.items.reduce((sum, item) => sum + (item.fat || 0), 0);

  return (
    <Card variant="flat" padding="$four" backgroundColor="$background" marginBottom="$four" width="100%">
      {/* Header */}
      <XStack justifyContent="space-between" alignItems="center" borderBottomWidth={1} borderColor="$backgroundSelected" paddingBottom="$two" marginBottom="$two">
        <XStack gap="$two" alignItems="center">
          <XStack
            width={36}
            height={36}
            borderRadius={18}
            backgroundColor="$primaryLight"
            justifyContent="center"
            alignItems="center"
          >
            {meta.icon}
          </XStack>
          <YStack>
            <Text fontSize={16} fontWeight="bold" color="$color">
              {meta.label}
            </Text>
            <Text fontSize={11} color="$textSecondary">
              {new Date(meal.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </YStack>
        </XStack>

        <Button
          backgroundColor="transparent"
          borderColor="transparent"
          size="$small"
          circular
          disabled={isDeleting}
          onPress={() => onDelete(meal.id)}
          icon={<Trash2 size={16} color="#ff4d4f" />}
          accessibilityLabel={`Excluir ${meta.label}`}
          pressStyle={{ opacity: 0.6 }}
        />
      </XStack>

      {/* Items List */}
      <YStack gap="$two" marginVertical="$two">
        {meal.items.map((item, idx) => (
          <XStack key={item.id || idx} justifyContent="space-between" alignItems="center">
            <YStack flex={1}>
              <Text fontSize={14} fontWeight="600" color="$color">
                {item.name}
              </Text>
              <Text fontSize={12} color="$textSecondary">
                {item.quantity} {item.unit}
              </Text>
            </YStack>
            <XStack gap="$two" alignItems="center">
              <Text fontSize={13} fontWeight="bold" color="$color">
                {Math.round(item.calories || 0)} kcal
              </Text>
            </XStack>
          </XStack>
        ))}
      </YStack>

      {/* Footer / Summary Row */}
      <YStack borderTopWidth={1} borderColor="$backgroundSelected" paddingTop="$two" marginTop="$two" gap="$one">
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize={13} fontWeight="700" color="$color">
            Total da Refeição
          </Text>
          <Text fontSize={14} fontWeight="800" color="$primary">
            {Math.round(totalCalories)} kcal
          </Text>
        </XStack>
        
        <XStack gap="$three" flexWrap="wrap" marginTop="$half">
          <Text fontSize={11} color="$textSecondary">
            Carb: <Text fontWeight="600" color="$color">{Math.round(totalCarbs)}g</Text>
          </Text>
          <Text fontSize={11} color="$textSecondary">
            Prot: <Text fontWeight="600" color="$color">{Math.round(totalProtein)}g</Text>
          </Text>
          <Text fontSize={11} color="$textSecondary">
            Gord: <Text fontWeight="600" color="$color">{Math.round(totalFat)}g</Text>
          </Text>
        </XStack>
      </YStack>
    </Card>
  );
}

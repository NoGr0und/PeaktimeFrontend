import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '../../constants/theme';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FoodSearch } from '../../components/ui/FoodSearch';
import { nutritionService, MealLog, MealType, CreateMealRequest, FoodItem } from '../../services/nutritionService';
import { SymbolView } from 'expo-symbols';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Skeleton } from 'moti/skeleton';
import { Swipeable } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { MotiView } from 'moti';
import { AnimatedBackground } from '../../components/layout/AnimatedBackground';


const MEAL_LABELS: Record<MealType, string> = {
  BREAKFAST: 'Café da Manhã',
  LUNCH: 'Almoço',
  SNACK: 'Lanche',
  DINNER: 'Jantar'
};

export default function NutritionScreen() {
  const queryClient = useQueryClient();
  const [showSearch, setShowSearch] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const isToday = selectedDateStr === new Date().toISOString().split('T')[0];

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toISOString().split('T')[0] === today.toISOString().split('T')[0]) return 'Hoje';
    if (date.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]) return 'Ontem';
    
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '');
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const { data: meals = [], isLoading } = useQuery({
    queryKey: ['dailyMeals', selectedDateStr],
    queryFn: () => nutritionService.getDailyMeals(selectedDateStr),
  });

  const addMealMutation = useMutation({
    mutationFn: (data: CreateMealRequest) => nutritionService.logMeal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyMeals', selectedDateStr] });
    },
    onError: () => {
      Alert.alert('Erro', 'Não foi possível registrar a refeição.');
    }
  });

  const deleteMealMutation = useMutation({
    mutationFn: (id: string) => nutritionService.deleteMeal(id),
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<MealLog[]>(['dailyMeals', selectedDateStr], (oldData) => {
        if (!oldData) return [];
        return oldData.filter(m => m.id !== deletedId);
      });
    },
    onError: () => {
      Alert.alert('Erro', 'Não foi possível remover a refeição.');
    }
  });

  const handleAddMeal = async (food: FoodItem, mealType: MealType, quantity: number) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    addMealMutation.mutate({
      type: mealType,
      date: selectedDate.toISOString(),
      items: [{
        name: food.name,
        quantity: quantity,
        unit: '100g',
        calories: food.caloriesPer100g * quantity,
        protein: food.proteinPer100g * quantity,
        carbs: food.carbsPer100g * quantity,
        fat: food.fatPer100g * quantity,
      }]
    });
  };

  const handleDelete = (id: string) => {
    deleteMealMutation.mutate(id);
  };

  const confirmDelete = (id: string, name: string) => {
    if (Platform.OS === 'web') {
      if (window.confirm(`Deseja realmente remover ${name}?`)) {
        handleDelete(id);
      }
      return;
    }

    Alert.alert(
      'Remover refeição',
      `Deseja realmente remover ${name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', style: 'destructive', onPress: () => handleDelete(id) }
      ]
    );
  };

  // Calculate totals
  const totals = meals.reduce(
    (acc, meal) => {
      meal.items?.forEach(item => {
        acc.calories += item.calories;
        acc.protein += item.protein;
        acc.carbs += item.carbs;
        acc.fat += item.fat;
      });
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // Group meals by type
  const mealsByType = meals.reduce((acc, meal) => {
    if (!acc[meal.type]) acc[meal.type] = [];
    acc[meal.type].push(meal);
    return acc;
  }, {} as Record<MealType, MealLog[]>);

  const renderMacro = (label: string, current: number, goal: number, color: string) => {
    const percentage = Math.min((current / goal) * 100, 100);
    return (
      <View style={styles.macroContainer}>
        <AnimatedCircularProgress
          size={50}
          width={4}
          fill={percentage}
          tintColor={color}
          backgroundColor={Theme.colors.surfaceLight}
          rotation={0}
        >
          {() => (
            <Text style={styles.macroValue}>{Math.round(current)}</Text>
          )}
        </AnimatedCircularProgress>
        <Text style={styles.macroLabel}>{label}</Text>
      </View>
    );
  };

  return (
    <LinearGradient colors={[Theme.colors.background, Theme.colors.surface]} style={styles.container}>
      <AnimatedBackground iconName="food-apple" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Text style={styles.title}>Diário de Nutrição</Text>
          <View style={styles.dateNavigator}>
            <TouchableOpacity onPress={() => changeDate(-1)} style={styles.dateNavBtn}>
              <Text style={{ fontSize: 24, color: Theme.colors.primary, fontFamily: Theme.typography.fonts.bold }}>{'<'}</Text>
            </TouchableOpacity>
            <Text style={styles.subtitle}>{formatDate(selectedDate)}</Text>
            <TouchableOpacity onPress={() => changeDate(1)} disabled={isToday} style={[styles.dateNavBtn, isToday && { opacity: 0.3 }]}>
              <Text style={{ fontSize: 24, color: Theme.colors.primary, fontFamily: Theme.typography.fonts.bold }}>{'>'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <MotiView
          from={{ opacity: 0, translateY: -10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600 }}
        >
          <Card glass style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Resumo do Dia</Text>
            
            <View style={styles.caloriesRow}>
              <Text style={styles.caloriesText}>
                {Math.round(totals.calories)} <Text style={styles.caloriesLabel}>/ 2500 kcal</Text>
              </Text>
            </View>

            <View style={styles.macrosRow}>
              {renderMacro('PROT', totals.protein, 150, Theme.colors.secondary)}
              {renderMacro('CARB', totals.carbs, 250, Theme.colors.success)}
              {renderMacro('GORD', totals.fat, 70, Theme.colors.accent)}
            </View>
          </Card>
        </MotiView>

        <Button 
          title="+ Adicionar Refeição" 
          onPress={() => setShowSearch(true)}
          style={styles.addBtn}
        />

        {isLoading ? (
          <View style={{ marginTop: 20 }}>
            <Skeleton colorMode="dark" width="100%" height={70} radius={8} />
            <View style={{ height: 16 }} />
            <Skeleton colorMode="dark" width="100%" height={70} radius={8} />
            <View style={{ height: 16 }} />
            <Skeleton colorMode="dark" width="100%" height={70} radius={8} />
          </View>
        ) : (
          (Object.keys(MEAL_LABELS) as MealType[]).map((type, index) => {
            const typeMeals = mealsByType[type] || [];
            
            if (typeMeals.length === 0) return null;

            return (
              <View
                key={type}
                style={styles.mealSection}
              >
                <Text style={styles.mealSectionTitle}>{MEAL_LABELS[type]}</Text>
                
                {typeMeals.map((meal) => (
                  <Swipeable
                    key={meal.id}
                    renderRightActions={() => (
                      <TouchableOpacity 
                        style={styles.deleteSwipe}
                        onPress={() => {
                          if (Platform.OS !== 'web') {
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                          }
                          confirmDelete(meal.id, meal.items?.[0]?.name || 'Refeição');
                        }}
                      >
                        <Text style={{ fontSize: 20 }}>🗑️</Text>
                      </TouchableOpacity>
                    )}
                  >
                    <View style={styles.mealItem}>
                      <View style={styles.mealInfo}>
                        <Text style={styles.mealName}>{meal.items?.map(i => i.name).join(', ')}</Text>
                        <Text style={styles.mealDetails}>
                          {Math.round(meal.items?.reduce((sum, i) => sum + i.calories, 0) || 0)} kcal
                        </Text>
                      </View>
                    </View>
                  </Swipeable>
                ))}
              </View>
            );
          })
        )}

      </ScrollView>

      <Modal visible={showSearch} animationType="slide">
        <FoodSearch 
          onClose={() => setShowSearch(false)}
          onAddMeal={handleAddMeal}
        />
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  scrollContent: {
    paddingHorizontal: Theme.spacing.lg,
    paddingBottom: 100,
  },
  header: {
    marginBottom: Theme.spacing.lg,
  },
  title: {
    fontFamily: Theme.typography.fonts.black,
    fontSize: Theme.typography.sizes.xxl,
    color: Theme.colors.text,
  },
  subtitle: {
    fontFamily: Theme.typography.fonts.medium,
    fontSize: Theme.typography.sizes.md,
    color: Theme.colors.primary,
    marginHorizontal: Theme.spacing.md,
  },
  dateNavigator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Theme.spacing.xs,
  },
  dateNavBtn: {
    padding: 4,
  },
  summaryCard: {
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
  },
  summaryTitle: {
    fontFamily: Theme.typography.fonts.bold,
    fontSize: Theme.typography.sizes.lg,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
  },
  caloriesRow: {
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  caloriesText: {
    fontFamily: Theme.typography.fonts.black,
    fontSize: 32,
    color: Theme.colors.primary,
  },
  caloriesLabel: {
    fontFamily: Theme.typography.fonts.regular,
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.textSecondary,
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macroContainer: {
    alignItems: 'center',
  },
  macroValue: {
    fontFamily: Theme.typography.fonts.bold,
    fontSize: 10,
    color: Theme.colors.text,
  },
  macroLabel: {
    fontFamily: Theme.typography.fonts.medium,
    fontSize: 10,
    color: Theme.colors.textSecondary,
    marginTop: 4,
  },
  addBtn: {
    marginBottom: Theme.spacing.xl,
  },
  mealSection: {
    marginBottom: Theme.spacing.lg,
  },
  mealSectionTitle: {
    fontFamily: Theme.typography.fonts.bold,
    fontSize: Theme.typography.sizes.md,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    paddingBottom: 4,
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.sm,
    marginBottom: 8,
  },
  deleteSwipe: {
    backgroundColor: Theme.colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: Theme.borderRadius.sm,
    marginBottom: 8,
    marginLeft: 8,
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontFamily: Theme.typography.fonts.bold,
    fontSize: Theme.typography.sizes.md,
    color: Theme.colors.text,
    marginBottom: 2,
  },
  mealDetails: {
    fontFamily: Theme.typography.fonts.regular,
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.textSecondary,
  }
});

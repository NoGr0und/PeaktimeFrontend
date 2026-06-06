import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '../../constants/theme';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FoodSearch } from '../../components/ui/FoodSearch';
import { nutritionService, MealLog, MealType } from '../../services/nutritionService';
import { MotiView } from 'moti';
import { SymbolView } from 'expo-symbols';


const MEAL_LABELS: Record<MealType, string> = {
  BREAKFAST: 'Café da Manhã',
  LUNCH: 'Almoço',
  SNACK: 'Lanche',
  DINNER: 'Jantar'
};

export default function NutritionScreen() {
  const [meals, setMeals] = useState<MealLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    loadMeals();
  }, []);

  const loadMeals = async () => {
    try {
      setIsLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const data = await nutritionService.getDailyMeals(today);
      setMeals(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMeal = async (foodId: string, mealType: MealType, quantity: number) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await nutritionService.logMeal({
        foodId,
        mealType,
        quantity,
        date: today
      });
      await loadMeals();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível registrar a refeição.');
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await nutritionService.deleteMeal(id);
      setMeals(meals.filter(m => m.id !== id));
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível remover a refeição.');
    }
  };

  const confirmDelete = (id: string, name: string) => {
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
      acc.calories += meal.food.calories * meal.quantity;
      acc.protein += meal.food.protein * meal.quantity;
      acc.carbs += meal.food.carbs * meal.quantity;
      acc.fat += meal.food.fat * meal.quantity;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // Group meals by type
  const mealsByType = meals.reduce((acc, meal) => {
    if (!acc[meal.mealType]) acc[meal.mealType] = [];
    acc[meal.mealType].push(meal);
    return acc;
  }, {} as Record<MealType, MealLog[]>);

  const renderMacro = (label: string, current: number, goal: number, color: string) => {
    const percentage = Math.min((current / goal) * 100, 100);
    return (
      <View style={styles.macroContainer}>
        {/* <AnimatedCircularProgress
          size={50}
          width={4}
          fill={percentage}
          tintColor={color}
          backgroundColor={Theme.colors.surfaceLight}
          rotation={0}
        >
          {() => (
            <Text style={styles.macroValue}>{Math.round(current)}g</Text>
          )}
        </AnimatedCircularProgress> */}
        <Text style={styles.macroValue}>{Math.round(current)}g</Text>
        <Text style={styles.macroLabel}>{label}</Text>
      </View>
    );
  };

  return (
    <LinearGradient colors={[Theme.colors.background, Theme.colors.surface]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Text style={styles.title}>Diário de Nutrição</Text>
          <Text style={styles.subtitle}>Hoje</Text>
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
          <ActivityIndicator color={Theme.colors.primary} style={{ marginTop: 40 }} />
        ) : (
          (Object.keys(MEAL_LABELS) as MealType[]).map((type, index) => {
            const typeMeals = mealsByType[type] || [];
            
            if (typeMeals.length === 0) return null;

            return (
              <MotiView
                key={type}
                from={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', delay: index * 100 }}
                style={styles.mealSection}
              >
                <Text style={styles.mealSectionTitle}>{MEAL_LABELS[type]}</Text>
                
                {typeMeals.map((meal) => (
                  <View key={meal.id} style={styles.mealItem}>
                    <View style={styles.mealInfo}>
                      <Text style={styles.mealName}>{meal.food.name}</Text>
                      <Text style={styles.mealDetails}>
                        {meal.quantity}x {meal.food.portion} • {Math.round(meal.food.calories * meal.quantity)} kcal
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => confirmDelete(meal.id, meal.food.name)}>
                      <SymbolView name="trash" size={20} tintColor={Theme.colors.error} />
                    </TouchableOpacity>
                  </View>
                ))}
              </MotiView>
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

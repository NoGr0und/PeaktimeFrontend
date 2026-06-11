import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Theme } from '../../constants/theme';
import { Input } from './Input';
import { Button } from './Button';
import { Card } from './Card';
import { nutritionService, FoodItem, MealType } from '../../services/nutritionService';
import { SymbolView } from 'expo-symbols';

interface FoodSearchProps {
  onAddMeal: (food: FoodItem, mealType: MealType, quantity: number) => Promise<void>;
  onClose: () => void;
}

const MEAL_TYPES: { value: MealType; label: string }[] = [
  { value: 'BREAKFAST', label: 'Café da Manhã' },
  { value: 'LUNCH', label: 'Almoço' },
  { value: 'SNACK', label: 'Lanche' },
  { value: 'DINNER', label: 'Jantar' }
];

export const FoodSearch = ({ onAddMeal, onClose }: FoodSearchProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState('1');
  const [mealType, setMealType] = useState<MealType>('BREAKFAST');
  const [isAdding, setIsAdding] = useState(false);

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim().length >= 2) {
        handleSearch(query);
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSearch = async (searchQuery: string) => {
    try {
      setIsLoading(true);
      const data = await nutritionService.searchFood(searchQuery);
      setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!selectedFood) return;
    
    try {
      setIsAdding(true);
      await onAddMeal(selectedFood, mealType, parseFloat(quantity) || 1);
      onClose();
    } catch (error) {
      console.error(error);
      setIsAdding(false);
    }
  };

  if (selectedFood) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSelectedFood(null)}>
            <SymbolView name="chevron.left" size={24} tintColor={Theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Adicionar Refeição</Text>
          <View style={{ width: 24 }} />
        </View>

        <Card glass style={styles.selectedCard}>
          <Text style={styles.foodName}>{selectedFood.name}</Text>
          <Text style={styles.foodPortion}>Porção: 100g</Text>
          
          <View style={styles.macrosRow}>
            <View style={styles.macro}>
              <Text style={styles.macroLabel}>CAL</Text>
              <Text style={[styles.macroValue, { color: Theme.colors.primary }]}>{selectedFood.caloriesPer100g}</Text>
            </View>
            <View style={styles.macro}>
              <Text style={styles.macroLabel}>PROT</Text>
              <Text style={[styles.macroValue, { color: Theme.colors.secondary }]}>{selectedFood.proteinPer100g}g</Text>
            </View>
            <View style={styles.macro}>
              <Text style={styles.macroLabel}>CARB</Text>
              <Text style={[styles.macroValue, { color: Theme.colors.success }]}>{selectedFood.carbsPer100g}g</Text>
            </View>
            <View style={styles.macro}>
              <Text style={styles.macroLabel}>GORD</Text>
              <Text style={[styles.macroValue, { color: Theme.colors.accent }]}>{selectedFood.fatPer100g}g</Text>
            </View>
          </View>
        </Card>

        <Text style={styles.label}>Tipo de Refeição</Text>
        <View style={styles.mealTypeContainer}>
          {MEAL_TYPES.map(type => (
            <TouchableOpacity
              key={type.value}
              style={[styles.mealTypeBtn, mealType === type.value && styles.mealTypeBtnSelected]}
              onPress={() => setMealType(type.value)}
            >
              <Text style={[styles.mealTypeText, mealType === type.value && styles.mealTypeTextSelected]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Input
          label="Quantidade (porções)"
          keyboardType="numeric"
          value={quantity}
          onChangeText={setQuantity}
        />

        <View style={styles.actions}>
          <Button title="Cancelar" variant="outline" onPress={onClose} style={styles.actionBtn} />
          <Button title="Adicionar" onPress={handleAdd} isLoading={isAdding} style={styles.actionBtn} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Buscar Alimento</Text>
        <TouchableOpacity onPress={onClose}>
          <SymbolView name="xmark" size={24} tintColor={Theme.colors.text} />
        </TouchableOpacity>
      </View>

      <Input
        placeholder="Ex: Arroz, Frango, Banana..."
        value={query}
        onChangeText={setQuery}
        autoFocus
      />

      {isLoading ? (
        <ActivityIndicator color={Theme.colors.primary} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item, index) => item.name + index}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.resultItem} onPress={() => setSelectedFood(item)}>
              <View>
                <Text style={styles.resultName}>{item.name}</Text>
                <Text style={styles.resultDetails}>100g • {item.caloriesPer100g} kcal</Text>
              </View>
              <SymbolView name="plus.circle.fill" size={24} tintColor={Theme.colors.primary} />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            query.length >= 2 ? (
              <Text style={styles.emptyText}>Nenhum alimento encontrado.</Text>
            ) : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Theme.spacing.lg,
    backgroundColor: Theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  title: {
    fontFamily: Theme.typography.fonts.black,
    fontSize: Theme.typography.sizes.xl,
    color: Theme.colors.text,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  resultName: {
    fontFamily: Theme.typography.fonts.bold,
    fontSize: Theme.typography.sizes.md,
    color: Theme.colors.text,
  },
  resultDetails: {
    fontFamily: Theme.typography.fonts.regular,
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  emptyText: {
    fontFamily: Theme.typography.fonts.regular,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: Theme.spacing.xl,
  },
  selectedCard: {
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
  },
  foodName: {
    fontFamily: Theme.typography.fonts.black,
    fontSize: Theme.typography.sizes.lg,
    color: Theme.colors.text,
  },
  foodPortion: {
    fontFamily: Theme.typography.fonts.regular,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.md,
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macro: {
    alignItems: 'center',
  },
  macroLabel: {
    fontFamily: Theme.typography.fonts.bold,
    fontSize: 10,
    color: Theme.colors.textSecondary,
  },
  macroValue: {
    fontFamily: Theme.typography.fonts.black,
    fontSize: Theme.typography.sizes.md,
  },
  label: {
    fontFamily: Theme.typography.fonts.bold,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
  },
  mealTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Theme.spacing.lg,
  },
  mealTypeBtn: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: 8,
    backgroundColor: Theme.colors.surfaceLight,
    marginRight: Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
  },
  mealTypeBtnSelected: {
    backgroundColor: Theme.colors.primary,
  },
  mealTypeText: {
    fontFamily: Theme.typography.fonts.bold,
    color: Theme.colors.textSecondary,
  },
  mealTypeTextSelected: {
    color: Theme.colors.background,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Theme.spacing.xl,
  },
  actionBtn: {
    flex: 1,
    marginHorizontal: Theme.spacing.xs,
  }
});

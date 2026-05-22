import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, ScrollView, Modal, ActivityIndicator, Pressable, useColorScheme } from 'react-native';
import { YStack, XStack, Text, Spinner, Input as TInput } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import Head from 'expo-router/head';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  X,
  Check,
  Utensils,
  Coffee,
  Apple,
  Trash2,
  Calendar,
  AlertTriangle,
  RefreshCw,
} from '@tamagui/lucide-icons-2';

import { useNutrition } from '@/hooks/use-nutrition';
import { MealCard } from '@/components/MealCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/theme';
import { MealType, FoodSearchResult } from '@/types/nutrition';

const TARGET_CALORIES = 2000;
const TARGET_PROTEIN = 130;
const TARGET_CARBS = 220;
const TARGET_FAT = 70;

const MEAL_CATEGORIES: { type: MealType; label: string; icon: any }[] = [
  { type: 'BREAKFAST', label: 'Café da Manhã', icon: Coffee },
  { type: 'LUNCH', label: 'Almoço', icon: Utensils },
  { type: 'SNACK', label: 'Lanche', icon: Apple },
  { type: 'DINNER', label: 'Jantar', icon: Utensils },
];

export default function NutritionScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const themeColors = Colors[theme];

  // Date State
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Modal & Log Creation State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<MealType>('BREAKFAST');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodSearchResult | null>(null);
  const [quantity, setQuantity] = useState('100');
  const [unit, setUnit] = useState('g');
  const [stagedItems, setStagedItems] = useState<{
    name: string;
    quantity: number;
    unit: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }[]>([]);

  const {
    meals,
    isLoading,
    isSearching,
    error,
    searchResult,
    searchError,
    fetchMeals,
    createMeal,
    deleteMeal,
    searchFood,
    setSearchResult,
  } = useNutrition();

  // Format Date to YYYY-MM-DD (local time)
  const dateStr = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, [selectedDate]);

  // Fetch meals on focus and date change
  useFocusEffect(
    useCallback(() => {
      fetchMeals(dateStr);
    }, [fetchMeals, dateStr])
  );

  // Debounced search logic (300ms)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim() && isModalOpen) {
        searchFood(searchQuery);
      } else {
        setSearchResult([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, searchFood, setSearchResult, isModalOpen]);

  // Calculate Consumed Totals for the Selected Date
  const consumedTotals = useMemo(() => {
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;

    meals.forEach((meal) => {
      meal.items.forEach((item) => {
        calories += item.calories || 0;
        protein += item.protein || 0;
        carbs += item.carbs || 0;
        fat += item.fat || 0;
      });
    });

    return {
      calories: Math.round(calories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat),
    };
  }, [meals]);

  // Proportional Macros for Selected Food item
  const calculatedMacros = useMemo(() => {
    if (!selectedFood) return null;
    const qty = parseFloat(quantity) || 0;
    return {
      calories: Math.round((selectedFood.caloriesPer100g * qty) / 100),
      protein: parseFloat(((selectedFood.proteinPer100g * qty) / 100).toFixed(1)),
      carbs: parseFloat(((selectedFood.carbsPer100g * qty) / 100).toFixed(1)),
      fat: parseFloat(((selectedFood.fatPer100g * qty) / 100).toFixed(1)),
    };
  }, [selectedFood, quantity]);

  // Date Navigation Handlers
  const handlePrevDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    setSelectedDate(prev);
  };

  const handleNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    setSelectedDate(next);
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const getFormattedDate = () => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (dateStr === today.toISOString().split('T')[0]) {
      return 'Hoje';
    }
    if (dateStr === yesterday.toISOString().split('T')[0]) {
      return 'Ontem';
    }

    const formatted = selectedDate.toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
    // Capitalize first letter
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  // Add Item to staged list
  const handleAddStagedItem = () => {
    if (!selectedFood || !calculatedMacros) return;
    const qty = parseFloat(quantity) || 0;
    if (qty <= 0) return;

    setStagedItems((prev) => [
      ...prev,
      {
        name: selectedFood.name,
        quantity: qty,
        unit: unit || 'g',
        ...calculatedMacros,
      },
    ]);

    // Reset search / selection state to allow adding next items
    setSelectedFood(null);
    setSearchQuery('');
    setQuantity('100');
    setUnit('g');
  };

  // Remove item from staged list
  const handleRemoveStagedItem = (index: number) => {
    setStagedItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Open modal preselected to category
  const handleOpenAddModal = (category: MealType) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  // Save the complete meal
  const handleSaveMeal = async () => {
    if (stagedItems.length === 0) return;

    const payload = {
      type: selectedCategory,
      date: selectedDate.toISOString(),
      items: stagedItems,
    };

    try {
      await createMeal(payload, dateStr);
      // Reset and close
      setStagedItems([]);
      setSelectedFood(null);
      setSearchQuery('');
      setIsModalOpen(false);
    } catch {
      // Error handled by hook
    }
  };

  const handleDeleteMeal = async (mealId: string) => {
    try {
      await deleteMeal(mealId, dateStr);
    } catch {
      // Error handled by hook
    }
  };

  const stagedTotals = useMemo(() => {
    return stagedItems.reduce(
      (acc, item) => {
        acc.calories += item.calories;
        acc.protein += item.protein;
        acc.carbs += item.carbs;
        acc.fat += item.fat;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [stagedItems]);

  return (
    <>
      <Head>
        <title>Diário de Refeições - Peaktime</title>
        <meta name="description" content="Acompanhe sua ingestão de calorias e macronutrientes diários no diário alimentar do Peaktime." />
      </Head>
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.backgroundElement }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <YStack gap="$four" padding="$four" width="100%" maxWidth={800} alignSelf="center">
          
          {/* Top Bar Header */}
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={22} fontWeight="bold" color="$color">
              Diário de Refeições
            </Text>
            {dateStr !== new Date().toISOString().split('T')[0] && (
              <Button
                variant="ghost"
                size="small"
                onPress={handleToday}
                icon={<Calendar size={14} color={themeColors.primary} />}
                accessibilityLabel="Ir para o dia de hoje"
              >
                Hoje
              </Button>
            )}
          </XStack>

          {/* Date Selector Navigation */}
          <Card variant="flat" padding="$three" backgroundColor="$background">
            <XStack justifyContent="space-between" alignItems="center">
              <Button
                variant="ghost"
                size="small"
                circular
                onPress={handlePrevDay}
                icon={<ChevronLeft size={20} color={themeColors.primary} />}
                accessibilityLabel="Dia anterior"
              />
              <Text fontSize={16} fontWeight="bold" color="$color">
                {getFormattedDate()}
              </Text>
              <Button
                variant="ghost"
                size="small"
                circular
                onPress={handleNextDay}
                icon={<ChevronRight size={20} color={themeColors.primary} />}
                accessibilityLabel="Próximo dia"
              />
            </XStack>
          </Card>

          {/* Calorie & Macronutrient Summary Dashboard Card */}
          <Card variant="elevated" padding="$four" backgroundColor="$background" gap="$three">
            <Text fontSize={15} fontWeight="700" color="$color">
              Resumo Diário
            </Text>

            {/* Calories Progress Gauge */}
            <YStack gap="$two">
              <XStack justifyContent="space-between" alignItems="baseline">
                <Text fontSize={13} color="$textSecondary">Calorias</Text>
                <XStack alignItems="baseline" gap="$one">
                  <Text fontSize={20} fontWeight="bold" color="$primary">
                    {consumedTotals.calories}
                  </Text>
                  <Text fontSize={12} color="$textSecondary">
                    / {TARGET_CALORIES} kcal
                  </Text>
                </XStack>
              </XStack>
              {/* Calories Progress Bar */}
              <XStack height={8} borderRadius={4} backgroundColor="$backgroundSelected" overflow="hidden">
                <XStack
                  height="100%"
                  backgroundColor="$primary"
                  width={`${Math.min(100, (consumedTotals.calories / TARGET_CALORIES) * 100)}%`}
                />
              </XStack>
            </YStack>

            {/* Macronutrient Breakdowns */}
            <XStack gap="$three" justifyContent="space-between" marginTop="$two">
              {/* Carb */}
              <YStack flex={1} gap="$one">
                <XStack justifyContent="space-between">
                  <Text fontSize={11} color="$textSecondary">Carboidratos</Text>
                  <Text fontSize={11} fontWeight="bold" color="$color">
                    {consumedTotals.carbs}g/{TARGET_CARBS}g
                  </Text>
                </XStack>
                <XStack height={5} borderRadius={2.5} backgroundColor="$backgroundSelected" overflow="hidden">
                  <XStack
                    height="100%"
                    backgroundColor="#f5b041"
                    width={`${Math.min(100, (consumedTotals.carbs / TARGET_CARBS) * 100)}%`}
                  />
                </XStack>
              </YStack>

              {/* Protein */}
              <YStack flex={1} gap="$one">
                <XStack justifyContent="space-between">
                  <Text fontSize={11} color="$textSecondary">Proteínas</Text>
                  <Text fontSize={11} fontWeight="bold" color="$color">
                    {consumedTotals.protein}g/{TARGET_PROTEIN}g
                  </Text>
                </XStack>
                <XStack height={5} borderRadius={2.5} backgroundColor="$backgroundSelected" overflow="hidden">
                  <XStack
                    height="100%"
                    backgroundColor="#2ecc71"
                    width={`${Math.min(100, (consumedTotals.protein / TARGET_PROTEIN) * 100)}%`}
                  />
                </XStack>
              </YStack>

              {/* Fat */}
              <YStack flex={1} gap="$one">
                <XStack justifyContent="space-between">
                  <Text fontSize={11} color="$textSecondary">Gorduras</Text>
                  <Text fontSize={11} fontWeight="bold" color="$color">
                    {consumedTotals.fat}g/{TARGET_FAT}g
                  </Text>
                </XStack>
                <XStack height={5} borderRadius={2.5} backgroundColor="$backgroundSelected" overflow="hidden">
                  <XStack
                    height="100%"
                    backgroundColor="#e74c3c"
                    width={`${Math.min(100, (consumedTotals.fat / TARGET_FAT) * 100)}%`}
                  />
                </XStack>
              </YStack>
            </XStack>
          </Card>

          {/* Meals List grouped by Category */}
          <YStack gap="$three">
            <Text fontSize={16} fontWeight="bold" color="$color">
              Refeições do Dia
            </Text>

            {isLoading ? (
              <YStack py="$five" justifyContent="center" alignItems="center">
                <Spinner size="large" color="$primary" />
                <Text mt="$two" color="$textSecondary" fontSize={14}>
                  Carregando refeições...
                </Text>
              </YStack>
            ) : error ? (
              <YStack py="$five" px="$four" gap="$two" alignItems="center" backgroundColor="$background" borderRadius="$radius.two">
                <AlertTriangle size={32} color={themeColors.accent} />
                <Text fontWeight="bold" color="$color">Erro ao carregar diário</Text>
                <Text fontSize={13} color="$textSecondary" textAlign="center">{error}</Text>
                <Button variant="outline" size="small" onPress={() => fetchMeals(dateStr)} icon={<RefreshCw size={14} />}>
                  Recarregar
                </Button>
              </YStack>
            ) : (
              MEAL_CATEGORIES.map((category) => {
                const categoryMeals = meals.filter((m) => m.type === category.type);
                const IconComp = category.icon;

                return (
                  <YStack key={category.type} gap="$two">
                    <XStack justifyContent="space-between" alignItems="center" px="$one">
                      <XStack gap="$two" alignItems="center">
                        <IconComp size={16} color={themeColors.primary} />
                        <Text fontSize={14} fontWeight="bold" color="$color">
                          {category.label}
                        </Text>
                      </XStack>
                      {categoryMeals.length > 0 && (
                        <Button
                          variant="ghost"
                          size="small"
                          onPress={() => handleOpenAddModal(category.type)}
                          icon={<Plus size={14} color={themeColors.primary} />}
                          accessibilityLabel={`Adicionar mais itens no ${category.label}`}
                          paddingHorizontal="$two"
                          height={28}
                        >
                          Adicionar
                        </Button>
                      )}
                    </XStack>

                    {categoryMeals.length > 0 ? (
                      categoryMeals.map((meal) => (
                        <MealCard
                          key={meal.id}
                          meal={meal}
                          onDelete={handleDeleteMeal}
                        />
                      ))
                    ) : (
                      /* Beautiful Dashed Empty State Placeholder */
                      <Pressable
                        onPress={() => handleOpenAddModal(category.type)}
                        accessibilityRole="button"
                        accessibilityLabel={`Registrar ${category.label}`}
                      >
                        <YStack
                          borderWidth={1.5}
                          borderColor="$backgroundSelected"
                          borderStyle="dashed"
                          borderRadius="$radius.two"
                          padding="$four"
                          alignItems="center"
                          justifyContent="center"
                          backgroundColor="$background"
                          gap="$two"
                          pressStyle={{ opacity: 0.7 }}
                        >
                          <Plus size={20} color={themeColors.textSecondary} />
                          <Text fontSize={13} fontWeight="600" color="$textSecondary">
                            Registrar {category.label}
                          </Text>
                        </YStack>
                      </Pressable>
                    )}
                  </YStack>
                );
              })
            )}
          </YStack>

        </YStack>
      </ScrollView>

      {/* Modal - Add / Log Meal Food Items */}
      <Modal
        visible={isModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <SafeAreaView style={styles.modalOverlay}>
          <YStack style={[styles.modalContent, { backgroundColor: themeColors.background }]}>
            
            {/* Modal Header */}
            <XStack justifyContent="space-between" alignItems="center" borderBottomWidth={1} borderColor="$backgroundSelected" paddingBottom="$three" marginBottom="$three">
              <Text fontSize={18} fontWeight="bold" color="$color">
                Registrar Refeição
              </Text>
              <Button
                variant="ghost"
                size="small"
                circular
                onPress={() => {
                  setIsModalOpen(false);
                  setStagedItems([]);
                  setSelectedFood(null);
                  setSearchQuery('');
                }}
                icon={<X size={20} color={themeColors.textSecondary} />}
                accessibilityLabel="Fechar modal"
              />
            </XStack>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <YStack gap="$four">
                
                {/* Category Button Selector Group */}
                <YStack gap="$two">
                  <Text fontSize={13} fontWeight="600" color="$textSecondary">Categoria da Refeição</Text>
                  <XStack flexWrap="wrap" gap="$two">
                    {MEAL_CATEGORIES.map((cat) => (
                      <Pressable
                        key={cat.type}
                        onPress={() => setSelectedCategory(cat.type)}
                        style={[
                          styles.catBadge,
                          {
                            borderColor: selectedCategory === cat.type ? themeColors.primary : themeColors.backgroundSelected,
                            backgroundColor: selectedCategory === cat.type ? themeColors.primaryLight : 'transparent',
                          },
                        ]}
                        accessibilityRole="button"
                        accessibilityState={{ selected: selectedCategory === cat.type }}
                        accessibilityLabel={`Selecionar categoria ${cat.label}`}
                      >
                        <Text
                          fontSize={12}
                          fontWeight="600"
                          color={selectedCategory === cat.type ? themeColors.primary : themeColors.text}
                        >
                          {cat.label}
                        </Text>
                      </Pressable>
                    ))}
                  </XStack>
                </YStack>

                {/* Food Search Section */}
                <YStack gap="$two">
                  <Text fontSize={13} fontWeight="600" color="$textSecondary">Buscar Alimentos</Text>
                  <XStack position="relative" alignItems="center">
                    <TInput
                      borderWidth={1}
                      borderRadius="$radius.one"
                      borderColor="$backgroundSelected"
                      backgroundColor="$backgroundElement"
                      color="$color"
                      fontSize={15}
                      height={44}
                      paddingHorizontal={12}
                      paddingLeft={40}
                      flex={1}
                      placeholder="Ex: Pão integral, banana, ovo..."
                      placeholderTextColor={themeColors.textSecondary as any}
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      accessibilityRole="search"
                      accessibilityLabel="Campo de busca de alimento"
                    />
                    <XStack position="absolute" left={12}>
                      <Search size={16} color={themeColors.textSecondary} />
                    </XStack>
                    {searchQuery.length > 0 && (
                      <Pressable
                        onPress={() => setSearchQuery('')}
                        style={styles.clearSearchBtn}
                        accessibilityLabel="Limpar busca"
                      >
                        <X size={16} color={themeColors.textSecondary} />
                      </Pressable>
                    )}
                  </XStack>
                </YStack>

                {/* Real-time search loader / results */}
                {isSearching ? (
                  <XStack py="$four" justifyContent="center" gap="$two">
                    <ActivityIndicator size="small" color={themeColors.primary} />
                    <Text fontSize={13} color="$textSecondary">Pesquisando no Open Food Facts...</Text>
                  </XStack>
                ) : searchError ? (
                  <Text fontSize={12} color="#ff4d4f">{searchError}</Text>
                ) : searchQuery.trim().length > 0 && searchResult.length === 0 ? (
                  <Text fontSize={13} color="$textSecondary" textAlign="center" py="$three">
                    Nenhum alimento encontrado.
                  </Text>
                ) : (
                  searchQuery.trim().length > 0 && !selectedFood && (
                    <YStack gap="$one" borderBottomWidth={1} borderColor="$backgroundSelected" paddingBottom="$two" maxHeight={200}>
                      <ScrollView nestedScrollEnabled style={{ maxHeight: 200 }}>
                        {searchResult.map((food, idx) => (
                          <Pressable
                            key={idx}
                            onPress={() => setSelectedFood(food)}
                            style={({ pressed }) => [
                              styles.searchResultRow,
                              { backgroundColor: pressed ? themeColors.backgroundSelected : 'transparent' },
                            ]}
                            accessibilityRole="button"
                            accessibilityLabel={`Selecionar ${food.name}`}
                          >
                            <YStack flex={1}>
                              <Text fontSize={14} fontWeight="600" color="$color">
                                {food.name}
                              </Text>
                              <Text fontSize={11} color="$textSecondary">
                                Carb: {food.carbsPer100g}g  •  Prot: {food.proteinPer100g}g  •  Gord: {food.fatPer100g}g
                              </Text>
                            </YStack>
                            <Text fontSize={12} fontWeight="bold" color="$primary">
                              {Math.round(food.caloriesPer100g)} kcal/100g
                            </Text>
                          </Pressable>
                        ))}
                      </ScrollView>
                    </YStack>
                  )
                )}

                {/* Selected Food Macro Proportional Calculator Details */}
                {selectedFood && calculatedMacros && (
                  <Card variant="flat" padding="$three" backgroundColor="$backgroundElement" gap="$three">
                    <XStack justifyContent="space-between" alignItems="center">
                      <YStack flex={1} marginRight="$two">
                        <Text fontSize={11} fontWeight="bold" color="$primary">ALIMENTO SELECIONADO</Text>
                        <Text fontSize={15} fontWeight="700" color="$color" numberOfLines={1}>
                          {selectedFood.name}
                        </Text>
                      </YStack>
                      <Button
                        variant="ghost"
                        size="small"
                        circular
                        onPress={() => setSelectedFood(null)}
                        icon={<X size={16} color={themeColors.textSecondary} />}
                      />
                    </XStack>

                    {/* Quantity & Unit Inputs */}
                    <XStack gap="$three">
                      <YStack flex={1} gap="$one">
                        <Text fontSize={12} color="$textSecondary" fontWeight="600">Qtd. Consumida</Text>
                        <TInput
                          borderWidth={1}
                          borderRadius="$radius.one"
                          borderColor="$backgroundSelected"
                          backgroundColor="$background"
                          color="$color"
                          height={40}
                          fontSize={14}
                          keyboardType="numeric"
                          value={quantity}
                          onChangeText={setQuantity}
                          accessibilityLabel="Quantidade consumida"
                        />
                      </YStack>

                      <YStack flex={1} gap="$one">
                        <Text fontSize={12} color="$textSecondary" fontWeight="600">Unidade</Text>
                        <TInput
                          borderWidth={1}
                          borderRadius="$radius.one"
                          borderColor="$backgroundSelected"
                          backgroundColor="$background"
                          color="$color"
                          height={40}
                          fontSize={14}
                          value={unit}
                          onChangeText={setUnit}
                          accessibilityLabel="Unidade de medida"
                        />
                      </YStack>
                    </XStack>

                    {/* Interactive Proportional Macros Summary display */}
                    <YStack gap="$two" borderTopWidth={1} borderColor="$backgroundSelected" paddingTop="$two">
                      <XStack justifyContent="space-between">
                        <Text fontSize={13} fontWeight="bold" color="$color">Calorias Proporcionais</Text>
                        <Text fontSize={14} fontWeight="800" color="$primary">
                          {calculatedMacros.calories} kcal
                        </Text>
                      </XStack>
                      <XStack gap="$three" justifyContent="space-between">
                        <Text fontSize={11} color="$textSecondary">
                          Carb: <Text fontWeight="bold" color="$color">{calculatedMacros.carbs}g</Text>
                        </Text>
                        <Text fontSize={11} color="$textSecondary">
                          Prot: <Text fontWeight="bold" color="$color">{calculatedMacros.protein}g</Text>
                        </Text>
                        <Text fontSize={11} color="$textSecondary">
                          Gord: <Text fontWeight="bold" color="$color">{calculatedMacros.fat}g</Text>
                        </Text>
                      </XStack>
                    </YStack>

                    {/* Add to current Meal list button */}
                    <Button
                      variant="primary"
                      size="small"
                      onPress={handleAddStagedItem}
                      disabled={(parseFloat(quantity) || 0) <= 0}
                      icon={<Plus size={14} color="#ffffff" />}
                      accessibilityLabel="Adicionar alimento à lista da refeição"
                    >
                      Adicionar Item
                    </Button>
                  </Card>
                )}

                {/* Staged Items List */}
                <YStack gap="$two" marginTop="$two">
                  <Text fontSize={14} fontWeight="bold" color="$color">
                    Itens Adicionados ({stagedItems.length})
                  </Text>

                  {stagedItems.length === 0 ? (
                    <Text fontSize={13} color="$textSecondary" fontStyle="italic">
                      Nenhum alimento adicionado a esta refeição ainda. Use o campo de busca acima para selecionar e adicionar.
                    </Text>
                  ) : (
                    <YStack gap="$two">
                      {stagedItems.map((item, idx) => (
                        <Card key={idx} variant="flat" padding="$two" backgroundColor="$backgroundElement">
                          <XStack justifyContent="space-between" alignItems="center">
                            <YStack flex={1} marginRight="$two">
                              <Text fontSize={14} fontWeight="600" color="$color">
                                {item.name}
                              </Text>
                              <Text fontSize={12} color="$textSecondary">
                                {item.quantity} {item.unit}  •  {item.calories} kcal
                              </Text>
                              <Text fontSize={11} color="$textSecondary">
                                C: {item.carbs}g • P: {item.protein}g • G: {item.fat}g
                              </Text>
                            </YStack>
                            <Button
                              variant="ghost"
                              size="small"
                              circular
                              onPress={() => handleRemoveStagedItem(idx)}
                              icon={<Trash2 size={16} color="#ff4d4f" />}
                              accessibilityLabel={`Remover ${item.name}`}
                            />
                          </XStack>
                        </Card>
                      ))}

                      {/* Staged Meal Macros Summary */}
                      <YStack borderTopWidth={1} borderColor="$backgroundSelected" paddingTop="$three" marginTop="$two" gap="$one">
                        <XStack justifyContent="space-between">
                          <Text fontSize={14} fontWeight="bold" color="$color">Total da Refeição</Text>
                          <Text fontSize={15} fontWeight="800" color="$primary">
                            {stagedTotals.calories} kcal
                          </Text>
                        </XStack>
                        <XStack gap="$three">
                          <Text fontSize={12} color="$textSecondary">
                            Carb: <Text fontWeight="bold" color="$color">{stagedTotals.carbs.toFixed(1)}g</Text>
                          </Text>
                          <Text fontSize={12} color="$textSecondary">
                            Prot: <Text fontWeight="bold" color="$color">{stagedTotals.protein.toFixed(1)}g</Text>
                          </Text>
                          <Text fontSize={12} color="$textSecondary">
                            Gord: <Text fontWeight="bold" color="$color">{stagedTotals.fat.toFixed(1)}g</Text>
                          </Text>
                        </XStack>
                      </YStack>
                    </YStack>
                  )}
                </YStack>

              </YStack>
            </ScrollView>

            {/* Modal Bottom Actions */}
            <XStack gap="$three" borderTopWidth={1} borderColor="$backgroundSelected" paddingTop="$three" marginTop="$three">
              <Button
                variant="outline"
                flex={1}
                onPress={() => {
                  setIsModalOpen(false);
                  setStagedItems([]);
                  setSelectedFood(null);
                  setSearchQuery('');
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                flex={1}
                disabled={stagedItems.length === 0}
                isLoading={isLoading}
                onPress={handleSaveMeal}
                icon={<Check size={18} color="#ffffff" />}
                accessibilityLabel="Confirmar registro da refeição inteira"
              >
                Salvar Refeição
              </Button>
            </XStack>

          </YStack>
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '90%',
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  catBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 4,
    marginBottom: 4,
  },
  clearSearchBtn: {
    position: 'absolute',
    right: 12,
    padding: 4,
  },
  searchResultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
});

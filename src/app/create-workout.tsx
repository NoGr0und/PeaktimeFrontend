import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '../constants/theme';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { workoutService, WeeklyPlan, DayPlan, Exercise } from '../services/workoutService';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../services/AuthContext';
import { useQueryClient } from '@tanstack/react-query';

const DAYS_OF_WEEK = [
  { value: 'MONDAY', label: 'Segunda-feira' },
  { value: 'TUESDAY', label: 'Terça-feira' },
  { value: 'WEDNESDAY', label: 'Quarta-feira' },
  { value: 'THURSDAY', label: 'Quinta-feira' },
  { value: 'FRIDAY', label: 'Sexta-feira' },
  { value: 'SATURDAY', label: 'Sábado' },
  { value: 'SUNDAY', label: 'Domingo' }
] as const;

export default function PlanBuilderScreen() {
  const { studentId: paramStudentId, studentName: paramStudentName } = useLocalSearchParams<{ studentId: string; studentName: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const targetStudentId = paramStudentId || user?.id;
  const targetStudentName = paramStudentName || user?.name;

  const [planName, setPlanName] = useState('');
  const [days, setDays] = useState<DayPlan[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addDay = () => {
    setDays([...days, { dayOfWeek: 'MONDAY', name: 'Novo Treino', exercises: [] }]);
  };

  const updateDay = (index: number, field: keyof DayPlan, value: any) => {
    const newDays = [...days];
    newDays[index] = { ...newDays[index], [field]: value };
    setDays(newDays);
  };

  const removeDay = (index: number) => {
    const newDays = [...days];
    newDays.splice(index, 1);
    setDays(newDays);
  };

  const addExercise = (dayIndex: number) => {
    const newDays = [...days];
    newDays[dayIndex].exercises.push({
      name: '',
      sets: 3,
      reps: 10,
      order: newDays[dayIndex].exercises.length,
      loadKg: 0,
      restSeconds: 60,
      notes: ''
    });
    setDays(newDays);
  };

  const updateExercise = (dayIndex: number, exerciseIndex: number, field: keyof Exercise, value: any) => {
    const newDays = [...days];
    newDays[dayIndex].exercises[exerciseIndex] = { 
      ...newDays[dayIndex].exercises[exerciseIndex], 
      [field]: value 
    };
    setDays(newDays);
  };

  const removeExercise = (dayIndex: number, exerciseIndex: number) => {
    const newDays = [...days];
    newDays[dayIndex].exercises.splice(exerciseIndex, 1);
    
    // Reorder
    newDays[dayIndex].exercises.forEach((ex, idx) => {
      ex.order = idx;
    });
    
    setDays(newDays);
  };

  const handleSubmit = async () => {
    if (!targetStudentId) {
      Alert.alert('Erro', 'Aluno não identificado.');
      return;
    }
    if (!planName.trim()) {
      Alert.alert('Erro', 'O plano precisa de um nome.');
      return;
    }
    if (days.length === 0) {
      Alert.alert('Erro', 'Adicione pelo menos um dia de treino.');
      return;
    }

    // Basic validation
    for (const day of days) {
      if (!day.name.trim()) {
        Alert.alert('Erro', 'Todos os dias devem ter um nome de treino.');
        return;
      }
      if (day.exercises.length === 0) {
        Alert.alert('Erro', `O treino "${day.name}" deve ter pelo menos um exercício.`);
        return;
      }
      for (const ex of day.exercises) {
        if (!ex.name.trim() || !ex.sets || !ex.reps) {
          Alert.alert('Erro', 'Preencha corretamente os dados dos exercícios (nome, séries, repetições).');
          return;
        }
      }
    }

    try {
      setIsSubmitting(true);
      await workoutService.createPlan({
        studentId: targetStudentId,
        name: planName,
        days: days
      });
      
      // Invalidate the dashboard query to show the new workout immediately
      queryClient.invalidateQueries({ queryKey: ['weeklyDashboard'] });
      
      Alert.alert('Sucesso', 'Plano de treino criado com sucesso!');
      router.back();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao salvar o plano.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LinearGradient colors={[Theme.colors.background, Theme.colors.surface]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="close" size={28} color={Theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Criar Plano</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          {user?.role === 'PROFESSOR' ? `Para: ${targetStudentName || 'Aluno'}` : 'Monte sua própria rotina'}
        </Text>

        <Input
          label="Nome do Plano"
          placeholder="Ex: Hipertrofia - Semana 1"
          value={planName}
          onChangeText={setPlanName}
        />

        {days.map((day, dayIndex) => (
          <MotiView
            key={`day-${dayIndex}`}
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 300 }}
          >
            <Card glass style={styles.dayCard}>
              <View style={styles.dayHeader}>
                <View style={styles.daySelector}>
                  {DAYS_OF_WEEK.map(d => (
                    <TouchableOpacity
                      key={d.value}
                      style={[styles.dayBadge, day.dayOfWeek === d.value && styles.dayBadgeSelected]}
                      onPress={() => updateDay(dayIndex, 'dayOfWeek', d.value)}
                    >
                      <Text style={[styles.dayBadgeText, day.dayOfWeek === d.value && styles.dayBadgeTextSelected]}>
                        {d.label.substring(0, 3)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity onPress={() => removeDay(dayIndex)}>
                  <Ionicons name="trash" size={20} color={Theme.colors.accent} />
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.dayNameInput}
                placeholder="Nome do Treino (ex: Peito e Tríceps)"
                placeholderTextColor={Theme.colors.textSecondary}
                value={day.name}
                onChangeText={(val) => updateDay(dayIndex, 'name', val)}
              />

              <View style={styles.exercisesContainer}>
                {day.exercises.map((exercise, exIndex) => (
                  <View key={`ex-${exIndex}`} style={styles.exerciseCard}>
                    <View style={styles.exerciseHeaderRow}>
                      <Text style={styles.exerciseIndex}>{exIndex + 1}.</Text>
                      <TextInput
                        style={styles.exerciseNameInput}
                        placeholder="Nome do Exercício"
                        placeholderTextColor={Theme.colors.textSecondary}
                        value={exercise.name}
                        onChangeText={(val) => updateExercise(dayIndex, exIndex, 'name', val)}
                      />
                      <TouchableOpacity onPress={() => removeExercise(dayIndex, exIndex)}>
                        <Ionicons name="close-circle" size={20} color={Theme.colors.textSecondary} />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.statsRow}>
                      <View style={styles.statInputGroup}>
                        <Text style={styles.statLabel}>Séries</Text>
                        <TextInput
                          style={styles.statInput}
                          keyboardType="numeric"
                          value={exercise.sets.toString()}
                          onChangeText={(val) => updateExercise(dayIndex, exIndex, 'sets', parseInt(val) || 0)}
                        />
                      </View>
                      <View style={styles.statInputGroup}>
                        <Text style={styles.statLabel}>Reps</Text>
                        <TextInput
                          style={styles.statInput}
                          keyboardType="numeric"
                          value={exercise.reps.toString()}
                          onChangeText={(val) => updateExercise(dayIndex, exIndex, 'reps', parseInt(val) || 0)}
                        />
                      </View>
                      <View style={styles.statInputGroup}>
                        <Text style={styles.statLabel}>Carga(kg)</Text>
                        <TextInput
                          style={styles.statInput}
                          keyboardType="numeric"
                          value={(exercise.loadKg || 0).toString()}
                          onChangeText={(val) => updateExercise(dayIndex, exIndex, 'loadKg', parseFloat(val) || 0)}
                        />
                      </View>
                      <View style={styles.statInputGroup}>
                        <Text style={styles.statLabel}>Desc(s)</Text>
                        <TextInput
                          style={styles.statInput}
                          keyboardType="numeric"
                          value={(exercise.restSeconds || 0).toString()}
                          onChangeText={(val) => updateExercise(dayIndex, exIndex, 'restSeconds', parseInt(val) || 0)}
                        />
                      </View>
                    </View>

                    <TextInput
                      style={styles.notesInput}
                      placeholder="Observações adicionais"
                      placeholderTextColor={Theme.colors.textSecondary}
                      value={exercise.notes || ''}
                      onChangeText={(val) => updateExercise(dayIndex, exIndex, 'notes', val)}
                    />
                  </View>
                ))}
              </View>

              <Button 
                title="+ Exercício" 
                variant="outline" 
                onPress={() => addExercise(dayIndex)}
                style={styles.addExerciseBtn}
              />
            </Card>
          </MotiView>
        ))}

        <Button 
          title="+ Adicionar Dia de Treino" 
          variant="secondary" 
          onPress={addDay}
          style={styles.addDayBtn}
        />

        <Button 
          title="Salvar Plano" 
          onPress={handleSubmit}
          isLoading={isSubmitting}
          style={styles.submitBtn}
        />

      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
  },
  backButton: {
    marginRight: Theme.spacing.md,
    padding: Theme.spacing.xs,
  },
  title: {
    fontFamily: Theme.typography.fonts.black,
    fontSize: Theme.typography.sizes.xl,
    color: Theme.colors.text,
  },
  subtitle: {
    fontFamily: Theme.typography.fonts.medium,
    fontSize: Theme.typography.sizes.md,
    color: Theme.colors.primary,
    paddingHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
  },
  scrollContent: {
    paddingHorizontal: Theme.spacing.lg,
    paddingBottom: 100,
  },
  dayCard: {
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
    backgroundColor: 'rgba(26,26,26,0.7)',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  daySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  dayBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
    backgroundColor: Theme.colors.surfaceLight,
  },
  dayBadgeSelected: {
    backgroundColor: Theme.colors.primary,
  },
  dayBadgeText: {
    fontFamily: Theme.typography.fonts.bold,
    fontSize: 10,
    color: Theme.colors.textSecondary,
    textTransform: 'uppercase',
  },
  dayBadgeTextSelected: {
    color: Theme.colors.background,
  },
  dayNameInput: {
    fontFamily: Theme.typography.fonts.bold,
    fontSize: Theme.typography.sizes.lg,
    color: Theme.colors.text,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
    paddingVertical: Theme.spacing.sm,
    marginBottom: Theme.spacing.md,
  },
  exercisesContainer: {
    marginTop: Theme.spacing.sm,
  },
  exerciseCard: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: Theme.borderRadius.sm,
    padding: Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
  },
  exerciseHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  exerciseIndex: {
    fontFamily: Theme.typography.fonts.black,
    color: Theme.colors.primary,
    marginRight: Theme.spacing.xs,
  },
  exerciseNameInput: {
    flex: 1,
    fontFamily: Theme.typography.fonts.medium,
    color: Theme.colors.text,
    fontSize: Theme.typography.sizes.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.sm,
  },
  statInputGroup: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  statLabel: {
    fontFamily: Theme.typography.fonts.medium,
    fontSize: 10,
    color: Theme.colors.textSecondary,
    marginBottom: 2,
  },
  statInput: {
    width: '100%',
    backgroundColor: Theme.colors.surfaceLight,
    borderRadius: 4,
    color: Theme.colors.text,
    textAlign: 'center',
    paddingVertical: 4,
    fontFamily: Theme.typography.fonts.bold,
  },
  notesInput: {
    fontFamily: Theme.typography.fonts.regular,
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.text,
    backgroundColor: Theme.colors.surfaceLight,
    borderRadius: 4,
    padding: Theme.spacing.sm,
  },
  addExerciseBtn: {
    marginTop: Theme.spacing.sm,
    height: 40,
  },
  addDayBtn: {
    marginBottom: Theme.spacing.md,
  },
  submitBtn: {
    marginTop: Theme.spacing.lg,
  }
});

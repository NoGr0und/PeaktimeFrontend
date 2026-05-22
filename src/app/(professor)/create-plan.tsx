import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { YStack, XStack, Text, H2, H3, View, Spinner } from 'tamagui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Head from 'expo-router/head';
import { ChevronLeft, Trash2, Plus, Save, Dumbbell, Calendar, Info, AlertCircle } from '@tamagui/lucide-icons-2';

import { useEnrollment } from '@/hooks/use-enrollment';
import { useWorkouts } from '@/hooks/use-workouts';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { DayOfWeek } from '@/types/workout';

interface LocalExercise {
  name: string;
  sets: string;
  reps: string;
  loadKg: string;
  restSeconds: string;
  notes: string;
}

const DAYS_OF_WEEK: { value: DayOfWeek; label: string }[] = [
  { value: 'MONDAY', label: 'Segunda' },
  { value: 'TUESDAY', label: 'Terça' },
  { value: 'WEDNESDAY', label: 'Quarta' },
  { value: 'THURSDAY', label: 'Quinta' },
  { value: 'FRIDAY', label: 'Sexta' },
  { value: 'SATURDAY', label: 'Sábado' },
  { value: 'SUNDAY', label: 'Domingo' },
];

export default function CreatePlanScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { studentId } = useLocalSearchParams<{ studentId: string }>();

  const { activeStudents, fetchStudents, isLoading: isLoadingEnrollment } = useEnrollment();
  const { createWorkoutPlan, isLoading: isSaving, error: saveError, setError: setSaveError } = useWorkouts();

  // Find student in active list
  useEffect(() => {
    if (activeStudents.length === 0) {
      fetchStudents();
    }
  }, [activeStudents.length, fetchStudents]);

  const enrollment = activeStudents.find((e) => e.studentId === studentId);
  const student = enrollment?.student;
  const studentName = student?.name || 'Aluno';
  const studentEmail = student?.email || '';

  // Form states
  const [planName, setPlanName] = useState('');
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('MONDAY');
  
  // Weekly structure
  const [daysPlans, setDaysPlans] = useState<
    Record<
      DayOfWeek,
      {
        name: string; // Day plan focus, e.g. "Peito e Tríceps"
        exercises: {
          name: string;
          sets: number;
          reps: number;
          loadKg?: number;
          restSeconds?: number;
          notes?: string;
        }[];
      }
    >
  >({
    MONDAY: { name: '', exercises: [] },
    TUESDAY: { name: '', exercises: [] },
    WEDNESDAY: { name: '', exercises: [] },
    THURSDAY: { name: '', exercises: [] },
    FRIDAY: { name: '', exercises: [] },
    SATURDAY: { name: '', exercises: [] },
    SUNDAY: { name: '', exercises: [] },
  });

  // Active exercise form state
  const [exerciseForm, setExerciseForm] = useState<LocalExercise>({
    name: '',
    sets: '',
    reps: '',
    loadKg: '',
    restSeconds: '',
    notes: '',
  });

  const [formError, setFormError] = useState<string | null>(null);

  const handleDayNameChange = (text: string) => {
    setDaysPlans((prev) => ({
      ...prev,
      [selectedDay]: {
        ...prev[selectedDay],
        name: text,
      },
    }));
  };

  const handleAddExercise = () => {
    setFormError(null);

    if (!exerciseForm.name.trim()) {
      setFormError('O nome do exercício é obrigatório.');
      return;
    }

    const setsNum = parseInt(exerciseForm.sets, 10);
    if (isNaN(setsNum) || setsNum <= 0) {
      setFormError('Séries deve ser um número maior que 0.');
      return;
    }

    const repsNum = parseInt(exerciseForm.reps, 10);
    if (isNaN(repsNum) || repsNum <= 0) {
      setFormError('Repetições deve ser um número maior que 0.');
      return;
    }

    const loadNum = exerciseForm.loadKg ? parseFloat(exerciseForm.loadKg) : undefined;
    if (loadNum !== undefined && (isNaN(loadNum) || loadNum < 0)) {
      setFormError('Carga deve ser um número válido e não negativo.');
      return;
    }

    const restNum = exerciseForm.restSeconds ? parseInt(exerciseForm.restSeconds, 10) : undefined;
    if (restNum !== undefined && (isNaN(restNum) || restNum < 0)) {
      setFormError('Descanso deve ser um número inteiro válido.');
      return;
    }

    const newExercise = {
      name: exerciseForm.name.trim(),
      sets: setsNum,
      reps: repsNum,
      loadKg: loadNum,
      restSeconds: restNum,
      notes: exerciseForm.notes.trim() || undefined,
    };

    setDaysPlans((prev) => ({
      ...prev,
      [selectedDay]: {
        ...prev[selectedDay],
        exercises: [...prev[selectedDay].exercises, newExercise],
      },
    }));

    // Reset exercise form
    setExerciseForm({
      name: '',
      sets: '',
      reps: '',
      loadKg: '',
      restSeconds: '',
      notes: '',
    });
  };

  const handleRemoveExercise = (indexToRemove: number) => {
    setDaysPlans((prev) => ({
      ...prev,
      [selectedDay]: {
        ...prev[selectedDay],
        exercises: prev[selectedDay].exercises.filter((_, idx) => idx !== indexToRemove),
      },
    }));
  };

  const handleSavePlan = async () => {
    setSaveError(null);
    setFormError(null);

    if (!planName.trim()) {
      setFormError('Por favor, informe o nome do plano de treino.');
      return;
    }

    // Must have exercises in at least one day
    const hasAnyExercises = Object.values(daysPlans).some((day) => day.exercises.length > 0);
    if (!hasAnyExercises) {
      setFormError('Adicione pelo menos um exercício em algum dia da semana antes de salvar.');
      return;
    }

    const formattedDays = Object.entries(daysPlans)
      .filter(([_, dayData]) => dayData.exercises.length > 0)
      .map(([dayOfWeek, dayData]) => ({
        dayOfWeek: dayOfWeek as DayOfWeek,
        name: dayData.name.trim() || `Treino de ${DAYS_OF_WEEK.find((d) => d.value === dayOfWeek)?.label}`,
        exercises: dayData.exercises.map((ex, index) => ({
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          order: index,
          loadKg: ex.loadKg,
          restSeconds: ex.restSeconds,
          notes: ex.notes,
        })),
      }));

    const payload = {
      studentId,
      name: planName.trim(),
      days: formattedDays,
    };

    try {
      await createWorkoutPlan(payload);
      router.back();
    } catch {
      // Error is handled by useWorkouts hook and displayed in saveError
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <>
      <Head>
        <title>Criar Plano Semanal - Peaktime</title>
        <meta name="description" content="Monte e edite treinos semanais para seus alunos no Peaktime." />
      </Head>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundElement }]} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
        {/* Top Navigation Header */}
        <XStack
          paddingHorizontal="$four"
          paddingVertical="$three"
          alignItems="center"
          justifyContent="space-between"
          backgroundColor="$background"
          borderBottomWidth={1}
          borderColor="$backgroundSelected"
        >
          <XStack alignItems="center" gap="$two">
            <Button
              variant="ghost"
              size="small"
              onPress={() => router.back()}
              accessibilityLabel="Voltar para tela anterior"
              icon={<ChevronLeft size={24} color="#0052cc" />}
              padding={0}
              width={40}
              height={40}
            />
            <H2 fontSize={18} fontWeight="bold" color="$color">
              Montar Plano Semanal
            </H2>
          </XStack>

          <Button
            variant="primary"
            size="small"
            isLoading={isSaving}
            onPress={handleSavePlan}
            icon={<Save size={16} />}
            accessibilityLabel="Salvar plano de treino completo"
          >
            Salvar
          </Button>
        </XStack>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <YStack gap="$four" padding="$four" width="100%">
            {/* Student Info Card */}
            {isLoadingEnrollment ? (
              <Card variant="flat" padding="$three" alignItems="center">
                <Spinner color="$primary" />
              </Card>
            ) : (
              <Card variant="flat" padding="$three" backgroundColor="$background">
                <XStack gap="$three" alignItems="center">
                  <XStack
                    width={44}
                    height={44}
                    borderRadius={22}
                    backgroundColor="$primaryLight"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text color="$primary" fontWeight="bold" fontSize={14}>
                      {getInitials(studentName)}
                    </Text>
                  </XStack>
                  <YStack flex={1}>
                    <Text fontSize={13} color="$textSecondary" fontWeight="600">
                      ALUNO DESTINATÁRIO
                    </Text>
                    <Text fontSize={16} fontWeight="bold" color="$color">
                      {studentName}
                    </Text>
                    {studentEmail ? (
                      <Text fontSize={12} color="$textSecondary">
                        {studentEmail}
                      </Text>
                    ) : null}
                  </YStack>
                </XStack>
              </Card>
            )}

            {/* Error banners */}
            {(formError || saveError) && (
              <XStack
                backgroundColor="#fff2f0"
                borderColor="#ffccc7"
                borderWidth={1}
                borderRadius="$radius.one"
                padding="$three"
                alignItems="center"
                gap="$two"
              >
                <AlertCircle size={18} color="#ff4d4f" />
                <Text fontSize={13} color="#ff4d4f" flex={1}>
                  {formError || saveError}
                </Text>
              </XStack>
            )}

            {/* Plan Config Card */}
            <Card padding="$four" gap="$three" backgroundColor="$background">
              <H3 fontSize={16} fontWeight="700" color="$color">
                Identificação do Plano
              </H3>
              <Input
                label="Nome Geral do Plano"
                placeholder="Ex: Hipertrofia ABC, Emagrecimento, etc."
                value={planName}
                onChangeText={(val) => {
                  setPlanName(val);
                  setFormError(null);
                }}
                accessibilityLabel="Nome geral do plano de treino"
              />
            </Card>

            {/* Days Tabs Header */}
            <YStack gap="$two">
              <Text fontSize={14} fontWeight="600" color="$textSecondary" marginLeft={4}>
                SELECIONE O DIA DA SEMANA
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysScroll}>
                {DAYS_OF_WEEK.map((day) => {
                  const isSelected = selectedDay === day.value;
                  const hasExercises = daysPlans[day.value].exercises.length > 0;
                  return (
                    <Button
                      key={day.value}
                      variant={isSelected ? 'primary' : 'secondary'}
                      size="small"
                      onPress={() => {
                        setSelectedDay(day.value);
                        setFormError(null);
                      }}
                      marginRight={8}
                      borderRadius={20}
                      paddingHorizontal={16}
                      accessibilityLabel={`Ver exercícios de ${day.label}`}
                    >
                      <XStack alignItems="center" gap="$one">
                        <Text color={isSelected ? '#ffffff' : '$primary'} fontWeight="600" fontSize={14}>
                          {day.label}
                        </Text>
                        {hasExercises && (
                          <View
                            width={6}
                            height={6}
                            borderRadius={3}
                            backgroundColor={isSelected ? '#ffffff' : '$primary'}
                          />
                        )}
                      </XStack>
                    </Button>
                  );
                })}
              </ScrollView>
            </YStack>

            {/* Day focus Card */}
            <Card padding="$four" gap="$three" backgroundColor="$background">
              <XStack alignItems="center" gap="$two">
                <Calendar size={18} color="#0052cc" />
                <H3 fontSize={16} fontWeight="700" color="$color">
                  Foco para {DAYS_OF_WEEK.find((d) => d.value === selectedDay)?.label}
                </H3>
              </XStack>
              <Input
                placeholder="Ex: Peito e Tríceps, Cardio e Pernas, Descanso..."
                value={daysPlans[selectedDay].name}
                onChangeText={handleDayNameChange}
                accessibilityLabel={`Foco do treino para ${DAYS_OF_WEEK.find((d) => d.value === selectedDay)?.label}`}
              />
            </Card>

            {/* Added Exercises List */}
            <YStack gap="$two">
              <Text fontSize={14} fontWeight="600" color="$textSecondary" marginLeft={4}>
                EXERCÍCIOS PROGRAMADOS ({daysPlans[selectedDay].exercises.length})
              </Text>
              
              {daysPlans[selectedDay].exercises.length > 0 ? (
                daysPlans[selectedDay].exercises.map((ex, idx) => (
                  <Card key={idx} variant="flat" padding="$three" backgroundColor="$background" marginBottom="$one">
                    <XStack justifyContent="space-between" alignItems="center">
                      <XStack gap="$three" alignItems="center" flex={1}>
                        <XStack
                          width={36}
                          height={36}
                          borderRadius={18}
                          backgroundColor="$primaryLight"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Dumbbell size={16} color="#0052cc" />
                        </XStack>
                        <YStack flex={1} gap="$half">
                          <Text fontSize={15} fontWeight="bold" color="$color">
                            {ex.name}
                          </Text>
                          <XStack gap="$three" flexWrap="wrap">
                            <Text fontSize={12} color="$textSecondary">
                              Séries: <Text fontWeight="600" color="$color">{ex.sets}</Text>
                            </Text>
                            <Text fontSize={12} color="$textSecondary">
                              Reps: <Text fontWeight="600" color="$color">{ex.reps}</Text>
                            </Text>
                            {ex.loadKg !== undefined && (
                              <Text fontSize={12} color="$textSecondary">
                                Carga: <Text fontWeight="600" color="$color">{ex.loadKg} kg</Text>
                              </Text>
                            )}
                            {ex.restSeconds !== undefined && (
                              <Text fontSize={12} color="$textSecondary">
                                Descanso: <Text fontWeight="600" color="$color">{ex.restSeconds}s</Text>
                              </Text>
                            )}
                          </XStack>
                          {ex.notes ? (
                            <XStack gap="$one" alignItems="center" marginTop="$half">
                              <Info size={12} color="$textSecondary" />
                              <Text fontSize={11} color="$textSecondary" fontStyle="italic" numberOfLines={1}>
                                {ex.notes}
                              </Text>
                            </XStack>
                          ) : null}
                        </YStack>
                      </XStack>

                      <Button
                        variant="ghost"
                        size="small"
                        circular
                        onPress={() => handleRemoveExercise(idx)}
                        icon={<Trash2 size={16} color="#ff4d4f" />}
                        accessibilityLabel={`Remover exercício ${ex.name}`}
                      />
                    </XStack>
                  </Card>
                ))
              ) : (
                <Card variant="flat" padding="$four" alignItems="center" justifyContent="center" backgroundColor="$background">
                  <Text fontSize={14} color="$textSecondary" textAlign="center">
                    Nenhum exercício adicionado para este dia da semana.
                  </Text>
                </Card>
              )}
            </YStack>

            {/* Add Exercise Form Card */}
            <Card padding="$four" gap="$four" backgroundColor="$background" elevation={1}>
              <XStack alignItems="center" gap="$two">
                <Plus size={18} color="#0052cc" />
                <H3 fontSize={16} fontWeight="700" color="$color">
                  Adicionar Exercício
                </H3>
              </XStack>

              <YStack gap="$three">
                <Input
                  label="Nome do Exercício"
                  placeholder="Ex: Supino Reto, Leg Press..."
                  value={exerciseForm.name}
                  onChangeText={(val) => setExerciseForm((prev) => ({ ...prev, name: val }))}
                  accessibilityLabel="Nome do exercício"
                />

                <XStack gap="$three">
                  <View flex={1}>
                    <Input
                      label="Séries"
                      placeholder="Ex: 4"
                      keyboardType="numeric"
                      value={exerciseForm.sets}
                      onChangeText={(val) => setExerciseForm((prev) => ({ ...prev, sets: val.replace(/[^0-9]/g, '') }))}
                      accessibilityLabel="Número de séries"
                    />
                  </View>
                  <View flex={1}>
                    <Input
                      label="Repetições"
                      placeholder="Ex: 10"
                      keyboardType="numeric"
                      value={exerciseForm.reps}
                      onChangeText={(val) => setExerciseForm((prev) => ({ ...prev, reps: val.replace(/[^0-9]/g, '') }))}
                      accessibilityLabel="Número de repetições"
                    />
                  </View>
                </XStack>

                <XStack gap="$three">
                  <View flex={1}>
                    <Input
                      label="Carga (kg) - Opcional"
                      placeholder="Ex: 40"
                      keyboardType="numeric"
                      value={exerciseForm.loadKg}
                      onChangeText={(val) => setExerciseForm((prev) => ({ ...prev, loadKg: val.replace(/[^0-9.]/g, '') }))}
                      accessibilityLabel="Carga em quilogramas"
                    />
                  </View>
                  <View flex={1}>
                    <Input
                      label="Descanso (s) - Opcional"
                      placeholder="Ex: 60"
                      keyboardType="numeric"
                      value={exerciseForm.restSeconds}
                      onChangeText={(val) => setExerciseForm((prev) => ({ ...prev, restSeconds: val.replace(/[^0-9]/g, '') }))}
                      accessibilityLabel="Tempo de descanso em segundos"
                    />
                  </View>
                </XStack>

                <Input
                  label="Observações - Opcional"
                  placeholder="Ex: Focar na descida lenta, dropset na última..."
                  value={exerciseForm.notes}
                  onChangeText={(val) => setExerciseForm((prev) => ({ ...prev, notes: val }))}
                  accessibilityLabel="Observações do exercício"
                />

                <Button
                  variant="secondary"
                  onPress={handleAddExercise}
                  icon={<Plus size={16} />}
                  marginTop="$two"
                  accessibilityLabel={`Adicionar exercício ao treino de ${DAYS_OF_WEEK.find((d) => d.value === selectedDay)?.label}`}
                >
                  Adicionar ao Treino
                </Button>
              </YStack>
            </Card>

            {/* Padding bottom */}
            <View height={24} />
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  daysScroll: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
});

import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '../../constants/theme';
import { workoutService, WeeklyDashboardResponse } from '../../services/workoutService';
import { WorkoutList } from '../../components/ui/WorkoutList';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../services/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MotiView, AnimatePresence } from 'moti';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Skeleton } from 'moti/skeleton';
import * as Haptics from 'expo-haptics';
import LottieView from 'lottie-react-native';
import { AnimatedBackground } from '../../components/layout/AnimatedBackground';

const { width } = Dimensions.get('window');

const DAYS_OF_WEEK = [
  { id: 'MONDAY', label: 'Seg', index: 1 },
  { id: 'TUESDAY', label: 'Ter', index: 2 },
  { id: 'WEDNESDAY', label: 'Qua', index: 3 },
  { id: 'THURSDAY', label: 'Qui', index: 4 },
  { id: 'FRIDAY', label: 'Sex', index: 5 },
  { id: 'SATURDAY', label: 'Sáb', index: 6 },
  { id: 'SUNDAY', label: 'Dom', index: 0 },
] as const;

export default function DashboardScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [showSuccessAnim, setShowSuccessAnim] = useState(false);
  
  // Carousel state
  const todayIndex = new Date().getDay();
  const initialDayId = DAYS_OF_WEEK.find(d => d.index === todayIndex)?.id || 'MONDAY';
  const [selectedDay, setSelectedDay] = useState<string>(initialDayId);
  const scrollRef = useRef<ScrollView>(null);

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['weeklyDashboard'],
    queryFn: () => workoutService.getWeeklyDashboard(),
  });

  const completeMutation = useMutation({
    mutationFn: (dayPlanId: string) => workoutService.completeWorkout(dayPlanId, new Date().toISOString()),
    onSuccess: (newCompletion) => {
      queryClient.setQueryData<WeeklyDashboardResponse | null>(['weeklyDashboard'], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          completions: [...oldData.completions, newCompletion],
        };
      });
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      setShowSuccessAnim(true);
      setTimeout(() => setShowSuccessAnim(false), 2500);
    },
    onError: () => {
      Alert.alert('Aviso', 'Este treino já foi concluído hoje, ou houve uma falha.');
    },
    onSettled: () => {
      setCompletingId(null);
    }
  });

  const handleComplete = (dayPlanId: string) => {
    setCompletingId(dayPlanId);
    completeMutation.mutate(dayPlanId);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const streakCount = dashboardData?.completions.length || 0;

  const getWeekDayOrder = (idx: number) => idx === 0 ? 7 : idx;

  const renderDaySelector = () => {
    return (
      <View style={styles.carouselWrapper}>
        <TouchableOpacity 
          style={styles.arrowBtn} 
          onPress={() => scrollRef.current?.scrollTo({ x: 0, animated: true })}
        >
          <Ionicons name="chevron-back" size={24} color={Theme.colors.textSecondary} />
        </TouchableOpacity>

        <View style={styles.carouselContainer}>
          <ScrollView 
            ref={scrollRef}
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContent}
          >
            {DAYS_OF_WEEK.map((dayDef) => {
              const isSelected = selectedDay === dayDef.id;
              const currentOrder = getWeekDayOrder(todayIndex);
              const planOrder = getWeekDayOrder(dayDef.index);
              
              let hasWorkout = false;
              let status = 'PROGRAMADO';
              
              if (dashboardData?.plans) {
                const allDays = dashboardData.plans.flatMap(p => p.days || []);
                const planForDay = allDays.find(d => d && d.dayOfWeek === dayDef.id);
                if (planForDay) {
                  hasWorkout = true;
                  const isCompleted = dashboardData.completions.some(c => c.dayPlanId === planForDay.id);
                  if (isCompleted) status = 'CONCLUIDO';
                  else if (planOrder < currentOrder) status = 'FALTA';
                  else if (planOrder === currentOrder) status = 'HOJE';
                }
              }

              return (
                <TouchableOpacity
                  key={dayDef.id}
                  style={[
                    styles.dayBubble, 
                    isSelected && styles.dayBubbleSelected,
                    planOrder === currentOrder && !isSelected && styles.dayBubbleToday
                  ]}
                  onPress={() => setSelectedDay(dayDef.id)}
                >
                  <Text style={[
                    styles.dayBubbleText, 
                    isSelected && styles.dayBubbleTextSelected
                  ]}>
                    {dayDef.label}
                  </Text>
                  
                  {hasWorkout && (
                    <View style={[
                      styles.statusDot,
                      status === 'CONCLUIDO' && { backgroundColor: Theme.colors.success },
                      status === 'FALTA' && { backgroundColor: Theme.colors.error },
                      status === 'HOJE' && { backgroundColor: Theme.colors.accent },
                      status === 'PROGRAMADO' && { backgroundColor: Theme.colors.primary },
                    ]} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <TouchableOpacity 
          style={styles.arrowBtn} 
          onPress={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          <Ionicons name="chevron-forward" size={24} color={Theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderSelectedDayPlans = () => {
    if (!dashboardData || dashboardData.plans.length === 0) {
      return (
        <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 300 }}>
          <Card glass style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Sem Treinos Ativos</Text>
            <Text style={styles.emptyText}>Você não tem nenhum plano de treino ativo nesta semana. Peça para o seu professor ou monte sua própria rotina!</Text>
            <Button 
              title="Criar Meu Próprio Treino" 
              variant="primary" 
              onPress={() => router.push('/create-workout')} 
              style={{ marginTop: 16 }}
            />
          </Card>
        </MotiView>
      );
    }

    const allDays = dashboardData.plans.flatMap(p => p.days || []);
    const dayPlans = allDays.filter(d => d && d.dayOfWeek === selectedDay);
    
    if (dayPlans.length === 0) {
      return (
        <MotiView key={`empty-${selectedDay}`} from={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card glass style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Descanso</Text>
            <Text style={styles.emptyText}>Nenhum treino programado para este dia. Aproveite para recuperar suas energias!</Text>
          </Card>
        </MotiView>
      );
    }

    const currentOrder = getWeekDayOrder(todayIndex);
    const selectedDef = DAYS_OF_WEEK.find(d => d.id === selectedDay)!;
    const planOrder = getWeekDayOrder(selectedDef.index);

    return (
      <AnimatePresence mode="wait">
        <MotiView
          key={selectedDay}
          from={{ opacity: 0, translateX: 20 }}
          animate={{ opacity: 1, translateX: 0 }}
          exit={{ opacity: 0, translateX: -20 }}
          transition={{ type: 'timing', duration: 300 }}
          style={styles.dayContainer}
        >
          {dayPlans.map(plan => {
            const isCompleted = dashboardData.completions.some(c => c.dayPlanId === plan.id);
            let status = 'PROGRAMADO';
            if (isCompleted) status = 'CONCLUIDO';
            else if (planOrder < currentOrder) status = 'FALTA';
            else if (planOrder === currentOrder) status = 'HOJE';

            return (
              <Card glass key={plan.id!} style={styles.planCard}>
                <View style={styles.planHeaderRow}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  
                  {status === 'CONCLUIDO' && (
                    <View style={[styles.statusBadge, styles.statusSuccess]}>
                      <Text style={styles.statusBadgeTextSuccess}>Concluído</Text>
                    </View>
                  )}
                  {status === 'FALTA' && (
                    <View style={[styles.statusBadge, styles.statusDanger]}>
                      <Text style={styles.statusBadgeTextDanger}>Falta</Text>
                    </View>
                  )}
                  {status === 'HOJE' && (
                    <View style={[styles.statusBadge, styles.statusWarning]}>
                      <Text style={styles.statusBadgeTextWarning}>Hoje</Text>
                    </View>
                  )}
                </View>

                <WorkoutList exercises={plan.exercises} />

                {status === 'HOJE' && (
                  <Button 
                    title="Finalizar Treino" 
                    onPress={() => handleComplete(plan.id!)}
                    isLoading={completingId === plan.id}
                    style={styles.completeBtn}
                  />
                )}
                {status === 'FALTA' && (
                  <Button 
                    title="Marcar como Concluído Atrasado" 
                    variant="outline"
                    onPress={() => handleComplete(plan.id!)}
                    isLoading={completingId === plan.id}
                    style={styles.completeBtn}
                  />
                )}
              </Card>
            );
          })}
        </MotiView>
      </AnimatePresence>
    );
  };

  return (
    <LinearGradient colors={[Theme.colors.background, Theme.colors.surface]} style={styles.container}>
      {/* Animated ECG Pulse Background for Fitness Theme */}
      <AnimatedBackground iconName="weight-lifter" />

      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>{getGreeting()},</Text>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{user?.name?.split(' ')[0]}</Text>
            {streakCount > 0 && (
              <MotiView 
                from={{ scale: 0 }} animate={{ scale: 1 }} 
                transition={{ type: 'spring', damping: 10 }}
                style={styles.streakBadge}
              >
                <Text style={styles.streakIcon}>🔥</Text>
                <Text style={styles.streakText}>{streakCount}</Text>
              </MotiView>
            )}
          </View>
        </View>
        <Button 
          title="+ Criar Treino" 
          variant="outline" 
          onPress={() => router.push('/create-workout')} 
          style={styles.createBtn}
        />
      </View>

      <View>
        {renderDaySelector()}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={{ padding: Theme.spacing.lg }}>
            <Skeleton colorMode="dark" width="100%" height={80} radius={12} />
            <View style={{ height: 16 }} />
            <Skeleton colorMode="dark" width="100%" height={200} radius={12} />
            <View style={{ height: 16 }} />
            <Skeleton colorMode="dark" width="100%" height={60} radius={8} />
          </View>
        ) : (
          <View>
            <View style={styles.weeklyList}>
              {renderSelectedDayPlans()}
            </View>
            
            <TouchableOpacity 
              style={styles.historyButton}
              onPress={() => router.push('/workout-history')}
            >
              <Ionicons name="time-outline" size={24} color={Theme.colors.primary} />
              <Text style={styles.historyButtonText}>Ver Histórico de Treinos Antigos</Text>
              <Ionicons name="chevron-forward" size={20} color={Theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {showSuccessAnim && (
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
          <LottieView
            autoPlay
            loop={false}
            source={{ uri: 'https://lottie.host/80cce22b-2e92-411a-821f-8ba53a8ceb41/LDEs5PZ8Jp.json' }}
            style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)' }}
            onAnimationFinish={() => setShowSuccessAnim(false)}
          />
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: 60,
    paddingBottom: Theme.spacing.md,
  },
  greeting: {
    fontFamily: Theme.typography.fonts.medium,
    fontSize: Theme.typography.sizes.lg,
    color: Theme.colors.textSecondary,
  },
  name: {
    fontFamily: Theme.typography.fonts.black,
    fontSize: Theme.typography.sizes.xxl,
    color: Theme.colors.text,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  streakIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  streakText: {
    fontFamily: Theme.typography.fonts.bold,
    color: '#FF6B6B',
    fontSize: Theme.typography.sizes.sm,
  },
  createBtn: {
    paddingHorizontal: 12,
    height: 36,
    width: 130, // Fixed small width instead of 100%
  },
  carouselWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Theme.spacing.sm,
  },
  arrowBtn: {
    padding: Theme.spacing.sm,
  },
  carouselContainer: {
    maxWidth: (60 * 5) + (12 * 4) + (24 * 2), // 5 bubbles + 4 gaps + padding left/right
  },
  carouselContent: {
    paddingHorizontal: Theme.spacing.lg,
    gap: 12,
    paddingBottom: 8,
  },
  dayBubble: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dayBubbleSelected: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  dayBubbleToday: {
    borderColor: Theme.colors.accent,
  },
  dayBubbleText: {
    fontFamily: Theme.typography.fonts.bold,
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.textSecondary,
  },
  dayBubbleTextSelected: {
    color: Theme.colors.background,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    bottom: 8,
  },
  scrollContent: {
    padding: Theme.spacing.lg,
    paddingBottom: 100, // For TabBar
  },
  loadingContainer: {
    marginTop: Theme.spacing.xxl,
    alignItems: 'center',
  },
  weeklyList: {
    marginTop: Theme.spacing.xs,
  },
  dayContainer: {
    marginBottom: Theme.spacing.xl,
  },
  planCard: {
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  planHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
    paddingBottom: Theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  planName: {
    fontFamily: Theme.typography.fonts.bold,
    fontSize: Theme.typography.sizes.md,
    color: Theme.colors.primary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
  },
  statusSuccess: {
    backgroundColor: 'rgba(0, 230, 118, 0.1)',
    borderColor: Theme.colors.success,
  },
  statusDanger: {
    backgroundColor: 'rgba(255, 82, 82, 0.1)',
    borderColor: Theme.colors.error,
  },
  statusWarning: {
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    borderColor: Theme.colors.accent,
  },
  statusBadgeTextSuccess: {
    fontFamily: Theme.typography.fonts.bold,
    fontSize: 10,
    color: Theme.colors.success,
    textTransform: 'uppercase',
  },
  statusBadgeTextDanger: {
    fontFamily: Theme.typography.fonts.bold,
    fontSize: 10,
    color: Theme.colors.error,
    textTransform: 'uppercase',
  },
  statusBadgeTextWarning: {
    fontFamily: Theme.typography.fonts.bold,
    fontSize: 10,
    color: Theme.colors.accent,
    textTransform: 'uppercase',
  },
  completeBtn: {
    marginTop: Theme.spacing.md,
  },
  emptyCard: {
    padding: Theme.spacing.xl,
    alignItems: 'center',
  },
  emptyTitle: {
    fontFamily: Theme.typography.fonts.black,
    fontSize: Theme.typography.sizes.xl,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
  },
  emptyText: {
    fontFamily: Theme.typography.fonts.regular,
    fontSize: Theme.typography.sizes.md,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.sm,
    marginTop: Theme.spacing.xl,
    marginBottom: Theme.spacing.xl,
  },
  historyButtonText: {
    flex: 1,
    fontFamily: Theme.typography.fonts.bold,
    fontSize: Theme.typography.sizes.md,
    color: Theme.colors.text,
    marginLeft: Theme.spacing.sm,
  }
});

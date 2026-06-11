import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '../constants/theme';
import { workoutService } from '../services/workoutService';
import { WorkoutList } from '../components/ui/WorkoutList';
import { Card } from '../components/ui/Card';
import { useQuery } from '@tanstack/react-query';
import { MotiView } from 'moti';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedBackground } from '../components/layout/AnimatedBackground';

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

export default function StudentWorkoutsScreen() {
  const router = useRouter();
  const { studentId, studentName } = useLocalSearchParams<{ studentId: string, studentName: string }>();
  
  const todayIndex = new Date().getDay();
  const initialDayId = DAYS_OF_WEEK.find(d => d.index === todayIndex)?.id || 'MONDAY';
  const [selectedDay, setSelectedDay] = useState<string>(initialDayId);
  const scrollRef = useRef<ScrollView>(null);

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['studentDashboard', studentId],
    queryFn: () => workoutService.getStudentDashboard(studentId as string),
    enabled: !!studentId,
  });

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
            contentContainerStyle={styles.daysScrollContent}
            snapToInterval={width * 0.15 + Theme.spacing.sm}
            decelerationRate="fast"
          >
            {[...DAYS_OF_WEEK]
              .sort((a, b) => getWeekDayOrder(a.index) - getWeekDayOrder(b.index))
              .map((day) => {
                const isSelected = selectedDay === day.id;
                
                return (
                  <TouchableOpacity
                    key={day.id}
                    onPress={() => setSelectedDay(day.id)}
                    style={{ alignItems: 'center' }}
                  >
                    <MotiView
                      animate={{
                        backgroundColor: isSelected ? Theme.colors.primary : Theme.colors.surfaceLight,
                      }}
                      transition={{ type: 'timing', duration: 200 }}
                      style={styles.dayBubble}
                    >
                      <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>
                        {day.label}
                      </Text>
                    </MotiView>
                    {isSelected && (
                      <MotiView
                        from={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        style={styles.activeDot}
                      />
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

  const allDays = dashboardData?.plans?.flatMap(p => p.days || []) || [];
  const dayPlan = allDays.find(d => d && d.dayOfWeek === selectedDay);

  return (
    <LinearGradient colors={[Theme.colors.background, Theme.colors.surface]} style={styles.container}>
      <AnimatedBackground iconName="barbell" variant="shapes" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.closeBtn} 
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/(professor)/students');
            }
          }}
        >
          <Ionicons name="close" size={24} color={Theme.colors.text} />
        </TouchableOpacity>
        
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{studentName?.charAt(0).toUpperCase()}</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Treinos do Aluno</Text>
          <Text style={styles.subtitle}>{studentName}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {renderDaySelector()}

        <View style={styles.planContainer}>
          {isLoading ? (
            <ActivityIndicator color={Theme.colors.primary} size="large" style={{ marginTop: 40 }} />
          ) : dayPlan ? (
            <MotiView
              key={dayPlan.id}
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 500 }}
            >
              <View style={styles.planHeader}>
                <View style={styles.planTitleRow}>
                  <Text style={styles.planName}>{dayPlan.name}</Text>
                </View>
              </View>

              {dayPlan.exercises.length > 0 ? (
                <WorkoutList exercises={dayPlan.exercises} />
              ) : (
                <Text style={styles.emptyText}>Nenhum exercício cadastrado para este dia.</Text>
              )}
            </MotiView>
          ) : (
            <Card glass style={styles.emptyCard}>
              <View style={styles.emptyIconContainer}>
                <Ionicons name="cafe-outline" size={48} color={Theme.colors.primary} />
              </View>
              <Text style={styles.emptyTitle}>Dia de Descanso</Text>
              <Text style={styles.emptyText}>Os músculos crescem durante o descanso. Aproveite para recuperar as energias hoje!</Text>
            </Card>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: Theme.spacing.md,
    backgroundColor: 'rgba(18,18,18,0.8)',
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  avatarContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarText: {
    fontFamily: Theme.typography.fonts.black,
    fontSize: Theme.typography.sizes.lg,
    color: Theme.colors.background,
  },
  title: {
    fontFamily: Theme.typography.fonts.black,
    fontSize: Theme.typography.sizes.xl,
    color: Theme.colors.text,
  },
  subtitle: {
    fontFamily: Theme.typography.fonts.medium,
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.textSecondary,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  carouselWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Theme.spacing.lg,
  },
  arrowBtn: {
    padding: Theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselContainer: {
    flex: 1,
  },
  daysScrollContent: {
    paddingHorizontal: Theme.spacing.xs,
    paddingVertical: 15,
    gap: Theme.spacing.sm,
  },
  dayBubble: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: (width * 0.15) / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontFamily: Theme.typography.fonts.medium,
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.textSecondary,
  },
  dayTextSelected: {
    color: Theme.colors.background,
    fontFamily: Theme.typography.fonts.black,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Theme.colors.primary,
    marginTop: 4,
  },
  planContainer: {
    paddingHorizontal: Theme.spacing.lg,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.lg,
  },
  planTitleRow: {
    flex: 1,
  },
  planName: {
    fontFamily: Theme.typography.fonts.black,
    fontSize: Theme.typography.sizes.xxl,
    color: Theme.colors.text,
  },
  emptyCard: {
    padding: Theme.spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Theme.spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  emptyIconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 69, 58, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  emptyTitle: {
    fontFamily: Theme.typography.fonts.black,
    fontSize: Theme.typography.sizes.xxl,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    fontFamily: Theme.typography.fonts.regular,
    fontSize: Theme.typography.sizes.md,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: Theme.spacing.md,
  },
});

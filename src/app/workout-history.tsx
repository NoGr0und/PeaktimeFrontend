import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '../constants/theme';
import { Card } from '../components/ui/Card';
import { workoutService, WorkoutHistoryItem } from '../services/workoutService';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MotiView, AnimatePresence } from 'moti';

export default function WorkoutHistoryScreen() {
  const router = useRouter();
  const [history, setHistory] = useState<WorkoutHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function loadHistory() {
      const data = await workoutService.getWorkoutHistory();
      setHistory(data);
      setIsLoading(false);
    }
    loadHistory();
  }, []);

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  return (
    <LinearGradient colors={[Theme.colors.background, Theme.colors.surface]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="close" size={28} color={Theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Histórico de Treinos</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={Theme.colors.primary} size="large" />
          </View>
        ) : history.length === 0 ? (
          <Card glass style={styles.emptyCard}>
            <Ionicons name="calendar-outline" size={48} color={Theme.colors.textSecondary} style={{ marginBottom: 16 }} />
            <Text style={styles.emptyTitle}>Nenhum Treino Concluído</Text>
            <Text style={styles.emptyText}>Você ainda não finalizou nenhum treino. Comece hoje mesmo para construir seu histórico!</Text>
          </Card>
        ) : (
          history.map((item, index) => {
            const isExpanded = expandedId === item.id;
            return (
              <MotiView
                key={item.id}
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: index * 100, type: 'timing', duration: 400 }}
              >
                <Card glass style={styles.historyCard}>
                  <TouchableOpacity 
                    style={styles.cardHeader} 
                    onPress={() => toggleExpand(item.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.cardHeaderLeft}>
                      <View style={styles.dateBadge}>
                        <Ionicons name="checkmark-circle" size={16} color={Theme.colors.primary} />
                      </View>
                      <View>
                        <Text style={styles.dateText}>{formatDate(item.date)}</Text>
                        <Text style={styles.planName}>{item.dayPlan.name}</Text>
                      </View>
                    </View>
                    <Ionicons 
                      name={isExpanded ? "chevron-up" : "chevron-down"} 
                      size={24} 
                      color={Theme.colors.textSecondary} 
                    />
                  </TouchableOpacity>

                  <AnimatePresence>
                    {isExpanded && (
                      <MotiView
                        from={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ type: 'timing', duration: 300 }}
                      >
                        <View style={styles.exercisesList}>
                          <Text style={styles.exercisesTitle}>Exercícios Realizados:</Text>
                          {item.dayPlan.exercises.map((ex, exIndex) => (
                            <View key={ex.id || exIndex} style={styles.exerciseRow}>
                              <Text style={styles.exerciseIndex}>{exIndex + 1}.</Text>
                              <View style={styles.exerciseInfo}>
                                <Text style={styles.exerciseName}>{ex.name}</Text>
                                <View style={styles.exerciseDetails}>
                                  <Text style={styles.detailText}>{ex.sets}x{ex.reps}</Text>
                                  {ex.loadKg ? <Text style={styles.detailText}> • {ex.loadKg}kg</Text> : null}
                                  {ex.restSeconds ? <Text style={styles.detailText}> • {ex.restSeconds}s desc.</Text> : null}
                                </View>
                              </View>
                            </View>
                          ))}
                        </View>
                      </MotiView>
                    )}
                  </AnimatePresence>
                </Card>
              </MotiView>
            );
          })
        )}
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
  scrollContent: {
    paddingHorizontal: Theme.spacing.lg,
    paddingBottom: 100,
  },
  loadingContainer: {
    paddingTop: 100,
    alignItems: 'center',
  },
  emptyCard: {
    alignItems: 'center',
    padding: Theme.spacing.xl,
    marginTop: Theme.spacing.xl,
  },
  emptyTitle: {
    fontFamily: Theme.typography.fonts.bold,
    fontSize: Theme.typography.sizes.lg,
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
  historyCard: {
    marginBottom: Theme.spacing.md,
    backgroundColor: 'rgba(26,26,26,0.8)',
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Theme.spacing.md,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(189,255,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  dateText: {
    fontFamily: Theme.typography.fonts.medium,
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.textSecondary,
    textTransform: 'capitalize',
    marginBottom: 2,
  },
  planName: {
    fontFamily: Theme.typography.fonts.bold,
    fontSize: Theme.typography.sizes.md,
    color: Theme.colors.text,
  },
  exercisesList: {
    paddingHorizontal: Theme.spacing.md,
    paddingBottom: Theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    paddingTop: Theme.spacing.md,
  },
  exercisesTitle: {
    fontFamily: Theme.typography.fonts.bold,
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.primary,
    marginBottom: Theme.spacing.md,
  },
  exerciseRow: {
    flexDirection: 'row',
    marginBottom: Theme.spacing.sm,
  },
  exerciseIndex: {
    fontFamily: Theme.typography.fonts.black,
    fontSize: Theme.typography.sizes.md,
    color: Theme.colors.textSecondary,
    width: 24,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontFamily: Theme.typography.fonts.medium,
    fontSize: Theme.typography.sizes.md,
    color: Theme.colors.text,
    marginBottom: 2,
  },
  exerciseDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontFamily: Theme.typography.fonts.regular,
    fontSize: Theme.typography.sizes.xs,
    color: Theme.colors.textSecondary,
  }
});

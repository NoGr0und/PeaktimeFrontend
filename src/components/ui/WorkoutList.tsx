import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Card } from './Card';
import { Theme } from '../../constants/theme';
import { Exercise } from '../../services/workoutService';

interface WorkoutListProps {
  exercises: Exercise[];
}

export const WorkoutList = ({ exercises }: WorkoutListProps) => {
  return (
    <View style={styles.container}>
      {exercises.sort((a, b) => a.order - b.order).map((exercise, index) => (
        <MotiView
          key={exercise.id || index}
          from={{ opacity: 0, scale: 0.9, translateX: -20 }}
          animate={{ opacity: 1, scale: 1, translateX: 0 }}
          transition={{ type: 'spring', delay: index * 100 }}
        >
          <Card glass style={styles.card}>
            <View style={styles.header}>
              <View style={styles.orderBadge}>
                <Text style={styles.orderText}>{index + 1}</Text>
              </View>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
            </View>
            
            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>SÉRIES</Text>
                <Text style={styles.detailValue}>{exercise.sets}</Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>REPETIÇÕES</Text>
                <Text style={styles.detailValue}>{exercise.reps}</Text>
              </View>
              
              {exercise.loadKg !== undefined && exercise.loadKg !== null && (
                <>
                  <View style={styles.divider} />
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>CARGA</Text>
                    <Text style={styles.detailValue}>{exercise.loadKg}kg</Text>
                  </View>
                </>
              )}

              {exercise.restSeconds !== undefined && exercise.restSeconds !== null && (
                <>
                  <View style={styles.divider} />
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>DESCANSO</Text>
                    <Text style={styles.detailValue}>{exercise.restSeconds}s</Text>
                  </View>
                </>
              )}
            </View>

            {exercise.notes ? (
              <View style={styles.notesContainer}>
                <Text style={styles.notesText}>📝 {exercise.notes}</Text>
              </View>
            ) : null}
          </Card>
        </MotiView>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingBottom: Theme.spacing.xl,
  },
  card: {
    marginBottom: Theme.spacing.md,
    padding: Theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  orderBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.sm,
  },
  orderText: {
    fontFamily: Theme.typography.fonts.black,
    color: Theme.colors.background,
    fontSize: Theme.typography.sizes.sm,
  },
  exerciseName: {
    fontFamily: Theme.typography.fonts.bold,
    color: Theme.colors.text,
    fontSize: Theme.typography.sizes.md,
    flex: 1,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: Theme.borderRadius.sm,
    padding: Theme.spacing.sm,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontFamily: Theme.typography.fonts.medium,
    color: Theme.colors.textSecondary,
    fontSize: 10,
    marginBottom: 4,
  },
  detailValue: {
    fontFamily: Theme.typography.fonts.black,
    color: Theme.colors.text,
    fontSize: Theme.typography.sizes.md,
  },
  divider: {
    width: 1,
    height: '80%',
    backgroundColor: Theme.colors.border,
  },
  notesContainer: {
    marginTop: Theme.spacing.sm,
    paddingTop: Theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  notesText: {
    fontFamily: Theme.typography.fonts.regular,
    color: Theme.colors.secondary,
    fontSize: Theme.typography.sizes.sm,
    fontStyle: 'italic',
  }
});

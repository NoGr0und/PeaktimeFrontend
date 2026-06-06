import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../../constants/theme';
import { OccupancyLevel, OccupancyReading } from '../../types/occupancy';

interface OccupancyCardProps {
  reading: OccupancyReading;
}

const getLevelConfig = (level: OccupancyLevel) => {
  switch (level) {
    case 'EMPTY':
      return { text: 'Vazio', color: Theme.colors.occupancy.empty, icon: 'snow-outline' as const };
    case 'QUIET':
      return { text: 'Tranquilo', color: Theme.colors.occupancy.quiet, icon: 'leaf-outline' as const };
    case 'MODERATE':
      return { text: 'Moderado', color: Theme.colors.occupancy.moderate, icon: 'people-outline' as const };
    case 'BUSY':
      return { text: 'Cheio', color: Theme.colors.occupancy.busy, icon: 'flame-outline' as const };
    case 'FULL':
      return { text: 'Lotado', color: Theme.colors.occupancy.full, icon: 'alert-circle-outline' as const };
    default:
      return { text: 'Desconhecido', color: Theme.colors.textSecondary, icon: 'help-outline' as const };
  }
};

export const OccupancyCard: React.FC<OccupancyCardProps> = ({ reading }) => {
  const config = getLevelConfig(reading.level);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${config.color}20` }]}>
          <Ionicons name={config.icon} size={24} color={config.color} />
        </View>
        <Text style={[styles.levelText, { color: config.color }]}>{config.text}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.mainInfo}>
          <Text style={styles.countText}>{reading.count}</Text>
          <Text style={styles.label}>Pessoas agora</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.secondaryInfo}>
          <Text style={styles.percentageText}>{reading.percentage}%</Text>
          <Text style={styles.label}>Capacidade</Text>
        </View>
      </View>
      
      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBar, 
            { width: `${Math.min(reading.percentage, 100)}%`, backgroundColor: config.color }
          ]} 
        />
      </View>
      <Text style={styles.timeText}>
        Última atualização: {new Date(reading.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  levelText: {
    fontFamily: Theme.typography.fonts.bold,
    fontSize: 18,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  mainInfo: {
    flex: 1,
  },
  secondaryInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: Theme.colors.border,
    marginHorizontal: Theme.spacing.lg,
  },
  countText: {
    fontFamily: Theme.typography.fonts.bold,
    fontSize: 36,
    color: Theme.colors.text,
  },
  percentageText: {
    fontFamily: Theme.typography.fonts.bold,
    fontSize: 32,
    color: Theme.colors.text,
  },
  label: {
    fontFamily: Theme.typography.fonts.regular,
    fontSize: 14,
    color: Theme.colors.textSecondary,
    marginTop: -4,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: Theme.colors.surfaceLight,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: Theme.spacing.md,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  timeText: {
    fontFamily: Theme.typography.fonts.regular,
    fontSize: 12,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
  }
});

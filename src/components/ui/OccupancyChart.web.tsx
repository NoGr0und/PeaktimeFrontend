import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../../constants/theme';
import { OccupancyHistoryResponse } from '../../types/occupancy';

interface OccupancyChartProps {
  data: OccupancyHistoryResponse | null;
}

export const OccupancyChart: React.FC<OccupancyChartProps> = ({ data }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Hoje</Text>
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Gráfico de linha indisponível na versão Web.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  title: {
    fontFamily: Theme.typography.fonts.bold,
    fontSize: 16,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.lg,
  },
  emptyContainer: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.lg,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  emptyText: {
    fontFamily: Theme.typography.fonts.regular,
    color: Theme.colors.textSecondary,
    fontSize: 14,
  }
});

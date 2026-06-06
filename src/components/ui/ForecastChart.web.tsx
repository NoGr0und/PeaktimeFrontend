import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../../constants/theme';
import { OccupancyForecastResponse } from '../../types/occupancy';

interface ForecastChartProps {
  data: OccupancyForecastResponse | null;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({ data }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Previsão (Próximas Horas)</Text>
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Gráfico de barras indisponível na versão Web.</Text>
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

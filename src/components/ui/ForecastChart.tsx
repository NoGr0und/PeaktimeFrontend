import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { Theme } from '../../constants/theme';
import { OccupancyForecastResponse } from '../../types/occupancy';

interface ForecastChartProps {
  data: OccupancyForecastResponse | null;
}

const screenWidth = Dimensions.get('window').width;

export const ForecastChart: React.FC<ForecastChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data || !data.forecast) return [];
    
    // Pegar apenas as próximas 6 horas (ou quantas houver)
    const nextHours = data.forecast.slice(0, 6);
    
    return nextHours.map((reading) => {
      let color = Theme.colors.occupancy.empty;
      
      if (reading.percentage > 85) color = Theme.colors.occupancy.full;
      else if (reading.percentage > 60) color = Theme.colors.occupancy.busy;
      else if (reading.percentage > 35) color = Theme.colors.occupancy.moderate;
      else if (reading.percentage > 15) color = Theme.colors.occupancy.quiet;

      return {
        value: reading.avgCount,
        label: `${reading.hour}h`,
        frontColor: color,
      };
    });
  }, [data]);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Previsão (Próximas Horas)</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Gráfico de barras indisponível na Web.</Text>
        </View>
      </View>
    );
  }

  if (!data || chartData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Sem previsão disponível.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Previsão (Próximas Horas)</Text>
      <View style={styles.chartWrapper}>
        <BarChart
          data={chartData}
          width={screenWidth - 80}
          height={180}
          barWidth={22}
          spacing={28}
          initialSpacing={10}
          yAxisTextStyle={{ color: Theme.colors.textSecondary, fontSize: 10 }}
          xAxisLabelTextStyle={{ color: Theme.colors.textSecondary, fontSize: 10 }}
          yAxisColor={Theme.colors.border}
          xAxisColor={Theme.colors.border}
          hideRules
          barBorderRadius={4}
          isAnimated
          maxValue={data.capacity}
          noOfSections={4}
        />
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
  chartWrapper: {
    alignItems: 'center',
    marginLeft: -10,
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

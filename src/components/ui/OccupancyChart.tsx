import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { Theme } from '../../constants/theme';
import { OccupancyHistoryResponse } from '../../types/occupancy';

interface OccupancyChartProps {
  data: OccupancyHistoryResponse | null;
}

const screenWidth = Dimensions.get('window').width;

export const OccupancyChart: React.FC<OccupancyChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data || !data.readings) return [];
    
    return data.readings.map((reading) => {
      const percentage = (reading.count / data.capacity) * 100;
      let color = Theme.colors.occupancy.empty;
      
      if (percentage > 85) color = Theme.colors.occupancy.full;
      else if (percentage > 60) color = Theme.colors.occupancy.busy;
      else if (percentage > 35) color = Theme.colors.occupancy.moderate;
      else if (percentage > 15) color = Theme.colors.occupancy.quiet;

      return {
        value: reading.count,
        label: `${reading.hour}h`,
        dataPointColor: color,
        textColor: Theme.colors.textSecondary,
      };
    });
  }, [data]);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Histórico de Hoje</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Gráfico de linha indisponível na Web.</Text>
        </View>
      </View>
    );
  }

  if (!data || chartData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Sem dados históricos para hoje.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Hoje</Text>
      <View style={styles.chartWrapper}>
        <LineChart
          data={chartData}
          width={screenWidth - 80}
          height={200}
          spacing={40}
          initialSpacing={10}
          color={Theme.colors.primary}
          thickness={3}
          hideRules
          yAxisTextStyle={{ color: Theme.colors.textSecondary, fontSize: 10 }}
          xAxisLabelTextStyle={{ color: Theme.colors.textSecondary, fontSize: 10 }}
          yAxisColor={Theme.colors.border}
          xAxisColor={Theme.colors.border}
          dataPointsRadius={4}
          isAnimated
          curved
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
    marginLeft: -10, // Adjust to fit y-axis labels
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

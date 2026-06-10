import React, { useMemo } from 'react';
import { Dimensions, Platform, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts'; // Mudamos de BarChart para LineChart
import { Theme } from '../../constants/theme';
import { OccupancyForecastResponse } from '../../types/occupancy';

interface ForecastChartProps {
  data: OccupancyForecastResponse | null;
}

const screenWidth = Dimensions.get('window').width;

export const ForecastChart: React.FC<ForecastChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data || !data.forecast) return [];
    
    // Pegar as próximas horas configuradas
    const nextHours = data.forecast.slice(0, 6);
    
    return nextHours.map((reading) => {
      return {
        value: reading.avgCount,
        label: `${reading.hour}h`,
        // Configuração visual dos pontos flutuantes da linha
        dataPointColor: Theme.colors.primary,
        dataPointRadius: 4,
      };
    });
  }, [data]);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Previsão (Próximas Horas)</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Gráfico de linha indisponível na Web.</Text>
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
        <LineChart
          data={chartData}
          width={screenWidth - 80}
          height={180}
          color={Theme.colors.primary} // Cor da linha principal
          thickness={3}               // Espessura da linha
          curved                      // Deixa a linha suave/ondulada igual ao de cima
          yAxisTextStyle={{ color: Theme.colors.textSecondary, fontSize: 10 }}
          xAxisLabelTextStyle={{ color: Theme.colors.textSecondary, fontSize: 10 }}
          yAxisColor={Theme.colors.border}
          xAxisColor={Theme.colors.border}
          hideRules
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
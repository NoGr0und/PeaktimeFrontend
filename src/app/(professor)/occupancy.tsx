import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../../constants/theme';
import { OccupancyCard } from '../../components/ui/OccupancyCard';
import { OccupancyLegend } from '../../components/ui/OccupancyLegend';
import { OccupancyChart } from '../../components/ui/OccupancyChart';
import { ForecastChart } from '../../components/ui/ForecastChart';
import { OccupancyService } from '../../services/occupancyService';
import { OccupancyReading, OccupancyHistoryResponse, OccupancyForecastResponse } from '../../types/occupancy';
import { Ionicons } from '@expo/vector-icons';

export default function ProfessorOccupancyScreen() {
  const [currentReading, setCurrentReading] = useState<OccupancyReading | null>(null);
  const [history, setHistory] = useState<OccupancyHistoryResponse | null>(null);
  const [forecast, setForecast] = useState<OccupancyForecastResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCurrentOccupancy = async () => {
    try {
      const [current, hist, fore] = await Promise.all([
        OccupancyService.getCurrent(),
        OccupancyService.getHistory(),
        OccupancyService.getForecast()
      ]);
      setCurrentReading(current);
      setHistory(hist);
      setForecast(fore);
    } catch (error) {
      console.error('Error fetching occupancy:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCurrentOccupancy();
    // T018: Implementar polling automático a cada 30 segundos
    const interval = setInterval(() => {
      fetchCurrentOccupancy();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCurrentOccupancy();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Theme.colors.primary} />}
      >
        <View style={styles.header}>
          <Ionicons name="bar-chart-outline" size={28} color={Theme.colors.primary} />
          <Text style={styles.headerTitle}>Ocupação da Academia</Text>
        </View>

        {loading && !currentReading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Carregando dados de ocupação...</Text>
          </View>
        ) : currentReading ? (
          <View style={styles.cardContainer}>
            <Text style={styles.sectionTitle}>Tempo Real</Text>
            <OccupancyCard reading={currentReading} />
            <OccupancyLegend />
            <View style={{ marginTop: 24 }}>
              <OccupancyChart data={history} />
            </View>
            <View style={{ marginTop: 8 }}>
              <ForecastChart data={forecast} />
            </View>
          </View>
        ) : (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Não foi possível carregar os dados no momento.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  container: {
    flexGrow: 1,
    padding: Theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.xl,
  },
  headerTitle: {
    fontFamily: Theme.typography.fonts.bold,
    fontSize: 24,
    color: Theme.colors.text,
    marginLeft: Theme.spacing.md,
  },
  cardContainer: {
    marginBottom: Theme.spacing.xl,
  },
  sectionTitle: {
    fontFamily: Theme.typography.fonts.bold,
    fontSize: 18,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  loadingText: {
    fontFamily: Theme.typography.fonts.regular,
    color: Theme.colors.textSecondary,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.xl,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
  },
  errorText: {
    fontFamily: Theme.typography.fonts.regular,
    color: Theme.colors.error,
    textAlign: 'center',
  }
});

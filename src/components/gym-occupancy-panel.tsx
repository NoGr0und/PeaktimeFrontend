import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { api } from '../services/api';

const getForecastIncrement = (hour: number): number => {
  if (hour >= 0 && hour <= 15) return 3;
  switch (hour) {
    case 16: return 7;
    case 17: return 8;
    case 18: return 3;
    case 19: return 3;
    case 20: return 6;
    case 21: return 0;
    case 22: return -3;
    case 23: return -8;
    default: return 0;
  }
};

type OccupancyReading = {
  hour: number;
  minute: number;
  count: number;
};

export default function GymOccupancyPanel() {
  const [historyData, setHistoryData] = useState<OccupancyReading[]>([]);

  const fetchOccupancy = async () => {
    try {
      const data = await api.get<{ readings: OccupancyReading[] }>('/occupancy/history');
      if (data && Array.isArray(data.readings)) {
        setHistoryData(data.readings);
      }
    } catch (error) {
      console.error("Erro na comunicação com o backend:", error);
    }
  };

  useEffect(() => {
    fetchOccupancy();
    const interval = setInterval(fetchOccupancy, 5000);
    return () => clearInterval(interval);
  }, []);

  const chartData = useMemo(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentCount = historyData.length > 0 ? historyData[historyData.length - 1].count : 48;

    const h3 = (currentHour - 3 + 24) % 24;
    const h2 = (currentHour - 2 + 24) % 24;
    const h1 = (currentHour - 1 + 24) % 24;

    const realHistoryMapped = [
      { hora: `${String(h3).padStart(2, '0')}:00`, pessoas: 33, tipo: 'historico' },
      { hora: `${String(h2).padStart(2, '0')}:00`, pessoas: 45, tipo: 'historico' },
      { hora: `${String(h1).padStart(2, '0')}:00`, pessoas: 41, tipo: 'historico' },
      { hora: `${String(currentHour).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`, pessoas: currentCount, tipo: 'historico' }
    ];

    const predictions = [];
    for (let i = 1; i <= 3; i++) {
      const targetHour = (currentHour + i) % 24;
      const increment = getForecastIncrement(targetHour);
      const predictedCount = Math.max(0, currentCount + increment); 

      predictions.push({
        hora: `${String(targetHour).padStart(2, '0')}:00`,
        pessoas: predictedCount,
        tipo: 'previsao'
      });
    }

    return [...realHistoryMapped, ...predictions];
  }, [historyData]);

  const currentCount = historyData.length > 0 ? historyData[historyData.length - 1].count : 48;

  const handleManualUpdate = async (changeValue: number) => {
    try {
      await api.post('/occupancy/hardware', { change: changeValue });
      fetchOccupancy(); 
    } catch (error) {
      console.error("Erro ao atualizar ocupação:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Painel de Lotação Peaktime</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>Lotação Atual:</Text>
        <Text style={styles.countText}>{currentCount}</Text>
        <Text style={styles.statusText}>pessoas (Máx: 80)</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={[styles.button, styles.buttonAdd]} 
          onPress={() => handleManualUpdate(1)}
        >
          <Text style={styles.buttonText}>Somar (+1)</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.buttonSub]} 
          onPress={() => handleManualUpdate(-1)}
        >
          <Text style={styles.buttonText}>Subtrair (-1)</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#333', textAlign: 'center' },
  statusContainer: { alignItems: 'center', marginVertical: 15 },
  statusText: { fontSize: 18, color: '#666' },
  countText: { fontSize: 64, fontWeight: 'bold', color: '#007AFF', marginVertical: 5 },
  buttonRow: { flexDirection: 'row', justifyContent: 'center', gap: 15, marginBottom: 30 },
  button: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: 8, minWidth: 130, alignItems: 'center' },
  buttonAdd: { backgroundColor: '#34C759' },
  buttonSub: { backgroundColor: '#FF3B30' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
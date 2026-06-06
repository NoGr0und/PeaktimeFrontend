import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../../constants/theme';

const legendItems = [
  { label: 'Vazio', color: Theme.colors.occupancy.empty },
  { label: 'Tranquilo', color: Theme.colors.occupancy.quiet },
  { label: 'Moderado', color: Theme.colors.occupancy.moderate },
  { label: 'Cheio', color: Theme.colors.occupancy.busy },
  { label: 'Lotado', color: Theme.colors.occupancy.full },
];

export const OccupancyLegend: React.FC = () => {
  return (
    <View style={styles.container}>
      {legendItems.map((item, index) => (
        <View key={index} style={styles.item}>
          <View style={[styles.dot, { backgroundColor: item.color }]} />
          <Text style={styles.label}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Theme.spacing.md,
    marginTop: Theme.spacing.md,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  label: {
    fontFamily: Theme.typography.fonts.regular,
    fontSize: 12,
    color: Theme.colors.textSecondary,
  },
});

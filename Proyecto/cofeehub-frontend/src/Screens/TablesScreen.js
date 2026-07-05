import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from '../Components/Icon';
import colors from '../Styles/colors';

// mesas de prueba, sin datos reales
const MESAS_DEMO = [
  { id: 1, available: true }, { id: 2, available: true }, { id: 3, available: true },
  { id: 4, available: true }, { id: 5, available: false }, { id: 6, available: true },
  { id: 7, available: false }, { id: 8, available: false }, { id: 9, available: true },
  { id: 10, available: true }, { id: 11, available: true }, { id: 12, available: true },
];

const TablesScreen = ({ onNavigate, onSelectTable }) => {
  const [selected, setSelected] = useState(null);
  const [tables] = useState(MESAS_DEMO);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => onNavigate('home')}>
          <Icon name="arrow-back" size={20} color='#fffffff5' />
        </TouchableOpacity>
        <Text style={styles.title}>Seleccionar Mesa</Text>
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#4CAF50' }]} />
          <Text style={styles.legendText}>Disponible</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#e44242e7' }]} />
          <Text style={styles.legendText}>Ocupada</Text>
        </View>
      </View>

      <View style={styles.grid}>
        {tables.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={[
              styles.tableCard,
              !t.available && styles.tableOccupied,
              selected === t.id && styles.tableSelected,
            ]}
            disabled={!t.available}
            onPress={() => setSelected(t.id)}
          >
            <Icon
              name="table-restaurant"
              size={24}
              color={
                !t.available
                  ? '#4e0b0be7'
                  : selected === t.id
                  ? '#105a12'
                  : '#96d198'
              }
            />
            <Text
              style={[
                styles.tableNumber,
                !t.available && styles.tableNumberOccupied,
                selected === t.id && styles.tableNumberSelected,
              ]}
            >
              Mesa {t.id}
            </Text>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: !t.available ? '#5e0c0ce7' : '#156e18' },
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, !selected && styles.continueDisabled]}
          disabled={!selected}
          onPress={() => selected && onSelectTable(selected)}
        >
          <Text style={styles.continueText}>
            {selected ? `Continuar con Mesa ${selected}` : 'Selecciona una mesa'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
  },
  legend: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  tableCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#4CAF50',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 2,
    borderColor: 'rgba(76,175,80,0.3)',
  },
  tableOccupied: {
    backgroundColor: '#ad1607',
    borderColor: 'transparent',
    opacity: 1.0,
  },
  tableSelected: {
    backgroundColor: '#8ece91',
    borderColor: 'transparent',
  },
  tableNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 4,
  },
  tableNumberOccupied: {
    color: '#f5f0f0',
  },
  tableNumberSelected: {
    color: '#101110',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  continueButton: {
    backgroundColor: '#f3af4a',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueDisabled: {
    backgroundColor: '#f3af4a',
  },
  continueText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default TablesScreen;
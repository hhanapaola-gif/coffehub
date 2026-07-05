import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from '../Components/Icon';
import BottomNav from '../Components/BottomNav';
import colors from '../Styles/colors';
import { getInventario } from '../Services/api';

const IngredientsScreen = ({ onNavigate, onOpenMenu, token }) => {
  const [ingredientes, setIngredientes] = useState([]);

  useEffect(() => {
    getInventario(token)
      .then(setIngredientes)
      .catch(() => {});
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={[styles.iconBox, { backgroundColor: item.alerta ? '#FFEBEE' : '#E8F5E9' }]}>
        <Icon name={item.alerta ? 'warning' : 'check-circle'} size={20} color={item.alerta ? '#E53935' : '#4CAF50'} />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{item.nombre}</Text>
        <Text style={styles.qty}>
          Stock actual: <Text style={[styles.qtyValue, { color: item.alerta ? '#E53935' : '#4CAF50' }]}>{item.stock_actual} {item.unidad_medida}</Text>
        </Text>
      </View>
      {item.alerta && (
        <View style={styles.alertBadge}>
          <Text style={styles.alertText}>Bajo</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.menuButton} onPress={onOpenMenu}>
            <Icon name="menu" size={20} color='#ccbeb1' />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Ingredientes</Text>
            <Text style={styles.sub}>Stock requerido para hoy</Text>
          </View>
        </View>
      </View>
      <FlatList
        data={ingredientes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
      <BottomNav active="ingredients" onNavigate={onNavigate} role="kitchen" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  sub: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  list: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 80,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  qty: {
    fontSize: 12,
    color: '#000',
    marginTop: 2,
  },
  qtyValue: {
    fontWeight: '600',
  },
  alertBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor:colors.alert,
  },
  alertText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.error,
  },
});

export default IngredientsScreen;
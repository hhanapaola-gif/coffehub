import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from './Icon';
import colors from '../Styles/colors';

const BottomNav = ({ active, onNavigate, role }) => {
  const waiterTabs = [
    { icon: 'home', label: 'Inicio', screen: 'home' },
    { icon: 'receipt', label: 'Pedido', screen: 'order-summary' },
    { icon: 'table-restaurant', label: 'Mesas', screen: 'tables' },
    { icon: 'percent', label: 'Promos', screen: 'promotions' },
  ];
  const kitchenTabs = [
    { icon: 'restaurant', label: 'Órdenes', screen: 'kitchen' },
    { icon: 'inventory', label: 'Ingredientes', screen: 'ingredients' },
  ];
  const cashierTabs = [
    { icon: 'payments', label: 'Cobros', screen: 'cashier' },
    { icon: 'money-off', label: 'Gastos', screen: 'cashier-expenses' },
    { icon: 'receipt', label: 'Historial', screen: 'cashier-history' },
  ];
  const adminTabs = [
    { icon: 'dashboard', label: 'Dashboard', screen: 'admin-dashboard' },
    { icon: 'people', label: 'Usuarios', screen: 'admin-usuarios' },
    { icon: 'restaurant-menu', label: 'Menú', screen: 'admin-menu' },
    { icon: 'inventory', label: 'Inventario', screen: 'admin-inventario' },
  ];

  let tabs;
  if (role === 'kitchen') {
    tabs = kitchenTabs;
  } else if (role === 'cashier') {
    tabs = cashierTabs;
  } else if (role === 'admin') {
    tabs = adminTabs;
  } else {
    tabs = waiterTabs;
  }

  return (
    <View style={styles.container}>
      {tabs.map((t) => {
        const isActive = active === t.screen;
        return (
          <TouchableOpacity
            key={t.label}
            style={styles.tab}
            onPress={() => onNavigate(t.screen)}
          >
            <Icon
              name={t.icon}
              size={22}
              color={isActive ? '#f3af4a' : colors.textSecondary}
            />
            <Text
              style={[
                styles.label,
                { color: isActive ? '#f3af4a' : colors.textSecondary },
              ]}
            >
              {t.label}
            </Text>
            {isActive && <View style={styles.dot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: 8,
    height: 68,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    position: 'relative',
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  dot: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
});

export default BottomNav;
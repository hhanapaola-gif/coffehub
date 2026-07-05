import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import Icon from './Icon';
import colors from '../Styles/colors';

const MENUS = {
  waiter: [
    { icon: 'home', label: 'Inicio', screen: 'home' },
    { icon: 'table-restaurant', label: 'Mesas', screen: 'tables' },
    { icon: 'receipt', label: 'Mi pedido', screen: 'order-summary' },
    { icon: 'percent', label: 'Promociones', screen: 'promotions' },
  ],
  kitchen: [
    { icon: 'restaurant', label: 'Pedidos activos', screen: 'kitchen' },
    { icon: 'inventory', label: 'Ingredientes', screen: 'ingredients' },
  ],
  cashier: [
    { icon: 'payments', label: 'Cobros', screen: 'cashier' },
    { icon: 'money-off', label: 'Gastos', screen: 'cashier-expenses' },
    { icon: 'receipt', label: 'Historial', screen: 'cashier-history' },
  ],
};

const ROL_LABEL = { waiter: 'Mesero', kitchen: 'Cocina', cashier: 'Cajero', admin: 'Administrador' };

const SideMenu = ({ visible, onClose, role, userName, onNavigate, onLogout }) => {
  const items = MENUS[role] || [];

  const handleNavigate = (screen) => {
    onClose();
    onNavigate(screen);
  };

  const handleLogout = () => {
    onClose();
    onLogout();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose} />
      <View style={styles.panel}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Icon name="person" size={24} color="#fff" />
          </View>
          <View>
            <Text style={styles.name}>{userName || 'Usuario'}</Text>
            <Text style={styles.role}>{ROL_LABEL[role] || ''}</Text>
          </View>
        </View>

        <View style={styles.items}>
          {items.map((item) => (
            <TouchableOpacity key={item.screen} style={styles.item} onPress={() => handleNavigate(item.screen)}>
              <Icon name={item.icon} size={20} color={colors.textPrimary} />
              <Text style={styles.itemText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={20} color={colors.error} />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  panel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: '78%',
    maxWidth: 320,
    backgroundColor: colors.background,
    paddingTop: 56,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  name: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  role: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  items: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  itemText: {
    marginLeft: 16,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 32,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  logoutText: {
    marginLeft: 16,
    fontSize: 14,
    fontWeight: '700',
    color: colors.error,
  },
});

export default SideMenu;

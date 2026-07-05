import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Icon from '../Components/Icon';
import BottomNav from '../Components/BottomNav';
import colors from '../Styles/colors';
import { getPedidosListos } from '../Services/api';

const CashierScreen = ({ onNavigate, onOpenMenu, token }) => {
  const [orders, setOrders] = useState([]);

  const cargarPedidos = () => {
    getPedidosListos(token)
      .then(setOrders)
      .catch(() => {});
  };

  useEffect(() => {
    cargarPedidos();
    const intervalo = setInterval(cargarPedidos, 10000);
    return () => clearInterval(intervalo);
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.orderId}>Pedido #{item.folio}</Text>
          <Text style={styles.orderMeta}>
            Mesa {item.id_mesa || '-'} · {item.detalles.length} productos
          </Text>
        </View>
        <Text style={styles.total}>${item.total}</Text>
      </View>
      <TouchableOpacity
        style={styles.payButton}
        onPress={() => onNavigate('payment-detail', item)}
      >
        <Text style={styles.payText}>Cobrar</Text>
      </TouchableOpacity>
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
            <Text style={styles.title}>Cobros Pendientes</Text>
            <Text style={styles.sub}>{orders.length} pedidos por cobrar</Text>
          </View>
        </View>
      </View>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
      <BottomNav active="cashier" onNavigate={onNavigate} role="cashier" />
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
  },
  orderMeta: {
    fontSize: 12,
    color: '#000',
    marginTop: 2,
  },
  total: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.secondary,
  },
  payButton: {
    backgroundColor: colors.naranja,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  payText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default CashierScreen;
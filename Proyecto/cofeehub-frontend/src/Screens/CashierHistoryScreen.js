import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from '../Components/Icon';
import BottomNav from '../Components/BottomNav';
import colors from '../Styles/colors';

const ICONOS_METODO = {
  Efectivo: 'payments',
  Tarjeta: 'credit-card',
  Transferencia: 'phone-android',
  Otro: 'more-horiz',
};

// datos fijos, solo para que se vea la lista
const PAGOS_DEMO = [
  {
    id: 1, folio: '1000', id_mesa: 7, monto: 81,
    metodo: { nombre: 'Efectivo' },
    fecha_pago: new Date(Date.now() - 3 * 3600000).toISOString(),
  },
  {
    id: 2, folio: '0999', id_mesa: 4, monto: 154,
    metodo: { nombre: 'Tarjeta' },
    fecha_pago: new Date(Date.now() - 26 * 3600000).toISOString(),
  },
];

const CashierHistoryScreen = ({ onNavigate, onOpenMenu }) => {
  const [pagos] = useState(PAGOS_DEMO);

  const renderItem = ({ item }) => {
    const fecha = new Date(item.fecha_pago).toLocaleString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
    return (
      <View style={styles.card}>
        <View style={styles.iconBox}>
          <Icon name={ICONOS_METODO[item.metodo.nombre] || 'payments'} size={20} color={colors.naranja} />
        </View>
        <View style={styles.info}>
          <Text style={styles.folio}>Pedido #{item.folio} · Mesa {item.id_mesa || '-'}</Text>
          <Text style={styles.meta}>{item.metodo.nombre} · {fecha}</Text>
        </View>
        <Text style={styles.monto}>${Number(item.monto).toFixed(2)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.menuButton} onPress={onOpenMenu}>
            <Icon name="menu" size={20} color='#ccbeb1' />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Historial de Cobros</Text>
            <Text style={styles.sub}>{pagos.length} pago{pagos.length !== 1 ? 's' : ''} registrado{pagos.length !== 1 ? 's' : ''}</Text>
          </View>
        </View>
      </View>

      {pagos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="receipt-long" size={48} color="#D9C7A3" />
          <Text style={styles.emptyText}>Aún no hay pagos registrados</Text>
        </View>
      ) : (
        <FlatList
          data={pagos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      <BottomNav active="cashier-history" onNavigate={onNavigate} role="cashier" />
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
    padding: 14,
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
    backgroundColor: '#F0EBE3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  folio: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  meta: {
    fontSize: 12,
    color: '#000',
    marginTop: 2,
  },
  monto: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: 12,
  },
});

export default CashierHistoryScreen;

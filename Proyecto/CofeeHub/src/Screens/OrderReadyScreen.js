// src/screens/OrderReadyScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Icon from '../Components/Icon';
import colors from '../Styles/colors';

const OrderReadyScreen = ({ onNavigate, onFinish, pedido }) => {
  const orderId = pedido ? '#' + pedido.folio : '#----';
  const tableNumber = pedido ? pedido.id_mesa || '-' : '-';
  const detalles = pedido ? pedido.detalles : [];

  const renderItem = ({ item }) => (
    <View style={styles.itemRow}>
      <View style={styles.bullet} />
      <Text style={styles.itemText}>{item.nombre_producto} x{item.cantidad}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <Icon name="check-circle" size={56} color="#fff" />
        </View>
        <Text style={styles.title}>¡Listo!</Text>
        <Text style={styles.subtitle}>Tu pedido está listo</Text>
        <Text style={styles.detail}>Pedido {orderId} · Mesa {tableNumber}</Text>
        <Text style={styles.hint}>Pasa a recoger en la barra</Text>

        <View style={styles.itemsCard}>
          {detalles.length > 0 ? (
            <FlatList
              data={detalles}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.emptyText}>No hay productos en el pedido</Text>
          )}
        </View>

        <TouchableOpacity style={styles.acceptButton} onPress={() => (onFinish ? onFinish() : onNavigate('home'))}>
          <Text style={styles.acceptText}>Aceptar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  iconWrapper: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.success,
    marginTop: 4,
  },
  detail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
  hint: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  itemsCard: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: 8,
  },
  itemText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 8,
  },
  acceptButton: {
    width: '100%',
    backgroundColor: colors.success,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  acceptText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default OrderReadyScreen;
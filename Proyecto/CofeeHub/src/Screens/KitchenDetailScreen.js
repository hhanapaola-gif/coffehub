import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from '../Components/Icon';
import colors from '../Styles/colors';

const KitchenDetailScreen = ({ order, onNavigate }) => {
  if (!order) {
    return (
      <View style={styles.container}>
        <Text style={styles.sub}>No hay pedido seleccionado</Text>
      </View>
    );
  }

  const notas = order.detalles
    .filter((d) => d.observaciones)
    .map((d) => `${d.nombre_producto}: ${d.observaciones}`)
    .join('\n');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => onNavigate('kitchen')}>
          <Icon name="arrow-back" size={20} color='#fff' />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Pedido #{order.folio}</Text>
          <Text style={styles.sub}>
            Mesa {order.id_mesa || '-'} · {order.nombre_usuario}
          </Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.productsCard}>
          <Text style={styles.cardTitle}>Productos</Text>
          {order.detalles.map((item) => (
            <View key={item.id} style={styles.productRow}>
              <View style={styles.productIcon}>
                <Icon name="local-cafe" size={16} color={colors.naranja} />
              </View>
              <Text style={styles.productName}>{item.nombre_producto} x{item.cantidad}</Text>
            </View>
          ))}
        </View>

        {notas ? (
          <View style={styles.notesCard}>
            <Text style={styles.notesTitle}>Notas del cliente</Text>
            <Text style={styles.notesText}>{notas}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.changeButton}
          onPress={() => onNavigate('kitchen-status', order)}
        >
          <Text style={styles.changeText}>Cambiar estado</Text>
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
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  sub: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 100,
  },
  productsCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(111,78,55,0.08)',
  },
  productIcon: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: colors.primary, 
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  notesCard: {
    backgroundColor: '#FFF8E1',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#FFC107',
  },
  notesTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F59E0B',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#000',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  changeButton: {
    backgroundColor: colors.naranja,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  changeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default KitchenDetailScreen;
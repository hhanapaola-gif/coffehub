import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from '../Components/Icon';
import colors from '../Styles/colors';

const ReceiptScreen = ({ onNavigate, ticket }) => {
  if (!ticket) {
    return (
      <View style={styles.container}>
        <Text style={styles.shopName}>No hay ticket para mostrar</Text>
      </View>
    );
  }

  const { pago, pedido } = ticket;
  const items = pedido.detalles.map((d) => ({ name: d.nombre_producto, qty: d.cantidad, price: d.subtotal / d.cantidad }));
  const total = pedido.total;
  const fecha = new Date(pago.fecha_pago).toLocaleString('es-MX');

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <View style={styles.receipt}>
          {/* Header */}
          <View style={styles.receiptHeader}>
            <Icon name="local-cafe" size={36} color="#fff" />
            <Text style={styles.shopName}>Coffee Hub</Text>
            <Text style={styles.shopSub}>Cafetería Central · Sucursal Querétaro</Text>
          </View>

          {/* Dotted line */}
          <View style={styles.dottedLine}>
            <View style={styles.dottedDotLeft} />
            <View style={styles.dottedDash} />
            <View style={styles.dottedDotRight} />
          </View>

          {/* Info */}
          <View style={styles.info}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Pedido</Text>
              <Text style={styles.infoValue}>#{pedido.folio}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mesa</Text>
              <Text style={styles.infoValue}>Mesa {pedido.id_mesa || '-'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Fecha</Text>
              <Text style={styles.infoValue}>{fecha}</Text>
            </View>
          </View>

          <View style={styles.dottedLine}>
            <View style={styles.dottedDotLeft} />
            <View style={styles.dottedDash} />
            <View style={styles.dottedDotRight} />
          </View>

          {/* Items */}
          <View style={styles.items}>
            {items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <View>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemSub}>x{item.qty} × ${item.price}</Text>
                </View>
                <Text style={styles.itemTotal}>${item.price * item.qty}</Text>
              </View>
            ))}
          </View>

          <View style={styles.dottedLine}>
            <View style={styles.dottedDotLeft} />
            <View style={styles.dottedDash} />
            <View style={styles.dottedDotRight} />
          </View>

          {/* Total */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL</Text>
            <Text style={styles.totalValue}>${total}</Text>
          </View>

          {/* Footer */}
          <View style={styles.receiptFooter}>
            <Text style={styles.paymentMethod}>Método de pago: {pago.metodo.nombre}</Text>
            {pago.monto_recibido != null && (
              <Text style={styles.paymentMethod}>
                Recibido: ${Number(pago.monto_recibido).toFixed(2)} · Cambio: ${Number(pago.cambio).toFixed(2)}
              </Text>
            )}
            <Text style={styles.thanks}>¡Gracias por tu visita!</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.finishButton} onPress={() => onNavigate('cashier')}>
          <Text style={styles.finishText}>Finalizar</Text>
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
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  receipt: {
    backgroundColor: colors.card,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  receiptHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: colors.secondary,
  },
  shopName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000',
    marginTop: 8,
  },
  shopSub: {
    fontSize: 12,
    color: '#000',
    marginTop: 2,
  },
  dottedLine: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  dottedDotLeft: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.secondary,
    marginLeft: -20,
  },
  dottedDash: {
    flex: 1,
    borderBottomWidth: 2,
    borderBottomColor: '#EDE6DC',
    borderStyle: 'dashed',
  },
  dottedDotRight: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.secondary,
    marginRight: -20,
  },
  info: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: '#000',
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  items: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  itemSub: {
    fontSize: 12,
    color: '#000',
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#000',
  },
  receiptFooter: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  paymentMethod: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000',
  },
  thanks: {
    fontSize: 12,
    color: colors.naranja,
    marginTop: 4,
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
  finishButton: {
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
  finishText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default ReceiptScreen;
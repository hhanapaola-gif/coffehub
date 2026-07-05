// src/screens/OrderSummaryScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from '../Components/Icon';
import BottomNav from '../Components/BottomNav';
import colors from '../Styles/colors';

const OrderSummaryScreen = ({ cart, onNavigate, onUpdateQty, onSend, role, selectedTable }) => {
  const [enviando, setEnviando] = useState(false);
  const subtotal = cart.reduce((a, b) => a + b.price * b.qty, 0);

  const handleEnviar = async () => {
    setEnviando(true);
    try {
      await onSend();
    } finally {
      setEnviando(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <Image source={item.img} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price}</Text>
      </View>
      <View style={styles.qtyControls}>
        <TouchableOpacity
          style={[styles.qtyButton, { backgroundColor: '#dd3737d5' }]}
          onPress={() => onUpdateQty(item.id, -1)}
        >
          <Icon name="remove" size={16} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.qtyText}>{item.qty}</Text>
        <TouchableOpacity
          style={[styles.qtyButton, { backgroundColor: '#33cf62b4' }]}
          onPress={() => onUpdateQty(item.id, 1)}
        >
          <Icon name="add" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (cart.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="receipt" size={48} color="#D9C7A3" />
        <Text style={styles.emptyText}>No hay productos en el pedido</Text>
        <TouchableOpacity
          style={styles.emptyButton}
          onPress={() => onNavigate('home')}
        >
          <Text style={styles.emptyButtonText}>Ver menú</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => onNavigate('home')}>
          <Icon name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Mi Pedido</Text>
        <View style={styles.tableBadge}>
          <Text style={styles.tableBadgeText}>{selectedTable ? `Mesa ${selectedTable}` : 'Sin mesa'}</Text>
        </View>
      </View>

      <FlatList
        data={cart}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <View style={styles.summary}>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>${subtotal}</Text>
          </View>
          <Text style={styles.discountHint}>
            Las promociones vigentes se aplican automáticamente al enviar el pedido
          </Text>
        </View>
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleEnviar}
          disabled={enviando}
        >
          {enviando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.sendText}>Enviar a cocina</Text>
          )}
        </TouchableOpacity>
      </View>

      <BottomNav active="order-summary" onNavigate={onNavigate} role={role} />
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
    color: colors.textPrimary,
    flex: 1,
  },
  tableBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  tableBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: "#fff",
  },
  list: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 200,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  itemImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#EDE6DC',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
    marginTop: 2,
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    width: 20,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: "#000",
  },
  footer: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summary: {
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#000',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(111,78,55,0.15)',
    paddingTop: 8,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
  },
  discountHint: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
  },
  sendButton: {
    backgroundColor: '#f3af4a',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sendText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: 12,
  },
  emptyButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: colors.primary,
  },
  emptyButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default OrderSummaryScreen;
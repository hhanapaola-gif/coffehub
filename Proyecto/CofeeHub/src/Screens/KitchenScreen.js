import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Icon from '../Components/Icon';
import BottomNav from '../Components/BottomNav';
import colors from '../Styles/colors';
import { getPedidosActivos } from '../Services/api';

const ESTATUS_CONFIG = {
  pendiente: { label: 'Pendiente', bg: '#FFEBEE', text: '#E53935' },
  en_preparacion: { label: 'En preparación', bg: '#FFF8E1', text: '#F59E0B' },
  listo: { label: 'Listo', bg: '#E8F5E9', text: '#4CAF50' },
};

const KitchenScreen = ({ onNavigate, onOpenMenu, role, token }) => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [pedidos, setPedidos] = useState([]);

  const cargarPedidos = () => {
    getPedidosActivos(token)
      .then(setPedidos)
      .catch(() => {});
  };

  useEffect(() => {
    cargarPedidos();
    const intervalo = setInterval(cargarPedidos, 10000);
    return () => clearInterval(intervalo);
  }, []);

  const filteredOrders = pedidos.filter((p) =>
    filterStatus === 'all' ? true : p.estatus === filterStatus
  );

  const renderItem = ({ item }) => {
    const cfg = ESTATUS_CONFIG[item.estatus] || ESTATUS_CONFIG.pendiente;
    const hora = new Date(item.fecha_hora).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => onNavigate('kitchen-detail', item)}
      >
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.orderId}>Pedido #{item.folio}</Text>
            <Text style={styles.orderMeta}>
              Mesa {item.id_mesa || '-'} · {hora}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
            <Text style={[styles.statusText, { color: cfg.text }]}>
              {cfg.label}
            </Text>
          </View>
        </View>
        <View style={styles.tags}>
          {item.detalles.slice(0, 2).map((d) => (
            <View key={d.id} style={styles.tag}>
              <Text style={styles.tagText}>{d.nombre_producto} x{d.cantidad}</Text>
            </View>
          ))}
          {item.detalles.length > 2 && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>+{item.detalles.length - 2} más</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const counts = {
    all: pedidos.length,
    pendiente: pedidos.filter((o) => o.estatus === 'pendiente').length,
    en_preparacion: pedidos.filter((o) => o.estatus === 'en_preparacion').length,
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.menuButton} onPress={onOpenMenu}>
            <Icon name="menu" size={20} color='#ccbeb1' />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Pedidos Activos</Text>
            <Text style={styles.sub}>
              {filteredOrders.length} de {pedidos.length} órdenes
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filterStatus === 'all' && styles.filterActive]}
          onPress={() => setFilterStatus('all')}
        >
          <Text style={[styles.filterText, filterStatus === 'all' && styles.filterTextActive]}>
            Todos ({counts.all})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filterStatus === 'pendiente' && styles.filterActive]}
          onPress={() => setFilterStatus('pendiente')}
        >
          <Text style={[styles.filterText, filterStatus === 'pendiente' && styles.filterTextActive]}>
            Pendientes ({counts.pendiente})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filterStatus === 'en_preparacion' && styles.filterActive]}
          onPress={() => setFilterStatus('en_preparacion')}
        >
          <Text style={[styles.filterText, filterStatus === 'en_preparacion' && styles.filterTextActive]}>
            Preparación ({counts.en_preparacion})
          </Text>
        </TouchableOpacity>
      </View>

      {filteredOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay órdenes en este estado</Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      <BottomNav active="kitchen" onNavigate={onNavigate} role={role} />
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
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.secondary,
    marginRight: 8,
  },
  filterActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: '#fff',
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
  },
  orderId: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
  },
  orderMeta: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.naranja,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 4,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#F0EBE3',
    marginRight: 4,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#000',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});

export default KitchenScreen;

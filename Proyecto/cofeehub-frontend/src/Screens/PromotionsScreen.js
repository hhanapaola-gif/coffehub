// src/screens/PromotionsScreen.js
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Icon from '../Components/Icon';
import BottomNav from '../Components/BottomNav';
import colors from '../Styles/colors';
import { getPromoImage } from '../Data/imageMap';

// promociones de prueba, se pueden agregar mas
const PROMOCIONES_DEMO = [
  { id: 1, nombre: 'Happy Hour Café', descripcion: '2x1 en todos los espressos de 14:00 a 16:00 hrs', descuento: 10, fecha_fin: '2026-12-31' },
  { id: 2, nombre: 'Combo Desayuno', descripcion: 'Café + Croissant con descuento', descuento: 15, fecha_fin: '2026-12-31' },
  { id: 3, nombre: 'Postre del Día', descripcion: 'Pastel con bebida caliente a precio especial', descuento: 20, fecha_fin: '2026-12-31' },
];

const PromotionsScreen = ({ onNavigate, onOpenMenu, role }) => {
  const [promociones] = useState(PROMOCIONES_DEMO);

  const renderItem = ({ item, index }) => (
    <View style={styles.card}>
      <View style={styles.imageWrapper}>
        <Image source={getPromoImage(index)} style={styles.image} />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>-{item.descuento}%</Text>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{item.nombre}</Text>
        <Text style={styles.desc}>{item.descripcion}</Text>
        <Text style={styles.desc}>Vigente hasta {item.fecha_fin}</Text>
      </View>
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
            <Text style={styles.headerTitle}>Promociones</Text>
            <Text style={styles.headerSub}>Ofertas especiales del día</Text>
          </View>
        </View>
      </View>
      <FlatList
        data={promociones}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.headerSub}>No hay promociones activas</Text>}
      />
      <BottomNav active="promotions" onNavigate={onNavigate} role={role} />
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  headerSub: {
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
    backgroundColor: colors.secondary,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 144,
    backgroundColor: '#EDE6DC',
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#6868689d',
  },
  badgeText: {
    color: '#000000',
    fontWeight: '800',
    fontSize: 12,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
  },
  desc: {
    fontSize: 14,
    color: '#000',
    marginTop: 4,
  },
  detailButton: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#f3af4a',
    alignSelf: 'flex-start',
  },
  detailText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
  },
});

export default PromotionsScreen;
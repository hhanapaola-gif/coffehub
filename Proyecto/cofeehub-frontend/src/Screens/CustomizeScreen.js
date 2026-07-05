import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';
import Icon from '../Components/Icon';
import { PRODUCTS } from '../Data/data';
import colors from '../Styles/colors';

const CustomizeScreen = ({ product, onNavigate, onAddToCart }) => {
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(1);

  const p = product || PRODUCTS[0];

  const increment = () => setQuantity(q => q + 1);
  const decrement = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  return (
    <View style={styles.container}>
      <Image source={p.img} style={styles.image} />
      <TouchableOpacity style={styles.backButton} onPress={() => onNavigate('home')}>
        <Icon name="arrow-back" size={20} color={colors.primary} />
      </TouchableOpacity>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.name}>{p.name}</Text>
            <Text style={styles.sub}>Personaliza tu pedido</Text>
          </View>
          <Text style={styles.price}>${p.price}</Text>
        </View>

        <View style={styles.notesCard}>
          <Text style={styles.notesTitle}>Observaciones</Text>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="Ej: Sin hielo, bien caliente, etc."
            multiline
            numberOfLines={3}
            placeholderTextColor="#777171b6"
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity style={styles.qtyButton} onPress={decrement}>
            <Icon name="remove" size={20} color='#fcfcfc' />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{quantity}</Text>
          <TouchableOpacity style={styles.qtyButton} onPress={increment}>
            <Icon name="add" size={20} color='#fcfcfc' />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            onAddToCart(p, [], notes, quantity);
            onNavigate('home');
          }}
        >
          <Text style={styles.addText}>
            Agregar — ${(p.price * quantity).toFixed(2)}
          </Text>
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
  image: {
    width: '100%',
    height: 192,
    backgroundColor: '#EDE6DC',
  },
  backButton: {
    position: 'absolute',
    top: 12,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  sub: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  price: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  notesCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  notesInput: {
    backgroundColor: '#F0EBE3',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#000',
    borderWidth: 1,
    borderColor: 'rgba(111,78,55,0.15)',
    textAlignVertical: 'top',
    minHeight: 80,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#45bd4b',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  qtyButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginHorizontal: 12,
    minWidth: 24,
    textAlign: 'center',
  },
  addButton: {
    flex: 1,
    marginLeft: 12,
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
  addText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default CustomizeScreen;

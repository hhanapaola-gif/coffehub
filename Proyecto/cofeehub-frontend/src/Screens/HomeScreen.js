import React, { useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet, ScrollView,} from 'react-native';
import Icon from '../Components/Icon';
import BottomNav from '../Components/BottomNav'
import colors from '../Styles/colors';

const HomeScreen = ({ onNavigate, role, onLogout, onOpenMenu, cart, products, userName}) => {
  const categories = [...new Set(products.map((p) => p.category))];
  const [category, setCategory] = useState(categories[0] || 'Bebidas');
  const [search, setSearch] = useState('');

  const filtered = products.filter(
    (p) => p.category === category && p.name.toLowerCase().includes(search.toLowerCase())
  );
  const cartCount = cart.reduce((a, b) => a + b.qty, 0);

  const renderItem = ({ item }) => {
    const inCart = cart.find((c) => c.id === item.id);
    const disponible = item.estatus !== false;
    return (
      <View style={[styles.productCard, !disponible && styles.productCardDisabled]}>
        <Image source={item.img} style={[styles.productImage, !disponible && styles.productImageDisabled]}/>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productDesc}>{item.descripcion || 'Preparado al momento'}</Text>
          <View style={styles.productBottom}>
            <Text style={styles.productPrice}>${item.price}</Text>
            {disponible ? (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => onNavigate('customize', item)}
              >
                <Icon name="add" size={18} color="#fff" />
              </TouchableOpacity>
            ) : (
              <View style={styles.unavailableBadge}>
                <Text style={styles.unavailableText}>No disponible</Text>
              </View>
            )}
          </View>
        </View>
        {inCart && disponible && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{inCart.qty}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        <View style={styles.appBarLeft}>
          <TouchableOpacity style={styles.menuButton} onPress={onOpenMenu}>
            <Icon name="menu" size={22} color='#ccbeb1' />
          </TouchableOpacity>
          <View>
            <Text style={styles.greeting}>Buenos días,</Text>
            <Text style={styles.userName}>{userName || 'Mesero'}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => onNavigate('order-summary')}
        >
          <Icon name="receipt" size={22} color='#ccbeb1' />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Icon name="search" size={18} color='#777171b6' />
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar productos..."
          placeholderTextColor='#777171b6'
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {categories.map((c) => (
          <TouchableOpacity
            key={c}
            style={[
              styles.categoryButton,
              category === c && styles.categoryActive,
            ]}
            onPress={() => setCategory(c)}
          >
            <Text
              style={[
                styles.categoryText,
                category === c && styles.categoryTextActive,
              ]}
            >
              {c}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <BottomNav active="home" onNavigate={onNavigate} role={role} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  appBarLeft: {
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
  greeting: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  cartButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor:  colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#000',
  },
  categoryScroll: {
    paddingHorizontal: 16,
    marginTop: 12,
    maxHeight: 50,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#00343d',
    marginRight: 8,
  },
  categoryActive: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#f3af4a',
  },
  categoryTextActive: {
    color: '#fff',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 80,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    position: 'relative',
  },
  productCardDisabled: {
    opacity: 0.5,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#EDE6DC',
  },
  productImageDisabled: {
    opacity: 0.6,
  },
  unavailableBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#FFEBEE',
  },
  unavailableText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.error,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  productDesc: {
    fontSize: 12,
    color: '#000',
    marginTop: 2,
  },
  productBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: '#f3af4a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
});

export default HomeScreen;
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import Icon from '../Components/Icon';
import BottomNav from '../Components/BottomNav';
import colors from '../Styles/colors';

// datos puestos a mano, no vienen de ningun lado
const CATEGORIAS_DEMO = [
  { id: 1, nombre: 'Suministros' },
  { id: 2, nombre: 'Servicios' },
  { id: 3, nombre: 'Mantenimiento' },
  { id: 4, nombre: 'Otros' },
];

const GASTOS_DEMO = [
  {
    id: 1, descripcion: 'Compra de vasos desechables', monto: 320,
    fecha_pago: new Date(Date.now() - 26 * 3600000).toISOString(),
    categoria: CATEGORIAS_DEMO[0], nombre_usuario: 'Ana',
  },
];

const CashierExpensesScreen = ({ onNavigate, onOpenMenu }) => {
  const [gastos, setGastos] = useState(GASTOS_DEMO);
  const [categorias] = useState(CATEGORIAS_DEMO);
  const [categoriaId, setCategoriaId] = useState(CATEGORIAS_DEMO[0].id);
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');

  const handleRegistrar = () => {
    if (!descripcion || !monto || !categoriaId) {
      Alert.alert('Faltan datos', 'Llena la descripción, el monto y la categoría');
      return;
    }
    const categoria = categorias.find((c) => c.id === categoriaId);
    const nuevoGasto = {
      id: gastos.length + 1,
      descripcion,
      monto: parseFloat(monto),
      fecha_pago: new Date().toISOString(),
      categoria,
      nombre_usuario: 'Ana',
    };
    setGastos([nuevoGasto, ...gastos]);
    setDescripcion('');
    setMonto('');
    Alert.alert('Gasto registrado', 'El gasto se agregó al historial.');
  };

  const renderItem = ({ item }) => {
    const fecha = new Date(item.fecha_pago).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit' });
    return (
      <View style={styles.card}>
        <View style={styles.iconBox}>
          <Icon name="receipt" size={18} color={colors.naranja} />
        </View>
        <View style={styles.info}>
          <Text style={styles.desc}>{item.descripcion}</Text>
          <Text style={styles.meta}>{item.categoria.nombre} · {fecha} · {item.nombre_usuario}</Text>
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
            <Text style={styles.title}>Gastos</Text>
            <Text style={styles.sub}>Registro de compras y suministros</Text>
          </View>
        </View>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Registrar nuevo gasto</Text>
        <TextInput
          style={styles.input}
          value={descripcion}
          onChangeText={setDescripcion}
          placeholder="Descripción (ej: Compra de vasos desechables)"
          placeholderTextColor="#777171b6"
        />
        <TextInput
          style={styles.input}
          value={monto}
          onChangeText={setMonto}
          placeholder="Monto"
          placeholderTextColor="#777171b6"
          keyboardType="decimal-pad"
        />
        <View style={styles.chipRow}>
          {categorias.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={[styles.chip, categoriaId === c.id && styles.chipActive]}
              onPress={() => setCategoriaId(c.id)}
            >
              <Text style={[styles.chipText, categoriaId === c.id && styles.chipTextActive]}>{c.nombre}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.submitButton} onPress={handleRegistrar}>
          <Text style={styles.submitText}>Registrar gasto</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.historyTitle}>Historial</Text>
      <FlatList
        data={gastos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.emptyText}>Aún no hay gastos registrados</Text>}
      />

      <BottomNav active="cashier-expenses" onNavigate={onNavigate} role="cashier" />
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
  formCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  formTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#F0EBE3',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#000',
    marginBottom: 10,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F0EBE3',
  },
  chipActive: {
    backgroundColor: colors.naranja,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  chipTextActive: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: colors.naranja,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  historyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    marginTop: 16,
    marginHorizontal: 20,
    textTransform: 'uppercase',
  },
  list: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingBottom: 80,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F0EBE3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  desc: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  meta: {
    fontSize: 11,
    color: '#000',
    marginTop: 2,
  },
  monto: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.secondary,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
  },
});

export default CashierExpensesScreen;

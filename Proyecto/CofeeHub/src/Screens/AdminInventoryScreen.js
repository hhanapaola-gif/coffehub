import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import Icon from '../Components/Icon';
import BottomNav from '../Components/BottomNav';
import colors from '../Styles/colors';
import { getInventario, crearIngrediente, editarIngrediente, eliminarIngrediente } from '../Services/api';

const AdminInventoryScreen = ({ onNavigate, token }) => {
  const [ingredientes, setIngredientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarForma, setMostrarForma] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const [nombre, setNombre] = useState('');
  const [stockActual, setStockActual] = useState('');
  const [stockMinimo, setStockMinimo] = useState('');
  const [unidad, setUnidad] = useState('');

  const cargarTodo = () => {
    setCargando(true);
    getInventario(token)
      .then(setIngredientes)
      .catch(() => {})
      .finally(() => setCargando(false));
  };

  useEffect(cargarTodo, []);

  const limpiarForma = () => {
    setNombre('');
    setStockActual('');
    setStockMinimo('');
    setUnidad('');
    setMostrarForma(false);
  };

  const handleCrear = async () => {
    if (!nombre || !stockActual || !stockMinimo || !unidad) {
      Alert.alert('Faltan datos', 'Llena todos los campos');
      return;
    }
    setGuardando(true);
    try {
      await crearIngrediente(token, {
        nombre,
        stock_actual: parseFloat(stockActual),
        stock_minimo: parseFloat(stockMinimo),
        unidad_medida: unidad,
      });
      limpiarForma();
      cargarTodo();
    } catch (e) {
      Alert.alert('No se pudo crear el ingrediente', e.message);
    } finally {
      setGuardando(false);
    }
  };

  const ajustarStock = async (ingrediente, delta) => {
    const nuevoStock = Math.max(0, parseFloat(ingrediente.stock_actual) + delta);
    try {
      await editarIngrediente(token, ingrediente.id, { stock_actual: nuevoStock });
      cargarTodo();
    } catch (e) {
      Alert.alert('No se pudo actualizar', e.message);
    }
  };

  const handleEliminar = (ingrediente) => {
    Alert.alert('Eliminar ingrediente', `¿Eliminar ${ingrediente.nombre}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await eliminarIngrediente(token, ingrediente.id);
            cargarTodo();
          } catch (e) {
            Alert.alert('No se pudo eliminar', e.message);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.nombre}>{item.nombre}</Text>
          <Text style={styles.stock}>
            {item.stock_actual} {item.unidad_medida} (mín. {item.stock_minimo})
          </Text>
        </View>
        {item.alerta && (
          <View style={styles.alertBadge}>
            <Text style={styles.alertText}>Bajo</Text>
          </View>
        )}
      </View>
      <View style={styles.acciones}>
        <TouchableOpacity style={styles.stockButton} onPress={() => ajustarStock(item, -1)}>
          <Icon name="remove" size={18} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.stockButton} onPress={() => ajustarStock(item, 1)}>
          <Icon name="add" size={18} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleEliminar(item)}>
          <Icon name="delete" size={22} color="#E53935" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Inventario</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setMostrarForma(!mostrarForma)}>
          <Icon name={mostrarForma ? 'close' : 'add'} size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {mostrarForma && (
        <View style={styles.forma}>
          <TextInput style={styles.input} placeholder="Nombre del ingrediente" placeholderTextColor="#777" value={nombre} onChangeText={setNombre} />
          <TextInput style={styles.input} placeholder="Existencia actual" placeholderTextColor="#777" value={stockActual} onChangeText={setStockActual} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Stock mínimo" placeholderTextColor="#777" value={stockMinimo} onChangeText={setStockMinimo} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Unidad (g, ml, piezas...)" placeholderTextColor="#777" value={unidad} onChangeText={setUnidad} />
          <TouchableOpacity style={styles.guardarButton} onPress={handleCrear} disabled={guardando}>
            {guardando ? <ActivityIndicator color="#fff" /> : <Text style={styles.guardarText}>Guardar ingrediente</Text>}
          </TouchableOpacity>
        </View>
      )}

      {cargando ? (
        <ActivityIndicator color="#fff" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={ingredientes}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      )}

      <BottomNav active="admin-inventario" onNavigate={onNavigate} role="admin" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: { fontSize: 20, fontWeight: '800', color: colors.textPrimary },
  addButton: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: colors.naranja, justifyContent: 'center', alignItems: 'center',
  },
  forma: {
    backgroundColor: colors.card,
    margin: 20,
    marginBottom: 0,
    borderRadius: 16,
    padding: 16,
  },
  input: {
    backgroundColor: '#F0EBE3',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    fontSize: 14,
    color: '#000',
  },
  guardarButton: {
    backgroundColor: colors.naranja, borderRadius: 12, paddingVertical: 12, alignItems: 'center',
  },
  guardarText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  list: { paddingHorizontal: 20, paddingVertical: 16, paddingBottom: 90 },
  card: {
    backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 12,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  nombre: { fontSize: 15, fontWeight: '700', color: '#000' },
  stock: { fontSize: 12, color: '#555', marginTop: 2 },
  alertBadge: {
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, backgroundColor: '#FFEBEE',
  },
  alertText: { fontSize: 11, fontWeight: '700', color: '#E53935' },
  acciones: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stockButton: {
    width: 32, height: 32, borderRadius: 10, backgroundColor: colors.secondary,
    justifyContent: 'center', alignItems: 'center',
  },
});

export default AdminInventoryScreen;

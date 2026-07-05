import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import Icon from '../Components/Icon';
import BottomNav from '../Components/BottomNav';
import colors from '../Styles/colors';
import { getProductos, getCategorias, crearProducto, editarProducto, eliminarProducto } from '../Services/api';

const AdminMenuScreen = ({ onNavigate, token }) => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarForma, setMostrarForma] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [idCategoria, setIdCategoria] = useState(null);

  const cargarTodo = () => {
    setCargando(true);
    Promise.all([getProductos(token), getCategorias(token)])
      .then(([p, c]) => {
        setProductos(p);
        setCategorias(c);
        if (!idCategoria && c.length > 0) setIdCategoria(c[0].id);
      })
      .catch(() => {})
      .finally(() => setCargando(false));
  };

  useEffect(cargarTodo, []);

  const limpiarForma = () => {
    setNombre('');
    setDescripcion('');
    setPrecio('');
    setMostrarForma(false);
  };

  const handleCrear = async () => {
    if (!nombre || !precio || !idCategoria) {
      Alert.alert('Faltan datos', 'Nombre, precio y categoría son obligatorios');
      return;
    }
    setGuardando(true);
    try {
      await crearProducto(token, {
        nombre,
        descripcion,
        precio: parseFloat(precio),
        id_categoria_prod: idCategoria,
        estatus: true,
        ingredientes: [],
      });
      limpiarForma();
      cargarTodo();
    } catch (e) {
      Alert.alert('No se pudo crear el producto', e.message);
    } finally {
      setGuardando(false);
    }
  };

  const toggleEstatus = async (producto) => {
    try {
      await editarProducto(token, producto.id, { estatus: !producto.estatus });
      cargarTodo();
    } catch (e) {
      Alert.alert('No se pudo actualizar', e.message);
    }
  };

  const handleEliminar = (producto) => {
    Alert.alert('Eliminar producto', `¿Eliminar ${producto.nombre}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await eliminarProducto(token, producto.id);
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
          <Text style={styles.categoria}>{item.categoria.nombre} · ${item.precio}</Text>
        </View>
        <View style={styles.acciones}>
          <TouchableOpacity onPress={() => toggleEstatus(item)}>
            <Icon name={item.estatus ? 'toggle-on' : 'toggle-off'} size={30} color={item.estatus ? colors.success : '#999'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleEliminar(item)}>
            <Icon name="delete" size={22} color="#E53935" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Menú</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setMostrarForma(!mostrarForma)}>
          <Icon name={mostrarForma ? 'close' : 'add'} size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {mostrarForma && (
        <View style={styles.forma}>
          <TextInput style={styles.input} placeholder="Nombre del producto" placeholderTextColor="#777" value={nombre} onChangeText={setNombre} />
          <TextInput style={styles.input} placeholder="Descripción" placeholderTextColor="#777" value={descripcion} onChangeText={setDescripcion} />
          <TextInput style={styles.input} placeholder="Precio" placeholderTextColor="#777" value={precio} onChangeText={setPrecio} keyboardType="numeric" />
          <View style={styles.rolSelector}>
            {categorias.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={[styles.rolChip, idCategoria === c.id && styles.rolChipActivo]}
                onPress={() => setIdCategoria(c.id)}
              >
                <Text style={[styles.rolChipText, idCategoria === c.id && styles.rolChipTextActivo]}>{c.nombre}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.guardarButton} onPress={handleCrear} disabled={guardando}>
            {guardando ? <ActivityIndicator color="#fff" /> : <Text style={styles.guardarText}>Guardar producto</Text>}
          </TouchableOpacity>
        </View>
      )}

      {cargando ? (
        <ActivityIndicator color="#fff" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={productos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      )}

      <BottomNav active="admin-menu" onNavigate={onNavigate} role="admin" />
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
  rolSelector: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  rolChip: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12,
    backgroundColor: '#F0EBE3',
  },
  rolChipActivo: { backgroundColor: colors.naranja },
  rolChipText: { fontSize: 12, fontWeight: '600', color: '#000' },
  rolChipTextActivo: { color: '#fff' },
  guardarButton: {
    backgroundColor: colors.naranja, borderRadius: 12, paddingVertical: 12, alignItems: 'center',
  },
  guardarText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  list: { paddingHorizontal: 20, paddingVertical: 16, paddingBottom: 90 },
  card: {
    backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 12,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  nombre: { fontSize: 15, fontWeight: '700', color: '#000' },
  categoria: { fontSize: 12, color: '#555', marginTop: 2 },
  acciones: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});

export default AdminMenuScreen;

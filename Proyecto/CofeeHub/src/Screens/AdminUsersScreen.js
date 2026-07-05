import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import Icon from '../Components/Icon';
import BottomNav from '../Components/BottomNav';
import colors from '../Styles/colors';
import { getUsuarios, getRoles, crearUsuario, editarUsuario, eliminarUsuario } from '../Services/api';

const AdminUsersScreen = ({ onNavigate, token }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarForma, setMostrarForma] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const [nombre, setNombre] = useState('');
  const [apellidoPat, setApellidoPat] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [idRol, setIdRol] = useState(null);

  const cargarTodo = () => {
    setCargando(true);
    Promise.all([getUsuarios(token), getRoles(token)])
      .then(([u, r]) => {
        setUsuarios(u);
        setRoles(r);
        if (!idRol && r.length > 0) setIdRol(r[0].id);
      })
      .catch(() => {})
      .finally(() => setCargando(false));
  };

  useEffect(cargarTodo, []);

  const limpiarForma = () => {
    setNombre('');
    setApellidoPat('');
    setCorreo('');
    setContrasena('');
    setMostrarForma(false);
  };

  const handleCrear = async () => {
    if (!nombre || !apellidoPat || !correo || !contrasena || !idRol) {
      Alert.alert('Faltan datos', 'Llena todos los campos');
      return;
    }
    setGuardando(true);
    try {
      await crearUsuario(token, {
        nombre,
        apellido_pat: apellidoPat,
        apellido_mat: '',
        correo,
        contrasena,
        id_rol: idRol,
        estatus: true,
      });
      limpiarForma();
      cargarTodo();
    } catch (e) {
      Alert.alert('No se pudo crear el usuario', e.message);
    } finally {
      setGuardando(false);
    }
  };

  const toggleEstatus = async (usuario) => {
    try {
      await editarUsuario(token, usuario.id, { estatus: !usuario.estatus });
      cargarTodo();
    } catch (e) {
      Alert.alert('No se pudo actualizar', e.message);
    }
  };

  const handleEliminar = (usuario) => {
    Alert.alert('Eliminar usuario', `¿Eliminar a ${usuario.nombre}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await eliminarUsuario(token, usuario.id);
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
        <View>
          <Text style={styles.nombre}>{item.nombre} {item.apellido_pat}</Text>
          <Text style={styles.correo}>{item.correo}</Text>
          <Text style={styles.rol}>{item.rol.nombre}</Text>
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
        <Text style={styles.title}>Usuarios</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setMostrarForma(!mostrarForma)}>
          <Icon name={mostrarForma ? 'close' : 'add'} size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {mostrarForma && (
        <View style={styles.forma}>
          <TextInput style={styles.input} placeholder="Nombre" placeholderTextColor="#777" value={nombre} onChangeText={setNombre} />
          <TextInput style={styles.input} placeholder="Apellido paterno" placeholderTextColor="#777" value={apellidoPat} onChangeText={setApellidoPat} />
          <TextInput style={styles.input} placeholder="Correo" placeholderTextColor="#777" value={correo} onChangeText={setCorreo} keyboardType="email-address" autoCapitalize="none" />
          <TextInput style={styles.input} placeholder="Contraseña" placeholderTextColor="#777" value={contrasena} onChangeText={setContrasena} secureTextEntry />
          <View style={styles.rolSelector}>
            {roles.map((r) => (
              <TouchableOpacity
                key={r.id}
                style={[styles.rolChip, idRol === r.id && styles.rolChipActivo]}
                onPress={() => setIdRol(r.id)}
              >
                <Text style={[styles.rolChipText, idRol === r.id && styles.rolChipTextActivo]}>{r.nombre}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.guardarButton} onPress={handleCrear} disabled={guardando}>
            {guardando ? <ActivityIndicator color="#fff" /> : <Text style={styles.guardarText}>Guardar usuario</Text>}
          </TouchableOpacity>
        </View>
      )}

      {cargando ? (
        <ActivityIndicator color="#fff" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={usuarios}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      )}

      <BottomNav active="admin-usuarios" onNavigate={onNavigate} role="admin" />
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
  correo: { fontSize: 12, color: '#555', marginTop: 2 },
  rol: { fontSize: 12, fontWeight: '600', color: colors.naranja, marginTop: 4 },
  acciones: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});

export default AdminUsersScreen;

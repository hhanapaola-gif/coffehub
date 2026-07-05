// src/screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from '../Components/Icon';
import colors from '../Styles/colors';

// solo revisa que el correo diga el rol, no valida nada real
const NOMBRES_POR_ROL = { mesero: 'Paola', cocina: 'Daniela', cajero: 'Zoe' };

const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const handleSubmit = () => {
    if (!email || !password) {
      Alert.alert('Falta información', 'Ingresa tu correo y contraseña');
      return;
    }
    const correo = email.trim().toLowerCase();
    const rol = ['mesero', 'cocina', 'cajero'].find((r) => correo.includes(r)) || 'mesero';
    onLogin(rol, NOMBRES_POR_ROL[rol]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <Icon name="local-cafe" size={40} color="#ccbeb1" />
        </View>
        <Text style={styles.appName}>COFFEE HUB</Text>
        <Text style={styles.appSub}>Inicia sesión para continuar</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="correo@cafeteria.com"
            placeholderTextColor='#777171b6'
            keyboardType='email-address'
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              placeholder="********"
              secureTextEntry={!mostrarPassword}
              placeholderTextColor='#777171b6'
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setMostrarPassword((v) => !v)}
            >
              <Icon name={mostrarPassword ? 'visibility-off' : 'visibility'} size={20} color="#777171b6" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleSubmit}
        >
          <Text style={styles.loginText}>Iniciar sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => Alert.alert('Recuperar contraseña', 'Esta opción no está disponible en esta demo.')}
        >
          <Text style={styles.forgot}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 12,
  },
  appSub: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(111,78,55,0.2)',
    color: '#000',
  },
  passwordWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  passwordInput: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingRight: 44,
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(111,78,55,0.2)',
    color: '#000',
  },
  eyeButton: {
    position: 'absolute',
    right: 14,
    height: '100%',
    justifyContent: 'center',
  },
  loginButton: {
    backgroundColor: '#f3af4a',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  loginText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  forgot: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    color: '#777171',
    marginTop: 16,
  },
});

export default LoginScreen;
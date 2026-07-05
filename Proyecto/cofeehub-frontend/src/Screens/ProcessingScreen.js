import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from '../Components/Icon';
import colors from '../Styles/colors';

const ProcessingScreen = ({ onNavigate }) => {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDone(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {!done ? (
        <>
          <View style={styles.spinnerWrapper}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
          <Text style={styles.title}>Procesando pago...</Text>
          <Text style={styles.sub}>Por favor espera un momento</Text>
        </>
      ) : (
        <>
          <View style={styles.successIcon}>
            <Icon name="check-circle" size={48} color="#fff" />
          </View>
          <Text style={styles.successTitle}>¡Pago exitoso!</Text>
          <Text style={styles.successSub}>El cobro se realizó correctamente</Text>
          <TouchableOpacity
            style={styles.receiptButton}
            onPress={() => onNavigate('receipt')}
          >
            <Text style={styles.receiptText}>Ver recibo</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  spinnerWrapper: {
    width: 96,
    height: 96,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 16,
  },
  sub: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  successIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 16,
  },
  successSub: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  receiptButton: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: colors.naranja,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  receiptText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default ProcessingScreen;
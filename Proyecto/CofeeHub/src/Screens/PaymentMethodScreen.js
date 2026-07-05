import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import Icon from '../Components/Icon';
import colors from '../Styles/colors';
import { getMetodosPago, registrarPago } from '../Services/api';

const ICONOS_METODO = {
  Efectivo: 'payments',
  Tarjeta: 'credit-card',
  Transferencia: 'phone-android',
  Otro: 'more-horiz',
};

const PaymentMethodsScreen = ({ onNavigate, token, pedido, onPagoRegistrado }) => {
  const [metodos, setMetodos] = useState([]);
  const [metodoId, setMetodoId] = useState(null);
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    getMetodosPago(token)
      .then(setMetodos)
      .catch(() => {});
  }, []);

  const handleConfirmar = async () => {
    if (!metodoId || !pedido) return;

    const metodo = metodos.find((m) => m.id === metodoId);
    if (metodo && metodo.nombre === 'Efectivo') {
      onNavigate('payment-cash', metodo);
      return;
    }

    setProcesando(true);
    try {
      const pago = await registrarPago(token, pedido.id, metodoId);
      onPagoRegistrado({ pago, pedido });
      onNavigate('processing');
    } catch (e) {
      Alert.alert('No se pudo registrar el pago', e.message);
    } finally {
      setProcesando(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => onNavigate('payment-detail')}>
          <Icon name="arrow-back" size={20} color='#fff'/>
        </TouchableOpacity>
        <Text style={styles.title}>Método de Pago</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.totalHint}>
          Total a cobrar: <Text style={styles.totalAmount}>${pedido ? pedido.total : 0}</Text>
        </Text>
        {metodos.map((m) => (
          <TouchableOpacity
            key={m.id}
            style={[
              styles.methodCard,
              metodoId === m.id && styles.methodActive,
            ]}
            onPress={() => setMetodoId(m.id)}
          >
            <View
              style={[
                styles.iconBox,
                metodoId === m.id && styles.iconBoxActive,
              ]}
            >
              <Icon
                name={ICONOS_METODO[m.nombre] || 'payments'}
                size={26}
                color={metodoId === m.id ? colors.secondary : colors.naranja}
              />
            </View>
            <View style={styles.methodInfo}>
              <Text style={styles.methodLabel}>{m.nombre}</Text>
            </View>
            {metodoId === m.id && (
              <View style={styles.check}>
                <Icon name="check-circle" size={16} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.confirmButton, !metodoId && styles.confirmDisabled]}
          disabled={!metodoId || procesando}
          onPress={handleConfirmar}
        >
          {procesando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.confirmText}>Confirmar pago</Text>
          )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  totalHint: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 16,
  },
  totalAmount: {
    fontWeight: '800',
    color: '#fff',
    fontSize: 16,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  methodActive: {
    backgroundColor: '#FDF7F2',
    borderColor: colors.success,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#F0EBE3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconBoxActive: {
    backgroundColor: colors.primary,
  },
  methodInfo: {
    flex: 1,
  },
  methodLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  methodDesc: {
    fontSize: 12,
    color: '#000',
    marginTop: 2,
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  confirmButton: {
    backgroundColor: colors.naranja,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  confirmDisabled: {
    backgroundColor: colors.naranja,
  },
  confirmText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default PaymentMethodsScreen;

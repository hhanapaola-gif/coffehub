import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import Icon from '../Components/Icon';
import colors from '../Styles/colors';

const PaymentCashScreen = ({ onNavigate, pedido, metodo, onPagoRegistrado }) => {
  const [montoRecibido, setMontoRecibido] = useState('');

  if (!pedido || !metodo) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No hay pedido seleccionado</Text>
      </View>
    );
  }

  const total = parseFloat(pedido.total);
  const recibido = parseFloat(montoRecibido.replace(',', '.'));
  const recibidoValido = !isNaN(recibido) && recibido >= total;
  const cambio = recibidoValido ? recibido - total : 0;

  const handleConfirmar = () => {
    if (!recibidoValido) return;
    const pago = {
      id: Date.now(),
      id_pedido: pedido.id,
      metodo,
      monto: total,
      monto_recibido: recibido,
      cambio,
      fecha_pago: new Date().toISOString(),
    };
    onPagoRegistrado({ pago, pedido });
    onNavigate('processing');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => onNavigate('payment-methods')}>
          <Icon name="arrow-back" size={20} color='#fff' />
        </TouchableOpacity>
        <Text style={styles.title}>Procesar Pago</Text>
        <Text style={styles.folio}>#{pedido.folio}</Text>
      </View>

      <ScrollView style={styles.body} keyboardShouldPersistTaps="handled">
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total a pagar</Text>
          <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
        </View>

        <Text style={styles.sectionLabel}>Método de pago</Text>
        <View style={styles.methodRow}>
          <View style={styles.methodInfo}>
            <Icon name="payments" size={22} color={colors.success} />
            <Text style={styles.methodName}>{metodo.nombre}</Text>
          </View>
          <TouchableOpacity onPress={() => onNavigate('payment-methods')}>
            <Text style={styles.changeLink}>Cambiar</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>Monto recibido</Text>
        <View style={styles.inputWrapper}>
          <Text style={styles.currencySign}>$</Text>
          <TextInput
            style={styles.input}
            value={montoRecibido}
            onChangeText={setMontoRecibido}
            placeholder="0.00"
            placeholderTextColor="#777171b6"
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.changeCard}>
          <Text style={styles.changeLabel}>Cambio</Text>
          <Text style={[styles.changeValue, !recibidoValido && { color: colors.textSecondary }]}>
            ${cambio.toFixed(2)}
          </Text>
        </View>
        {montoRecibido !== '' && !recibidoValido && (
          <Text style={styles.errorText}>El monto recibido es insuficiente</Text>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.confirmButton, !recibidoValido && styles.confirmDisabled]}
          disabled={!recibidoValido}
          onPress={handleConfirmar}
        >
          <Text style={styles.confirmText}>Confirmar pago</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    flex: 1,
  },
  folio: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.naranja,
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  totalCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  totalLabel: {
    fontSize: 14,
    color: '#000',
  },
  totalValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#000',
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.success,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
  },
  methodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
    marginLeft: 10,
  },
  changeLink: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.success,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  currencySign: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    paddingVertical: 14,
  },
  changeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  changeLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  changeValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.success,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: 8,
    textAlign: 'center',
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
    opacity: 0.5,
  },
  confirmText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default PaymentCashScreen;

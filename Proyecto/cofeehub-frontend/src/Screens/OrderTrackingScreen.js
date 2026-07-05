import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from '../Components/Icon';
import colors from '../Styles/colors';

const ESTATUS_A_PASO = {
  pendiente: 0,
  en_preparacion: 1,
  listo: 2,
  pagado: 2,
};

// avanza con un timer local, sin conexion a nada
const OrderTrackingScreen = ({ onNavigate, pedido }) => {
  const [step, setStep] = useState(pedido ? ESTATUS_A_PASO[pedido.estatus] || 0 : 0);
  const steps = ['Pendiente', 'En preparación', 'Listo'];
  const stepColors = ['#E53935', '#FFC107', '#4CAF50'];

  useEffect(() => {
    if (!pedido || step >= 2) return;
    const temporizador = setTimeout(() => setStep((s) => Math.min(s + 1, 2)), 3000);
    return () => clearTimeout(temporizador);
  }, [pedido, step]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Estado del Pedido</Text>
        <Text style={styles.sub}>
          {pedido ? `Pedido #${pedido.folio} · Mesa ${pedido.id_mesa || '-'}` : 'Sin pedido activo'}
        </Text>
      </View>

      <View style={styles.body}>
        <View style={styles.progressWrapper}>
          <View style={styles.progressBarBg} />
          <View
            style={[
              styles.progressBarFill,
              {
                width: step === 0 ? '0%' : step === 1 ? '50%' : '100%',
                backgroundColor: stepColors[step],
              },
            ]}
          />
          {steps.map((s, i) => (
            <View key={s} style={styles.stepItem}>
              <View
                style={[
                  styles.stepCircle,
                  {
                    backgroundColor: i <= step ? stepColors[i] : '#fff',
                    borderColor: i <= step ? stepColors[i] : '#D9C7A3',
                  },
                ]}
              >
                {i < step ? (
                  <Icon name="check-circle" size={16} color="#fff" />
                ) : (
                  <Text
                    style={[
                      styles.stepNumber,
                      { color: i <= step ? '#fff' : colors.textSecondary },
                    ]}
                  >
                    {i + 1}
                  </Text>
                )}
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  { color: i <= step ? colors.textPrimary : colors.textSecondary },
                ]}
              >
                {s}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.infoCard}>
          <View style={[styles.infoIcon, { backgroundColor: stepColors[step] + '20' }]}>
            <Icon
              name={step === 2 ? 'check-circle' : 'timer'}
              size={32}
              color={stepColors[step]}
            />
          </View>
          <Text style={styles.infoTitle}>{steps[step]}</Text>
          {step < 2 ? (
            <Text style={styles.infoTime}>Cocina esta preparando tu pedido</Text>
          ) : (
            <Text style={[styles.infoTime, { color: colors.success }]}>
              ¡Tu pedido está listo!
            </Text>
          )}
        </View>

        {step === 2 ? (
          <TouchableOpacity
            style={[styles.button, styles.buttonSuccess, { marginTop: 24 }]}
            onPress={() => onNavigate('order-ready')}
          >
            <Text style={styles.buttonPrimaryText}>Ver confirmación</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary, { marginTop: 24 }]}
            onPress={() => onNavigate('home')}
          >
            <Text style={styles.buttonPrimaryText}>Volver al inicio</Text>
          </TouchableOpacity>
        )}
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  sub: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  progressWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
    marginBottom: 32,
  },
  progressBarBg: {
    position: 'absolute',
    top: 20,
    left: 24,
    right: 24,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#EDE6DC',
  },
  progressBarFill: {
    position: 'absolute',
    top: 20,
    left: 24,
    height: 4,
    borderRadius: 2,
  },
  stepItem: {
    alignItems: 'center',
    zIndex: 1,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '700',
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '600',
    maxWidth: 70,
    textAlign: 'center',
  },
  infoCard: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  infoIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000',
  },
  infoTime: {
    fontSize: 14,
    color: '#000',
    marginTop: 4,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
  },
  buttonPrimary: {
    backgroundColor: '#f3af4a',
  },
  buttonSuccess: {
    backgroundColor: colors.success,
  },
  buttonPrimaryText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default OrderTrackingScreen;

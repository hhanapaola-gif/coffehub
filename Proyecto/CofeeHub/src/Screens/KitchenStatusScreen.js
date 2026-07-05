import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import Icon from '../Components/Icon';
import colors from '../Styles/colors';
import { cambiarEstatusPedido } from '../Services/api';

const PASOS = [
  { key: 'pendiente', label: 'Pendiente', descripcion: 'El pedido ha sido recibido' },
  { key: 'en_preparacion', label: 'En preparación', descripcion: 'El pedido se está preparando' },
  { key: 'listo', label: 'Listo', descripcion: 'El pedido está listo para entregar' },
];

const SIGUIENTE_ESTATUS = {
  pendiente: 'en_preparacion',
  en_preparacion: 'listo',
};

const SIGUIENTE_LABEL = {
  pendiente: 'Marcar en preparación',
  en_preparacion: 'Marcar como listo',
};

const KitchenStatusScreen = ({ onNavigate, token, pedido }) => {
  const [guardando, setGuardando] = useState(false);

  if (!pedido) {
    return (
      <View style={styles.container}>
        <Text style={styles.sub}>No hay pedido seleccionado</Text>
      </View>
    );
  }

  const pasoActual = PASOS.findIndex((p) => p.key === pedido.estatus);
  const siguienteEstatus = SIGUIENTE_ESTATUS[pedido.estatus];

  const handleAvanzar = async () => {
    if (!siguienteEstatus) return;
    setGuardando(true);
    try {
      await cambiarEstatusPedido(token, pedido.id, siguienteEstatus);
      onNavigate('kitchen');
    } catch (e) {
      Alert.alert('No se pudo cambiar el estado', e.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => onNavigate('kitchen-detail', pedido)}>
          <Icon name="arrow-back" size={20} color='#fff' />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Cambiar Estado</Text>
          <Text style={styles.sub}>Pedido #{pedido.folio} · Mesa {pedido.id_mesa || '-'}</Text>
        </View>
      </View>

      <View style={styles.body}>
        {PASOS.map((p, i) => {
          const completado = i < pasoActual;
          const actual = i === pasoActual;
          const activo = completado || actual;
          return (
            <View key={p.key} style={styles.stepRow}>
              <View
                style={[
                  styles.stepCircle,
                  activo && { backgroundColor: colors.success, borderColor: colors.success },
                ]}
              >
                {completado ? (
                  <Icon name="check-circle" size={18} color="#fff" />
                ) : (
                  <Text style={[styles.stepNumber, activo && { color: '#fff' }]}>{i + 1}</Text>
                )}
              </View>
              {i < PASOS.length - 1 && (
                <View style={[styles.stepLine, completado && { backgroundColor: colors.success }]} />
              )}
              <View style={styles.stepTextWrapper}>
                <Text style={[styles.stepLabel, activo && { color: colors.textPrimary }]}>{p.label}</Text>
                <Text style={styles.stepDesc}>{p.descripcion}</Text>
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.footer}>
        {siguienteEstatus ? (
          <TouchableOpacity style={styles.confirmButton} onPress={handleAvanzar} disabled={guardando}>
            {guardando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.confirmText}>{SIGUIENTE_LABEL[pedido.estatus]}</Text>
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.doneBox}>
            <Icon name="check-circle" size={18} color={colors.success} />
            <Text style={styles.doneText}>Pedido listo, esperando cobro en caja</Text>
          </View>
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
  sub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    position: 'relative',
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#D9C7A3',
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  stepLine: {
    position: 'absolute',
    left: 17,
    top: 36,
    width: 2,
    height: 48,
    backgroundColor: '#D9C7A3',
  },
  stepTextWrapper: {
    marginLeft: 16,
    marginBottom: 48,
    flex: 1,
  },
  stepLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  stepDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
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
  confirmText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  doneBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  doneText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: colors.success,
  },
});

export default KitchenStatusScreen;

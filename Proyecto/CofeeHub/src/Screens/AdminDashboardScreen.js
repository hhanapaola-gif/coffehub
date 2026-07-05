import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import Icon from '../Components/Icon';
import BottomNav from '../Components/BottomNav';
import colors from '../Styles/colors';
import { getDashboard } from '../Services/api';

const AdminDashboardScreen = ({ onNavigate, onLogout, token, userName }) => {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    getDashboard(token)
      .then(setDatos)
      .catch(() => {})
      .finally(() => setCargando(false));
  }, []);

  const tarjetas = datos
    ? [
        { label: 'Ventas del día', valor: `$${datos.ventas_hoy}`, icon: 'attach-money' },
        { label: 'Pedidos activos', valor: datos.pedidos_activos, icon: 'receipt-long' },
        { label: 'Ganancias del día', valor: `$${datos.ganancias_hoy}`, icon: 'trending-up' },
        { label: 'Gastos del día', valor: `$${datos.gastos_hoy}`, icon: 'money-off' },
      ]
    : [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Panel de administrador</Text>
          <Text style={styles.userName}>{userName || 'Admin'}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Icon name="logout" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {cargando ? (
        <ActivityIndicator color="#fff" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.grid}>
            {tarjetas.map((t) => (
              <View key={t.label} style={styles.card}>
                <Icon name={t.icon} size={22} color={colors.naranja} />
                <Text style={styles.cardValue}>{t.valor}</Text>
                <Text style={styles.cardLabel}>{t.label}</Text>
              </View>
            ))}
          </View>

          {datos && (
            <View style={styles.alertCard}>
              <Icon name="warning" size={20} color="#E53935" />
              <Text style={styles.alertText}>
                {datos.ingredientes_con_alerta} ingredientes con stock bajo
              </Text>
            </View>
          )}

          {datos && (
            <View style={styles.alertCard}>
              <Icon name="point-of-sale" size={20} color={colors.success} />
              <Text style={styles.alertText}>
                {datos.pedidos_listos_para_cobro} pedidos listos por cobrar
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      <BottomNav active="admin-dashboard" onNavigate={onNavigate} role="admin" />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  greeting: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    padding: 20,
    paddingBottom: 90,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000',
    marginTop: 8,
  },
  cardLabel: {
    fontSize: 12,
    color: '#000',
    marginTop: 2,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    gap: 10,
  },
  alertText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
  },
});

export default AdminDashboardScreen;

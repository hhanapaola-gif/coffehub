import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from '../Components/Icon';
import colors from '../Styles/colors';

const SplashScreen = ({ onNext }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onNext} activeOpacity={0.9}>
      <View style={styles.content}>
        <View style={styles.logoBox}>
          <Icon name="local-cafe" size={72} color="#ccbeb1" />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>COFFEE</Text>
          <Text style={[styles.title, { color: '#e0b574' }]}>HUB</Text>
        </View>
        <Text style={styles.subtitle}>Administra, Sirve y Disfruta</Text>
      </View>
      <View style={styles.footer}>
        <View style={styles.pulse} />
        <Text style={styles.hint}>Toca para continuar</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00343d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoBox: {
    width: 120,
    height: 112,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
    marginBottom: 24,
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 50,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.65)',
    marginTop: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
  },
  pulse: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  hint: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 8,
  },
});

export default SplashScreen;
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { NativeBridge } from '../services/bridge';

interface HomeBundleProps {
  name?: string;
  phone?: string;
  balance?: number;
}

export default function HomeBundle(props: HomeBundleProps) {
  const [userData, setUserData] = useState({
    name: props.name || 'Cargando...',
    phone: props.phone || '',
    balance: props.balance !== undefined ? props.balance : 100000,
  });

  useEffect(() => {
    const subscription = NativeBridge.onLoadHome((data: any) => {
      console.log('[HomeBundle] Evento LOAD_HOME recibido de Android:', data);
      if (data) {
        setUserData({
          name: data.name || userData.name,
          phone: data.phone || userData.phone,
          balance: data.balance !== undefined ? data.balance : userData.balance,
        });
      }
    });

    const expirationSubscription = NativeBridge.onSessionExpired(() => {
      console.log('[HomeBundle] Evento SESSION_EXPIRED recibido de Android');
    });

    return () => {
      subscription.remove();
      expirationSubscription.remove();
    };
  }, [userData]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#e50014" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hola, {userData.name}</Text>
        <Text style={styles.headerSubtitle}>{userData.phone}</Text>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo disponible</Text>
        <Text style={styles.balanceValue}>{formatCurrency(userData.balance)}</Text>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => NativeBridge.openTransfer()}
        >
          <Text style={styles.menuButtonText}>Pasar Plata (Transferencia)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => NativeBridge.openMovements()}
        >
          <Text style={styles.menuButtonText}>Ver Movimientos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuButton, styles.logoutButton]}
          onPress={() => NativeBridge.sendLogout()}
        >
          <Text style={[styles.menuButtonText, styles.logoutButtonText]}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#e50014',
    padding: 24,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#ffcccc',
    marginTop: 4,
  },
  balanceCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  menuContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  menuButton: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e50014',
  },
  logoutButton: {
    backgroundColor: '#fff',
    borderColor: '#e50014',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#e50014',
  },
});

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import { NativeBridge } from '../services/bridge';

interface TransferenciaBundleProps {
  currentPhone?: string;
  balance?: number;
}

export default function TransferenciaBundle(props: TransferenciaBundleProps) {
  const currentPhone = props.currentPhone || '3001234567';
  const balance = props.balance !== undefined ? props.balance : 100000;

  const [destinationPhone, setDestinationPhone] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleTransfer = async () => {
    const amount = parseFloat(amountStr);

    if (!destinationPhone || !amountStr) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    if (destinationPhone.length !== 10) {
      Alert.alert('Error', 'El teléfono destino debe tener 10 dígitos.');
      return;
    }

    if (destinationPhone === currentPhone) {
      Alert.alert('Error', 'No puedes transferir dinero a tu propio número.');
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'El monto debe ser mayor a cero.');
      return;
    }

    if (amount > balance) {
      Alert.alert('Error', 'Saldo insuficiente para realizar esta transferencia.');
      return;
    }

    setLoading(true);
    try {
      const msg = await NativeBridge.sendTransfer(
        destinationPhone,
        amount,
        description || 'Transferencia desde DaviPlata'
      );
      Alert.alert('Éxito', msg);
    } catch (error: any) {
      Alert.alert('Error en Transferencia', error.message || 'Ocurrió un error al procesar el pago.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <View style={styles.card}>
        <Text style={styles.title}>Pasar Plata</Text>
        <Text style={styles.subtitle}>Tu saldo actual: {formatCurrency(balance)}</Text>

        <TextInput
          style={styles.input}
          placeholder="Número de celular destino (10 dígitos)"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          maxLength={10}
          value={destinationPhone}
          onChangeText={setDestinationPhone}
        />

        <TextInput
          style={styles.input}
          placeholder="Monto a transferir ($)"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={amountStr}
          onChangeText={setAmountStr}
        />

        <TextInput
          style={styles.input}
          placeholder="Mensaje (Opcional)"
          placeholderTextColor="#999"
          value={description}
          onChangeText={setDescription}
        />

        <TouchableOpacity 
          style={[styles.button, loading && { backgroundColor: '#f5a3a8' }]} 
          onPress={handleTransfer}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Procesando...' : 'Aceptar'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 45) : 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e50014',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#e50014',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

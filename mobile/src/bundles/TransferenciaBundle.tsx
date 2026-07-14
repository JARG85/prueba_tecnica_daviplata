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
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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

  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [isAmountFocused, setIsAmountFocused] = useState(false);
  const [isDescFocused, setIsDescFocused] = useState(false);

  // Colombian Peso formatting: $1.450.000,00
  const formatCurrency = (value: number) => {
    const fixedValue = value.toFixed(2);
    const [integerPart, decimalPart] = fixedValue.split('.');
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `$${formattedInteger},${decimalPart}`;
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
      Alert.alert('Éxito', msg, [
        {
          text: 'Aceptar',
          onPress: () => {
            // Once the transfer succeeds, we update the native layer and close
            NativeBridge.sendTransferSuccess({
              destinationPhone,
              amount,
              description: description || 'Transferencia desde DaviPlata',
            });
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error en Transferencia', error.message || 'Ocurrió un error al procesar el pago.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = destinationPhone.length === 10 && amountStr.length > 0;

  // Custom Minimalist Gray Icons using simple styled Views
  const PhoneIcon = () => (
    <View style={styles.phoneIconOuter}>
      <View style={styles.phoneIconDot} />
    </View>
  );

  const DollarIcon = () => (
    <View style={styles.dollarIconOuter}>
      <Text style={styles.dollarIconText}>$</Text>
    </View>
  );

  const MessageIcon = () => (
    <View style={styles.messageIconOuter}>
      <View style={styles.messageIconBubble}>
        <View style={styles.messageIconLine1} />
        <View style={styles.messageIconLine2} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#C8102E" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Red Header Section with Gradient Overlays */}
          <View style={styles.headerSection}>
            <View style={styles.gradientOverlay1} />
            <View style={styles.gradientOverlay2} />
            <View style={styles.gradientOverlay3} />

            {/* Back Button */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => NativeBridge.closeActivity()}
              activeOpacity={0.7}
            >
              <Text style={styles.backButtonText}>← Volver</Text>
            </TouchableOpacity>

            <Text style={styles.welcomeText}>Pasar Plata</Text>
            <Text style={styles.balanceText}>Tu saldo actual: {formatCurrency(balance)}</Text>
          </View>

          {/* White Card (Overlapping) */}
          <View style={styles.card}>
            {/* Form Section */}
            <View style={styles.formSection}>
              {/* Phone Input (Pill Shaped) */}
              <Text style={styles.inputLabel}>Número de celular destino</Text>
              <View style={[styles.inputWrapper, isPhoneFocused && styles.inputWrapperFocused]}>
                <View style={styles.iconContainer}>
                  <PhoneIcon />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="Ej. 3001234567"
                  placeholderTextColor="#A0AEC0"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={destinationPhone}
                  onChangeText={setDestinationPhone}
                  onFocus={() => setIsPhoneFocused(true)}
                  onBlur={() => setIsPhoneFocused(false)}
                />
              </View>

              {/* Amount Input (Pill Shaped) */}
              <Text style={styles.inputLabel}>Monto a transferir</Text>
              <View style={[styles.inputWrapper, isAmountFocused && styles.inputWrapperFocused]}>
                <View style={styles.iconContainer}>
                  <DollarIcon />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="Monto en pesos (Ej. 20000)"
                  placeholderTextColor="#A0AEC0"
                  keyboardType="numeric"
                  value={amountStr}
                  onChangeText={setAmountStr}
                  onFocus={() => setIsAmountFocused(true)}
                  onBlur={() => setIsAmountFocused(false)}
                />
              </View>

              {/* Message Input (Pill Shaped) */}
              <Text style={styles.inputLabel}>Mensaje (Opcional)</Text>
              <View style={[styles.inputWrapper, isDescFocused && styles.inputWrapperFocused]}>
                <View style={styles.iconContainer}>
                  <MessageIcon />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="Ej. Pago de almuerzo"
                  placeholderTextColor="#A0AEC0"
                  value={description}
                  onChangeText={setDescription}
                  onFocus={() => setIsDescFocused(true)}
                  onBlur={() => setIsDescFocused(false)}
                />
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.transferButton, (!isFormValid || loading) && styles.transferButtonDisabled]}
                onPress={handleTransfer}
                disabled={!isFormValid || loading}
                activeOpacity={0.8}
              >
                <Text style={styles.transferButtonText}>
                  {loading ? 'Procesando...' : 'TRANSFERIR PLATA'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  headerSection: {
    backgroundColor: '#C8102E', // Davivienda red base
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ? StatusBar.currentHeight + 30 : 55) : 50,
    paddingHorizontal: 20,
    paddingBottom: 55,
    position: 'relative',
    overflow: 'hidden',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  gradientOverlay1: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#E53E3E',
    opacity: 0.25,
  },
  gradientOverlay2: {
    position: 'absolute',
    bottom: -100,
    left: -80,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#7A091A',
    opacity: 0.45,
  },
  gradientOverlay3: {
    position: 'absolute',
    bottom: -10,
    right: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#9B0F23',
    opacity: 0.4,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? (StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 25) : 20,
    left: 20,
    zIndex: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 15,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 34,
    zIndex: 10,
    marginTop: 15,
  },
  balanceText: {
    fontSize: 15,
    color: '#FEE2E2',
    textAlign: 'center',
    marginTop: 6,
    fontWeight: '600',
    zIndex: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 36,
    marginHorizontal: 16,
    marginTop: -40, // Overlaps the red header
    paddingHorizontal: 24,
    paddingVertical: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  formSection: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 25, // Pill shaped
    paddingHorizontal: 20,
    height: 52,
    marginBottom: 20,
  },
  inputWrapperFocused: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#C8102E',
  },
  iconContainer: {
    marginRight: 12,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneIconOuter: {
    width: 14,
    height: 24,
    borderRadius: 3,
    borderWidth: 1.8,
    borderColor: '#718096',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 3,
  },
  phoneIconDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#718096',
  },
  dollarIconOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.8,
    borderColor: '#718096',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dollarIconText: {
    color: '#718096',
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 14,
  },
  messageIconOuter: {
    width: 22,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageIconBubble: {
    width: 20,
    height: 14,
    borderRadius: 3,
    borderWidth: 1.8,
    borderColor: '#718096',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  messageIconLine1: {
    width: '100%',
    height: 1.5,
    backgroundColor: '#718096',
    marginBottom: 2,
  },
  messageIconLine2: {
    width: '60%',
    height: 1.5,
    backgroundColor: '#718096',
    alignSelf: 'flex-start',
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#1A202C',
    height: '100%',
    padding: 0,
  },
  transferButton: {
    backgroundColor: '#C8102E', // Davivienda red
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#C8102E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
    marginTop: 10,
    marginBottom: 10,
  },
  transferButtonDisabled: {
    backgroundColor: '#F5A3A8',
    elevation: 0,
    shadowOpacity: 0,
  },
  transferButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});

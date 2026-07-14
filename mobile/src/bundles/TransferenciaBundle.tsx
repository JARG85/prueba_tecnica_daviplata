import React, { useState, useEffect } from 'react';
import {
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
import { COLORS } from '../styles/theme';
import { commonStyles } from '../styles/commonStyles';
import { styles } from './TransferenciaBundle.styles';

interface TransferenciaBundleProps {
  currentPhone?: string;
  balance?: number;
}

export default function TransferenciaBundle(props: TransferenciaBundleProps) {
  const currentPhone = props.currentPhone || '3001234567';
  const [balance, setBalance] = useState(props.balance !== undefined ? props.balance : 100000);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const currentBalance = await NativeBridge.getBalance();
        setBalance(currentBalance);
      } catch (e) {
        console.error('Error fetching balance in TransferenciaBundle:', e);
      }
    };
    fetchBalance();
  }, []);

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
    <SafeAreaView style={commonStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={commonStyles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={commonStyles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Red Header Section with Gradient Overlays */}
          <View style={commonStyles.headerSection}>
            <View style={commonStyles.gradientOverlay1} />
            <View style={commonStyles.gradientOverlay2} />
            <View style={commonStyles.gradientOverlay3} />

            {/* Back Button */}
            <TouchableOpacity
              style={commonStyles.backButton}
              onPress={() => NativeBridge.closeActivity()}
              activeOpacity={0.7}
            >
              <Text style={commonStyles.backButtonText}>← Volver</Text>
            </TouchableOpacity>

            <Text style={[commonStyles.welcomeText, styles.headerWelcomeText]}>Pasar Plata</Text>
            <Text style={styles.balanceText}>Tu saldo actual: {formatCurrency(balance)}</Text>
          </View>

          {/* White Card (Overlapping) */}
          <View style={commonStyles.card}>
            {/* Form Section */}
            <View style={styles.formSection}>
              {/* Phone Input (Pill Shaped) */}
              <Text style={commonStyles.inputLabel}>Número de celular destino</Text>
              <View style={[commonStyles.inputWrapper, isPhoneFocused && commonStyles.inputWrapperFocused]}>
                <View style={commonStyles.iconContainer}>
                  <PhoneIcon />
                </View>
                <TextInput
                  style={commonStyles.textInput}
                  placeholder="Ej. 3001234567"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={destinationPhone}
                  onChangeText={setDestinationPhone}
                  onFocus={() => setIsPhoneFocused(true)}
                  onBlur={() => setIsPhoneFocused(false)}
                />
              </View>

              {/* Amount Input (Pill Shaped) */}
              <Text style={commonStyles.inputLabel}>Monto a transferir</Text>
              <View style={[commonStyles.inputWrapper, isAmountFocused && commonStyles.inputWrapperFocused]}>
                <View style={commonStyles.iconContainer}>
                  <DollarIcon />
                </View>
                <TextInput
                  style={commonStyles.textInput}
                  placeholder="Monto en pesos (Ej. 20000)"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="numeric"
                  value={amountStr}
                  onChangeText={setAmountStr}
                  onFocus={() => setIsAmountFocused(true)}
                  onBlur={() => setIsAmountFocused(false)}
                />
              </View>

              {/* Message Input (Pill Shaped) */}
              <Text style={commonStyles.inputLabel}>Mensaje (Opcional)</Text>
              <View style={[commonStyles.inputWrapper, isDescFocused && commonStyles.inputWrapperFocused]}>
                <View style={commonStyles.iconContainer}>
                  <MessageIcon />
                </View>
                <TextInput
                  style={commonStyles.textInput}
                  placeholder="Ej. Pago de almuerzo"
                  placeholderTextColor={COLORS.textMuted}
                  value={description}
                  onChangeText={setDescription}
                  onFocus={() => setIsDescFocused(true)}
                  onBlur={() => setIsDescFocused(false)}
                />
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[commonStyles.primaryButton, (!isFormValid || loading) && commonStyles.primaryButtonDisabled]}
                onPress={handleTransfer}
                disabled={!isFormValid || loading}
                activeOpacity={0.8}
              >
                <Text style={commonStyles.primaryButtonText}>
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



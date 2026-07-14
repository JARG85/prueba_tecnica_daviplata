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
  Image,
  Linking,
} from 'react-native';
import { NativeBridge } from '../services/bridge';
import { COLORS } from '../styles/theme';
import { commonStyles } from '../styles/commonStyles';

export default function LoginBundle() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    if (phone.length !== 10) {
      Alert.alert('Error', 'El teléfono debe tener 10 dígitos.');
      return;
    }

    if (password.length < 4) {
      Alert.alert('Error', 'La clave debe tener al menos 4 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await NativeBridge.login(phone, password);
    } catch (error: any) {
      Alert.alert('Ingreso Fallido', error.message || 'Credenciales inválidas o error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterRedirect = () => {
    Linking.openURL('https://www.davivienda.com').catch((err) =>
      console.error('Error opening URL:', err)
    );
  };

  const isFormValid = phone.length === 10 && password.length >= 4;

  // Custom Minimalist Gray Icons using simple styled Views
  const PhoneIcon = () => (
    <View style={styles.phoneIconOuter}>
      <View style={styles.phoneIconDot} />
    </View>
  );

  const LockIcon = () => (
    <View style={styles.lockIconOuter}>
      <View style={styles.lockIconShackle} />
      <View style={styles.lockIconBody} />
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
          {/* Red Header Section with Organic Gradient Overlays */}
          <View style={commonStyles.headerSection}>
            <View style={commonStyles.gradientOverlay1} />
            <View style={commonStyles.gradientOverlay2} />
            <View style={commonStyles.gradientOverlay3} />

            {/* Rounded Logo Container */}
            <View style={styles.logoRoundedContainer}>
              <Image
                source={require('../assets/images/logo_davivienda.png')}
                style={styles.headerLogoImage}
                resizeMode="contain"
              />
            </View>

            <Text style={commonStyles.welcomeText}>¡BIENVENIDO</Text>
            <Text style={commonStyles.welcomeText}>A DAVIVIENDA!</Text>
          </View>

          {/* White Login Card (Overlapping) */}
          <View style={commonStyles.card}>
            {/* Form Section */}
            <View style={styles.formSection}>
              {/* Phone Input (Pill Shaped) */}
              <View style={[commonStyles.inputWrapper, isPhoneFocused && commonStyles.inputWrapperFocused]}>
                <View style={commonStyles.iconContainer}>
                  <PhoneIcon />
                </View>
                <TextInput
                  style={commonStyles.textInput}
                  placeholder="Número de celular"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={phone}
                  onChangeText={setPhone}
                  onFocus={() => setIsPhoneFocused(true)}
                  onBlur={() => setIsPhoneFocused(false)}
                />
              </View>

              {/* Password Input (Pill Shaped) */}
              <View style={[commonStyles.inputWrapper, isPasswordFocused && commonStyles.inputWrapperFocused]}>
                <View style={commonStyles.iconContainer}>
                  <LockIcon />
                </View>
                <TextInput
                  style={commonStyles.textInput}
                  placeholder="Clave"
                  placeholderTextColor={COLORS.textMuted}
                  secureTextEntry={!showPassword}
                  keyboardType="default"
                  maxLength={32}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.eyeText}>{showPassword ? 'Ocultar' : 'Ver'}</Text>
                </TouchableOpacity>
              </View>

              {/* Forgot Password Link (Left Aligned) */}
              <TouchableOpacity style={styles.forgotPasswordContainer} activeOpacity={0.7}>
                <Text style={styles.forgotPasswordText}>¿Olvidó su clave?</Text>
              </TouchableOpacity>

              {/* Submit Button (Pill Shaped) */}
              <TouchableOpacity
                style={[commonStyles.primaryButton, (!isFormValid || loading) && commonStyles.primaryButtonDisabled]}
                onPress={handleLogin}
                disabled={!isFormValid || loading}
                activeOpacity={0.8}
              >
                <Text style={commonStyles.primaryButtonText}>
                  {loading ? 'Ingresando...' : 'INGRESAR'}
                </Text>
              </TouchableOpacity>

              {/* Register Link */}
              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>¿No tiene cuenta? </Text>
                <TouchableOpacity onPress={handleRegisterRedirect} activeOpacity={0.7}>
                  <Text style={styles.registerLink}>[Regístrese aquí]</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logoRoundedContainer: {
    width: 96,
    height: 96,
    borderRadius: 22,
    backgroundColor: COLORS.cardBg,
    borderWidth: 2,
    borderColor: COLORS.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  headerLogoImage: {
    width: 64,
    height: 64,
  },
  formSection: {
    width: '100%',
  },
  eyeButton: {
    paddingHorizontal: 4,
  },
  eyeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-start',
    paddingLeft: 8,
    marginBottom: 28,
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  registerText: {
    color: COLORS.textLight,
    fontSize: 14,
  },
  registerLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  phoneIconOuter: {
    width: 14,
    height: 24,
    borderRadius: 3,
    borderWidth: 1.8,
    borderColor: COLORS.textLight,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 3,
  },
  phoneIconDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.textLight,
  },
  lockIconOuter: {
    width: 18,
    height: 22,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  lockIconShackle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.8,
    borderColor: COLORS.textLight,
    borderBottomWidth: 0,
    marginBottom: -2,
  },
  lockIconBody: {
    width: 16,
    height: 11,
    borderRadius: 2,
    borderWidth: 1.8,
    borderColor: COLORS.textLight,
    backgroundColor: 'transparent',
  },
});

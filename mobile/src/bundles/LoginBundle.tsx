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
} from 'react-native';
import { NativeBridge } from '../services/bridge';

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

  const isFormValid = phone.length === 10 && password.length >= 4;

  const CircularLogo = () => (
    <View style={styles.circularLogoContainer}>
      <View style={styles.houseIconContainer}>
        {/* Roof (White Triangle) */}
        <View style={styles.roofWhite} />
        {/* Body (White Square) */}
        <View style={styles.bodyWhite}>
          {/* Door (Red Rectangle, matches red background) */}
          <View style={styles.doorRed} />
          {/* Left/Right window details to match Davivienda Casita icon */}
          <View style={styles.windowRedLeft} />
          <View style={styles.windowRedRight} />
        </View>
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
          {/* Red Header Section */}
          <View style={styles.headerSection}>
            <CircularLogo />
            <Text style={styles.welcomeText}>¡BIENVENIDO</Text>
            <Text style={styles.welcomeText}>A DAVIVIENDA!</Text>
          </View>

          {/* White Login Card (Overlapping) */}
          <View style={styles.card}>
            {/* Optional Corporate Logo placed neatly inside card */}
            <View style={styles.corporateLogoContainer}>
              <Image
                source={require('../assets/images/logo_davivienda.png')}
                style={styles.corporateLogo}
                resizeMode="contain"
              />
            </View>

            {/* Form Section */}
            <View style={styles.formSection}>
              {/* Phone Input (Pill Shaped) */}
              <View style={[styles.inputWrapper, isPhoneFocused && styles.inputWrapperFocused]}>
                <Text style={styles.inputIcon}>✉️</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Número de celular"
                  placeholderTextColor="#A0AEC0"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={phone}
                  onChangeText={setPhone}
                  onFocus={() => setIsPhoneFocused(true)}
                  onBlur={() => setIsPhoneFocused(false)}
                />
              </View>

              {/* Password Input (Pill Shaped) */}
              <View style={[styles.inputWrapper, isPasswordFocused && styles.inputWrapperFocused]}>
                <Text style={styles.inputIcon}>🔑</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Clave"
                  placeholderTextColor="#A0AEC0"
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

              {/* Submit Button (Pill Shaped with gradient-like background color) */}
              <TouchableOpacity
                style={[styles.loginButton, (!isFormValid || loading) && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={!isFormValid || loading}
                activeOpacity={0.8}
              >
                <Text style={styles.loginButtonText}>
                  {loading ? 'Ingresando...' : 'INGRESAR'}
                </Text>
              </TouchableOpacity>

              {/* Register Link */}
              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>¿No tiene cuenta? </Text>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text style={styles.registerLink}>[Regístrese aquí]</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Floating Action Arrow Button (Bottom Right) */}
      <TouchableOpacity style={styles.floatingActionButton} activeOpacity={0.8}>
        <Text style={styles.floatingActionText}>›</Text>
      </TouchableOpacity>
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
    backgroundColor: '#C8102E', // Davivienda red
    height: 330,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 35) : 30,
    paddingBottom: 50,
  },
  circularLogoContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  houseIconContainer: {
    alignItems: 'center',
  },
  roofWhite: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderBottomWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FFFFFF',
  },
  bodyWhite: {
    width: 28,
    height: 20,
    backgroundColor: '#FFFFFF',
    position: 'relative',
    marginTop: -1,
  },
  doorRed: {
    width: 8,
    height: 12,
    backgroundColor: '#C8102E', // Matches header red background
    position: 'absolute',
    bottom: 0,
    left: 10, // Centered: (28 - 8)/2 = 10
  },
  windowRedLeft: {
    width: 4,
    height: 4,
    backgroundColor: '#C8102E',
    position: 'absolute',
    top: 3,
    left: 3,
  },
  windowRedRight: {
    width: 4,
    height: 4,
    backgroundColor: '#C8102E',
    position: 'absolute',
    top: 3,
    right: 3,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 34,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 36,
    marginHorizontal: 16,
    marginTop: -45, // Overlaps the red header
    paddingHorizontal: 24,
    paddingVertical: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  corporateLogoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  corporateLogo: {
    width: 140,
    height: 40,
  },
  formSection: {
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6', // Gray input background from design
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
  inputIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#1A202C',
    height: '100%',
    padding: 0,
  },
  eyeButton: {
    paddingHorizontal: 4,
  },
  eyeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#C8102E',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-start',
    paddingLeft: 8,
    marginBottom: 28,
  },
  forgotPasswordText: {
    color: '#C8102E',
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
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
    marginBottom: 24,
  },
  loginButtonDisabled: {
    backgroundColor: '#F5A3A8',
    elevation: 0,
    shadowOpacity: 0,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  registerText: {
    color: '#718096',
    fontSize: 14,
  },
  registerLink: {
    color: '#C8102E',
    fontSize: 14,
    fontWeight: 'bold',
  },
  floatingActionButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#C8102E',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  floatingActionText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: 'bold',
    lineHeight: 30,
    textAlign: 'center',
  },
});

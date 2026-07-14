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
          {/* Red Header Section with Organic Gradient Overlays */}
          <View style={styles.headerSection}>
            <View style={styles.gradientOverlay1} />
            <View style={styles.gradientOverlay2} />
            <View style={styles.gradientOverlay3} />

            {/* Circular Logo Container */}
            <View style={styles.logoCircleContainer}>
              <Image
                source={require('../assets/images/logo_davivienda.png')}
                style={styles.headerLogoImage}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.welcomeText}>¡BIENVENIDO</Text>
            <Text style={styles.welcomeText}>A DAVIVIENDA!</Text>
          </View>

          {/* White Login Card (Overlapping) */}
          <View style={styles.card}>
            {/* Form Section */}
            <View style={styles.formSection}>
              {/* Phone Input (Pill Shaped) */}
              <View style={[styles.inputWrapper, isPhoneFocused && styles.inputWrapperFocused]}>
                <View style={styles.iconContainer}>
                  <PhoneIcon />
                </View>
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
                <View style={styles.iconContainer}>
                  <LockIcon />
                </View>
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

              {/* Submit Button (Pill Shaped) */}
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
    backgroundColor: '#C8102E', // Base Davivienda red
    height: 330,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 35) : 30,
    paddingBottom: 50,
    position: 'relative',
    overflow: 'hidden',
  },
  gradientOverlay1: {
    position: 'absolute',
    top: -120,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#E53E3E', // Soft crimson red glow
    opacity: 0.3,
  },
  gradientOverlay2: {
    position: 'absolute',
    bottom: -150,
    left: -100,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#7A091A', // Dark burgundy red depth shadow
    opacity: 0.5,
  },
  gradientOverlay3: {
    position: 'absolute',
    bottom: -20,
    right: -30,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#9B0F23',
    opacity: 0.45,
  },
  logoCircleContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FFFFFF',
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
  welcomeText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 34,
    zIndex: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 36,
    marginHorizontal: 16,
    marginTop: -45, // Overlaps the red header
    paddingHorizontal: 24,
    paddingVertical: 36,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  formSection: {
    width: '100%',
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
    borderColor: '#718096',
    borderBottomWidth: 0,
    marginBottom: -2,
  },
  lockIconBody: {
    width: 16,
    height: 11,
    borderRadius: 2,
    borderWidth: 1.8,
    borderColor: '#718096',
    backgroundColor: 'transparent',
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
});

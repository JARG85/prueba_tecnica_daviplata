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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F6F9" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <Image
              source={require('../assets/images/logo_davivienda.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* Login Card */}
          <View style={styles.card}>
            {/* Welcome Message */}
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeTitle}>¡Qué bueno verte!</Text>
              <Text style={styles.welcomeSubtitle}>
                Ingresa tus datos para acceder a tu plata de forma segura.
              </Text>
            </View>

            {/* Form */}
            <View style={styles.formSection}>
              {/* Phone Number Input */}
              <Text style={styles.inputLabel}>Número de celular</Text>
              <View style={[styles.inputWrapper, isPhoneFocused && styles.inputWrapperFocused]}>
                <Text style={styles.phonePrefix}>🇨🇴 +57</Text>
                <View style={styles.phoneDivider} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Celular de 10 dígitos"
                  placeholderTextColor="#A0AEC0"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={phone}
                  onChangeText={setPhone}
                  onFocus={() => setIsPhoneFocused(true)}
                  onBlur={() => setIsPhoneFocused(false)}
                />
              </View>

              {/* Password Input */}
              <Text style={styles.inputLabel}>Clave DaviPlata / Contraseña</Text>
              <View style={[styles.inputWrapper, isPasswordFocused && styles.inputWrapperFocused]}>
                <Text style={styles.inputIcon}>🔑</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Clave de ingreso"
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

              {/* Remember Me & Forgot Password */}
              <View style={styles.rememberRow}>
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => setRememberMe(!rememberMe)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                    {rememberMe && <Text style={styles.checkboxCheckmark}>✓</Text>}
                  </View>
                  <Text style={styles.rememberText}>Recordar celular</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.linkButton} activeOpacity={0.7}>
                  <Text style={styles.linkText}>¿Olvidó su clave?</Text>
                </TouchableOpacity>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.loginButton, (!isFormValid || loading) && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={!isFormValid || loading}
                activeOpacity={0.8}
              >
                <Text style={styles.loginButtonText}>
                  {loading ? 'Ingresando...' : 'Ingresar'}
                </Text>
              </TouchableOpacity>

              {/* Footer Links */}
              <View style={styles.footerLinks}>
                <TouchableOpacity style={styles.linkButton} activeOpacity={0.7}>
                  <Text style={styles.secondaryLinkText}>¿Cómo usar DaviPlata?</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.linkButton} activeOpacity={0.7}>
                  <Text style={styles.secondaryLinkTextBold}>¿No tienes cuenta? Regístrate</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Security Footer */}
          <View style={styles.securityBadgeContainer}>
            <Text style={styles.securityText}>🔒 Conexión segura encriptada de extremo a extremo.</Text>
            <Text style={[styles.securityText, { marginTop: 4 }]}>
              VIGILADO SUPERINTENDENCIA FINANCIERA DE COLOMBIA
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F9',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 45) : 30,
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoImage: {
    width: 220,
    height: 90,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 4,
  },
  welcomeSection: {
    marginBottom: 25,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 6,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#718096',
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: 10,
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
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 58,
    marginBottom: 20,
  },
  inputWrapperFocused: {
    borderColor: '#E50014',
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#E50014',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  phonePrefix: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A5568',
    marginRight: 8,
  },
  phoneDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#CBD5E0',
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A202C',
    height: '100%',
    padding: 0,
  },
  eyeButton: {
    paddingHorizontal: 8,
  },
  eyeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E50014',
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CBD5E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    borderColor: '#E50014',
    backgroundColor: '#E50014',
  },
  checkboxCheckmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 14,
  },
  rememberText: {
    fontSize: 14,
    color: '#4A5568',
  },
  linkText: {
    color: '#E50014',
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#E50014',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#E50014',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
    marginTop: 10,
    marginBottom: 24,
  },
  loginButtonDisabled: {
    backgroundColor: '#F5A3A8',
    ...Platform.select({
      ios: {
        shadowOpacity: 0,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  footerLinks: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 10,
  },
  linkButton: {
    paddingVertical: 6,
  },
  secondaryLinkText: {
    color: '#718096',
    fontSize: 14,
  },
  secondaryLinkTextBold: {
    color: '#E50014',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
  },
  securityBadgeContainer: {
    alignItems: 'center',
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#EDF2F7',
    paddingTop: 20,
  },
  securityText: {
    fontSize: 10,
    color: '#A0AEC0',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});

import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { NativeBridge } from '../../services/bridge';
import { COLORS } from '../../styles/theme';
import { styles } from './HomeBundle.styles';

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
    // Fetch initial balance to sync immediately
    const fetchBalance = async () => {
      try {
        const currentBalance = await NativeBridge.getBalance();
        setUserData((prev) => ({
          ...prev,
          balance: currentBalance,
        }));
      } catch (e) {
        console.error('Error fetching balance on HomeBundle mount:', e);
      }
    };
    fetchBalance();

    const subscription = NativeBridge.onLoadHome((data: any) => {
      console.log('[HomeBundle] Evento LOAD_HOME recibido de Android:', data);
      if (data) {
        setUserData((prev) => ({
          name: data.name || prev.name,
          phone: data.phone || prev.phone,
          balance: data.balance !== undefined ? data.balance : prev.balance,
        }));
      }
    });

    const expirationSubscription = NativeBridge.onSessionExpired(() => {
      console.log('[HomeBundle] Evento SESSION_EXPIRED recibido de Android');
    });

    return () => {
      subscription.remove();
      expirationSubscription.remove();
    };
  }, []);

  // Robust Colombian Peso formatting: $1.450.000,00
  const formatCurrency = (value: number) => {
    const fixedValue = value.toFixed(2);
    const [integerPart, decimalPart] = fixedValue.split('.');
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `$${formattedInteger},${decimalPart}`;
  };

  // Helper to split compound first names
  const getFirstName = (fullName: string) => {
    if (!fullName || fullName === 'Cargando...') return 'Usuario';
    const parts = fullName.split(' ');
    const commonCompoundPrefixes = ['carlos', 'juan', 'maria', 'ana', 'jose', 'luis', 'pedro', 'jorge'];
    if (parts.length >= 2 && commonCompoundPrefixes.includes(parts[0].toLowerCase())) {
      return `${parts[0]} ${parts[1]}`;
    }
    return parts[0];
  };

  // Custom Vector Icons for Buttons
  const TransferIcon = () => (
    <View style={styles.redIconContainer}>
      <View style={styles.arrowsRow}>
        <Text style={styles.arrowText}>⇄</Text>
      </View>
      <View style={styles.billOutline}>
        <View style={styles.billCircle} />
      </View>
    </View>
  );

  const HistoryIcon = () => (
    <View style={styles.redIconContainer}>
      <View style={styles.historyRow}>
        <View style={styles.documentSheet}>
          <View style={[styles.docLine, { width: '100%' }]} />
          <View style={[styles.docLine, { width: '70%' }]} />
          <View style={[styles.docLine, { width: '85%' }]} />
        </View>
        <View style={styles.smallClock}>
          <View style={styles.clockHand} />
        </View>
      </View>
    </View>
  );

  // Tabs Icons
  const HomeTabIcon = () => (
    <View style={styles.tabIconHome}>
      <View style={styles.tabIconHomeRoof} />
      <View style={styles.tabIconHomeBody} />
    </View>
  );

  const LockTabIcon = () => (
    <View style={styles.tabIconLock}>
      <View style={styles.tabIconLockShackle} />
      <View style={styles.tabIconLockBody} />
    </View>
  );

  const HelpTabIcon = () => (
    <View style={styles.tabIconHelp}>
      <Text style={styles.tabIconHelpText}>?</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Red Banner with Gradient Overlays */}
        <View style={styles.headerSection}>
          <View style={styles.gradientOverlay1} />
          <View style={styles.gradientOverlay2} />
          <View style={styles.gradientOverlay3} />

          <View style={styles.headerContentRow}>
            {/* Left Column: Welcome Greeting */}
            <View style={styles.headerWelcomeCol}>
              <Text style={styles.welcomeTextLabel}>¡Hola,</Text>
              <Text style={styles.welcomeTextName}>{getFirstName(userData.name)}!</Text>
              <Text style={styles.phoneText}>+57 {userData.phone}</Text>
            </View>

            {/* Right Column: Corporate Logo */}
            <View style={styles.logoCol}>
              <View style={styles.logoRoundedBadge}>
                <Image
                  source={require('../../assets/images/logo_davivienda.png')}
                  style={styles.headerLogoImageRight}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
        </View>

        {/* Available Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Tu Saldo Disponible:</Text>
          <Text style={styles.balanceValue}>{formatCurrency(userData.balance)}</Text>
          <Text style={styles.balanceCurrency}>Pesos Colombianos</Text>
        </View>

        {/* Main Grid Menu (Pasar Plata & Ver Movimientos) */}
        <View style={styles.menuGrid}>
          {/* Pasar Plata Button */}
          <TouchableOpacity
            style={styles.gridButton}
            onPress={() => NativeBridge.openTransfer()}
            activeOpacity={0.8}
          >
            <TransferIcon />
            <Text style={styles.gridButtonText}>Pasar</Text>
            <Text style={styles.gridButtonText}>Plata</Text>
          </TouchableOpacity>

          {/* Ver Movimientos Button */}
          <TouchableOpacity
            style={styles.gridButton}
            onPress={() => NativeBridge.openMovements()}
            activeOpacity={0.8}
          >
            <HistoryIcon />
            <Text style={styles.gridButtonText}>Ver</Text>
            <Text style={styles.gridButtonText}>Movimientos</Text>
          </TouchableOpacity>
        </View>

        {/* Cerrar Sesion Outline Button */}
        <TouchableOpacity
          style={styles.logoutContainer}
          onPress={() => NativeBridge.sendLogout()}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity style={styles.tabItem} activeOpacity={0.7}>
          <HomeTabIcon />
          <Text style={styles.tabTextActive}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} activeOpacity={0.7}>
          <LockTabIcon />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} activeOpacity={0.7}>
          <HelpTabIcon />
          <Text style={styles.tabText}>Ayuda</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}



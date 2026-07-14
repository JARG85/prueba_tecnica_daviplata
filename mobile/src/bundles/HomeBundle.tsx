import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  ScrollView,
  Image,
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

  // Robust Colombian Peso formatting: $1.450.000,00
  const formatCurrency = (value: number) => {
    const fixedValue = value.toFixed(2);
    const [integerPart, decimalPart] = fixedValue.split('.');
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `$${formattedInteger},${decimalPart}`;
  };

  // Helper to split compound first names like Carlos Alberto, Juan Carlos
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
      <StatusBar barStyle="light-content" backgroundColor="#C8102E" />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Red Banner with Gradient Overlays (Extends to top of screen) */}
        <View style={styles.headerSection}>
          <View style={styles.gradientOverlay1} />
          <View style={styles.gradientOverlay2} />
          <View style={styles.gradientOverlay3} />

          <View style={styles.headerContentRow}>
            {/* Left Column: Welcome Greeting */}
            <View style={styles.headerWelcomeCol}>
              <Text style={styles.welcomeTextName}>¡Hola, {getFirstName(userData.name)}!</Text>
              <Text style={styles.phoneText}>+57 {userData.phone}</Text>
            </View>

            {/* Right Column: Corporate Logo in rounded container */}
            <View style={styles.logoCol}>
              <View style={styles.logoRoundedBadge}>
                <Image
                  source={require('../assets/images/logo_davivienda.png')}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  headerSection: {
    backgroundColor: '#C8102E', // Davivienda red base
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ? StatusBar.currentHeight + 60 : 85) : 80,
    paddingHorizontal: 20,
    paddingBottom: 70,
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
  headerContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  headerWelcomeCol: {
    flex: 1,
    paddingRight: 10,
  },
  welcomeTextLabel: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 30,
  },
  welcomeTextName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 30,
    marginBottom: 6,
  },
  phoneText: {
    fontSize: 12,
    color: '#FEE2E2',
    opacity: 0.9,
  },
  logoCol: {
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoRoundedBadge: {
    width: 82,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  headerLogoImageRight: {
    width: 68,
    height: 40,
  },
  balanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginHorizontal: 16,
    marginTop: -25, // Overlaps the red banner
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
    zIndex: 20,
  },
  balanceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#718096',
    marginBottom: 6,
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#4A0E17',
    textAlign: 'center',
    marginBottom: 6,
  },
  balanceCurrency: {
    fontSize: 13,
    color: '#A0AEC0',
    fontWeight: '500',
  },
  menuGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 20,
  },
  gridButton: {
    flex: 0.485,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 22,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  redIconContainer: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  arrowsRow: {
    flexDirection: 'row',
    marginBottom: -4,
  },
  arrowText: {
    color: '#C8102E',
    fontSize: 26,
    fontWeight: 'bold',
  },
  billOutline: {
    width: 38,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#C8102E',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  billCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.8,
    borderColor: '#C8102E',
  },
  historyRow: {
    position: 'relative',
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  documentSheet: {
    width: 26,
    height: 32,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#C8102E',
    padding: 4,
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  docLine: {
    height: 2,
    backgroundColor: '#C8102E',
    borderRadius: 1,
  },
  smallClock: {
    position: 'absolute',
    bottom: 2,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#C8102E',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clockHand: {
    width: 4,
    height: 4,
    borderLeftWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: '#C8102E',
    transform: [{ rotate: '45deg' }],
  },
  gridButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A0E17',
    lineHeight: 18,
    textAlign: 'center',
  },
  logoutContainer: {
    alignSelf: 'center',
    marginTop: 44, // Pushed further down
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderWidth: 1.5,
    borderColor: '#C8102E',
    borderRadius: 22,
    backgroundColor: 'transparent',
  },
  logoutText: {
    color: '#C8102E',
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bottomTabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 15 : 0,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabIconHome: {
    width: 22,
    height: 20,
    alignItems: 'center',
  },
  tabIconHomeRoof: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#C8102E',
  },
  tabIconHomeBody: {
    width: 16,
    height: 10,
    backgroundColor: '#C8102E',
    position: 'relative',
    marginTop: -1,
  },
  tabIconLock: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 2,
  },
  tabIconLockShackle: {
    width: 10,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#718096',
    borderBottomWidth: 0,
    marginBottom: -1,
  },
  tabIconLockBody: {
    width: 14,
    height: 9,
    borderRadius: 1.5,
    backgroundColor: '#718096',
  },
  tabIconHelp: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#718096',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIconHelpText: {
    color: '#718096',
    fontSize: 11,
    fontWeight: 'bold',
    lineHeight: 12,
    textAlign: 'center',
  },
  tabTextActive: {
    fontSize: 10,
    color: '#C8102E',
    fontWeight: '700',
    marginTop: 3,
  },
  tabText: {
    fontSize: 10,
    color: '#718096',
    fontWeight: '600',
    marginTop: 3,
  },
});

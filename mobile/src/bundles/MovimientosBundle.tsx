import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { NativeBridge } from '../services/bridge';

export interface Movement {
  id: string;
  date: string;
  type: 'DEBITO' | 'CREDITO';
  value: number;
  description: string;
  status: string;
}

export default function MovimientosBundle() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovements = async () => {
      try {
        const data = await NativeBridge.getMovements();
        console.log('[MovimientosBundle] Movimientos recibidos:', data);
        setMovements(data);
      } catch (error) {
        console.error('[MovimientosBundle] Error al obtener movimientos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovements();
  }, []);

  // Colombian Peso formatting: $1.450.000,00
  const formatCurrency = (value: number) => {
    const fixedValue = value.toFixed(2);
    const [integerPart, decimalPart] = fixedValue.split('.');
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `$${formattedInteger},${decimalPart}`;
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const renderItem = ({ item }: { item: Movement }) => {
    const isDebito = item.type === 'DEBITO';

    return (
      <View style={styles.movementItem}>
        {/* Left Column: Transaction Indicator Circle and Details */}
        <View style={styles.leftCol}>
          <View style={[styles.indicatorCircle, isDebito ? styles.debitoCircle : styles.creditoCircle]}>
            <Text style={[styles.indicatorArrow, isDebito ? styles.debitoArrowColor : styles.creditoArrowColor]}>
              {isDebito ? '↗' : '↙'}
            </Text>
          </View>
          <View style={styles.detailsCol}>
            <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
            <Text style={styles.date}>{formatDate(item.date)}</Text>
            <View style={[styles.statusBadge, item.status === 'Exitosa' ? styles.statusSuccess : styles.statusPending]}>
              <Text style={[styles.statusText, item.status === 'Exitosa' ? styles.statusTextSuccess : styles.statusTextPending]}>
                {item.status}
              </Text>
            </View>
          </View>
        </View>

        {/* Right Column: Transaction Value and Type */}
        <View style={styles.rightCol}>
          <Text
            style={[
              styles.value,
              isDebito ? styles.debitoColor : styles.creditoColor,
            ]}
          >
            {isDebito ? '-' : '+'} {formatCurrency(item.value)}
          </Text>
          <Text style={styles.typeText}>{item.type}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#C8102E" />

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

        <Text style={styles.welcomeText}>Mis Movimientos</Text>
        <Text style={styles.balanceText}>Historial reciente de transacciones</Text>
      </View>

      {/* Overlapping White List Container */}
      <View style={styles.card}>
        {loading ? (
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="large" color="#C8102E" />
            <Text style={[styles.emptyText, { marginTop: 12 }]}>Cargando tus movimientos...</Text>
          </View>
        ) : movements.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>No tienes movimientos registrados.</Text>
          </View>
        ) : (
          <FlatList
            data={movements}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
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
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    marginHorizontal: 0, // Align full width for clean scroll lists
    marginTop: -40, // Overlaps the red header
    paddingHorizontal: 20,
    paddingTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    overflow: 'hidden',
  },
  listContainer: {
    paddingBottom: 40,
  },
  movementItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },
  indicatorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  debitoCircle: {
    backgroundColor: '#FEE2E2', // Soft red
  },
  creditoCircle: {
    backgroundColor: '#D1FAE5', // Soft green
  },
  indicatorArrow: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  debitoArrowColor: {
    color: '#C8102E', // Davivienda red
  },
  creditoArrowColor: {
    color: '#059669', // Safe emerald green
  },
  detailsCol: {
    flex: 1,
  },
  description: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 6,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusSuccess: {
    backgroundColor: '#E6FFFA',
  },
  statusPending: {
    backgroundColor: '#FEFCBF',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statusTextSuccess: {
    color: '#00A389',
  },
  statusTextPending: {
    color: '#B7791F',
  },
  rightCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
  },
  debitoColor: {
    color: '#C8102E',
  },
  creditoColor: {
    color: '#059669',
  },
  typeText: {
    fontSize: 10,
    color: '#A0AEC0',
    fontWeight: '600',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 15,
    color: '#A0AEC0',
    textAlign: 'center',
    fontWeight: '600',
  },
});

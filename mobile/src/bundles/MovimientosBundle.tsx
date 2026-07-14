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
import { COLORS } from '../styles/theme';
import { commonStyles } from '../styles/commonStyles';

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
    <SafeAreaView style={commonStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

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

        <Text style={[commonStyles.welcomeText, styles.headerWelcomeText]}>Mis Movimientos</Text>
        <Text style={styles.balanceText}>Historial reciente de transacciones</Text>
      </View>

      {/* Overlapping White List Container */}
      <View style={[commonStyles.card, styles.card]}>
        {loading ? (
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
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
  headerWelcomeText: {
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
    marginHorizontal: 0, // Align full width for clean scroll lists
    paddingHorizontal: 20,
    paddingTop: 24,
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
    backgroundColor: COLORS.bgSuccessLight, // Soft green
  },
  indicatorArrow: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  debitoArrowColor: {
    color: COLORS.primary, // Davivienda red
  },
  creditoArrowColor: {
    color: COLORS.textSuccess, // Safe emerald green
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
    color: COLORS.textLight,
    marginBottom: 6,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusSuccess: {
    backgroundColor: COLORS.bgSuccessBadge,
  },
  statusPending: {
    backgroundColor: COLORS.bgPendingBadge,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statusTextSuccess: {
    color: COLORS.textSuccessBadge,
  },
  statusTextPending: {
    color: COLORS.textPendingBadge,
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
    color: COLORS.primary,
  },
  creditoColor: {
    color: COLORS.textSuccess,
  },
  typeText: {
    fontSize: 10,
    color: COLORS.textMuted,
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
    color: COLORS.textMuted,
    textAlign: 'center',
    fontWeight: '600',
  },
});

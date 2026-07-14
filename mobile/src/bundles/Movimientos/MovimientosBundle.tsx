import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  FlatList,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { NativeBridge } from '../../services/bridge';
import { COLORS } from '../../styles/theme';
import { commonStyles } from '../../styles/commonStyles';
import { styles } from './MovimientosBundle.styles';

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



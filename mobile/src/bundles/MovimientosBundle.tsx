import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  StatusBar,
} from 'react-native';

export interface Movement {
  id: string;
  date: string;
  type: 'DEBITO' | 'CREDITO';
  value: number;
  description: string;
  status: string;
}

interface MovimientosBundleProps {
  movements?: Movement[];
}

const mockMovements: Movement[] = [
  {
    id: '1',
    date: '2026-07-13T10:15:30Z',
    type: 'DEBITO',
    value: 15000,
    description: 'Pago tienda de barrio',
    status: 'Exitosa',
  },
  {
    id: '2',
    date: '2026-07-12T18:45:00Z',
    type: 'CREDITO',
    value: 50000,
    description: 'Transferencia recibida de 3102223344',
    status: 'Exitosa',
  },
  {
    id: '3',
    date: '2026-07-10T14:30:00Z',
    type: 'DEBITO',
    value: 20000,
    description: 'Recarga celular',
    status: 'Exitosa',
  },
  {
    id: '4',
    date: '2026-07-09T09:00:00Z',
    type: 'CREDITO',
    value: 120000,
    description: 'Carga de DaviPlata',
    status: 'Exitosa',
  },
];

export default function MovimientosBundle(props: MovimientosBundleProps) {
  const movements = props.movements || mockMovements;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
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
        <View style={styles.leftCol}>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.date}>{formatDate(item.date)}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
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
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <View style={styles.header}>
        <Text style={styles.title}>Mis Movimientos</Text>
        <Text style={styles.subtitle}>Historial reciente de transacciones</Text>
      </View>

      {movements.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tienes movimientos registrados.</Text>
        </View>
      ) : (
        <FlatList
          data={movements}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
  },
  movementItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  leftCol: {
    flex: 1,
    paddingRight: 10,
  },
  rightCol: {
    alignItems: 'flex-end',
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#e6f7ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 6,
  },
  statusText: {
    fontSize: 11,
    color: '#1890ff',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  debitoColor: {
    color: '#e50014',
  },
  creditoColor: {
    color: '#2e7d32',
  },
  typeText: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

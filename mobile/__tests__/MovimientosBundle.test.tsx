import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import MovimientosBundle from '../src/bundles/Movimientos/MovimientosBundle';

const mockMovements = [
  {
    id: 'm1',
    date: '2026-07-14T20:00:00.000Z',
    type: 'DEBITO',
    value: 20000,
    description: 'Envío a cel 3001234567 - Pago almuerzo',
    status: 'Exitosa',
  },
  {
    id: 'm2',
    date: '2026-07-14T21:00:00.000Z',
    type: 'CREDITO',
    value: 50000,
    description: 'Recibido de cel 3009876543 - Abono',
    status: 'Exitosa',
  },
];

// Mock NativeBridge
jest.mock('../src/services/bridge', () => ({
  NativeBridge: {
    getMovements: jest.fn().mockResolvedValue(mockMovements),
    getBalance: jest.fn().mockResolvedValue(50000),
  },
}));

describe('MovimientosBundle', () => {
  it('renders movements history and transaction cards correctly', async () => {
    let component: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(() => {
      component = ReactTestRenderer.create(<MovimientosBundle />);
    });

    const instance = component!.root;

    // Verify header title
    const headerTitle = instance.findByProps({ children: 'Mis Movimientos' });
    expect(headerTitle).toBeTruthy();

    // Verify rendered movements item texts
    const firstTxDesc = instance.findByProps({ children: 'Envío a cel 3001234567 - Pago almuerzo' });
    expect(firstTxDesc).toBeTruthy();

    const secondTxDesc = instance.findByProps({ children: 'Recibido de cel 3009876543 - Abono' });
    expect(secondTxDesc).toBeTruthy();

    // Verify formatted values inside FlatList items
    const debitValue = instance.findByProps({ children: '- $20.000,00' });
    expect(debitValue).toBeTruthy();

    const creditValue = instance.findByProps({ children: '+ $50.000,00' });
    expect(creditValue).toBeTruthy();
  });
});

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import MovimientosBundle from '../src/bundles/Movimientos/MovimientosBundle';

// Mock NativeBridge with mocked movements inside the factory to avoid Jest hoisting issues
jest.mock('../src/services/bridge', () => {
  const innerMockMovements = [
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
  return {
    NativeBridge: {
      getMovements: jest.fn().mockResolvedValue(innerMockMovements),
      getBalance: jest.fn().mockResolvedValue(50000),
    },
  };
});

describe('MovimientosBundle', () => {
  it('renders movements history and transaction cards correctly', async () => {
    let component: ReactTestRenderer.ReactTestRenderer;
    
    await ReactTestRenderer.act(async () => {
      component = ReactTestRenderer.create(<MovimientosBundle />);
    });

    // Wait for useEffect fetchMovements to resolve and update state
    await ReactTestRenderer.act(async () => {
      await Promise.resolve();
    });

    const instance = component!.root;
    const texts = instance.findAllByType('Text');
    
    const findText = (query: string) => {
      return texts.find(t => {
        const textContent = Array.isArray(t.props.children)
          ? t.props.children.join('')
          : String(t.props.children || '');
        return textContent.includes(query);
      });
    };

    // Verify header title
    const headerTitle = findText('Mis Movimientos');
    expect(headerTitle).toBeTruthy();

    // Verify rendered movements item texts
    const firstTxDesc = findText('Envío a cel 3001234567 - Pago almuerzo');
    expect(firstTxDesc).toBeTruthy();

    const secondTxDesc = findText('Recibido de cel 3009876543 - Abono');
    expect(secondTxDesc).toBeTruthy();

    // Verify formatted values inside FlatList items
    const debitValue = findText('- $20.000,00');
    expect(debitValue).toBeTruthy();

    const creditValue = findText('+ $50.000,00');
    expect(creditValue).toBeTruthy();
  });
});

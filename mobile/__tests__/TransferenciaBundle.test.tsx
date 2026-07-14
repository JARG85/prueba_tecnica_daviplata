import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import TransferenciaBundle from '../src/bundles/Transferencia/TransferenciaBundle';

// Mock NativeBridge
jest.mock('../src/services/bridge', () => ({
  NativeBridge: {
    getBalance: jest.fn().mockResolvedValue(150000),
    sendTransfer: jest.fn().mockResolvedValue('Transferencia exitosa'),
    sendTransferSuccess: jest.fn(),
  },
}));

describe('TransferenciaBundle', () => {
  it('renders form inputs and transfer button correctly', async () => {
    let component: ReactTestRenderer.ReactTestRenderer;
    
    await ReactTestRenderer.act(async () => {
      component = ReactTestRenderer.create(<TransferenciaBundle balance={150000} />);
    });

    // Wait for useEffect fetchBalance to resolve and update state
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

    // Verify current balance is displayed in header
    const balanceText = findText('Tu saldo actual: $150.000,00');
    expect(balanceText).toBeTruthy();

    // Verify inputs (destination phone, amount, message)
    const textInputs = instance.findAllByType('TextInput');
    expect(textInputs.length).toBe(3);
    expect(textInputs[0].props.placeholder).toBe('Ej. 3001234567');
    expect(textInputs[1].props.placeholder).toBe('Monto en pesos (Ej. 20000)');

    // Verify submit button
    const submitBtnText = findText('TRANSFERIR PLATA');
    expect(submitBtnText).toBeTruthy();
  });
});

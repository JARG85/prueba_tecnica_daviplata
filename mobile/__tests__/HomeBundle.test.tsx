import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import HomeBundle from '../src/bundles/Home/HomeBundle';

// Mock NativeBridge
jest.mock('../src/services/bridge', () => ({
  NativeBridge: {
    getBalance: jest.fn().mockResolvedValue(75000),
    onLoadHome: jest.fn().mockReturnValue({ remove: jest.fn() }),
    onSessionExpired: jest.fn().mockReturnValue({ remove: jest.fn() }),
  },
}));

describe('HomeBundle', () => {
  it('renders welcome name and formatted balance', async () => {
    let component: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(() => {
      component = ReactTestRenderer.create(
        <HomeBundle name="Juan Carlos Perez" phone="3007654321" balance={75000} />
      );
    });

    const instance = component!.root;

    // Verify first name greeting (Carlos Alberto, Juan Carlos helper splits compound names)
    // Here "Juan Carlos Perez" splits: "Juan Carlos" is expected
    const greetingText = instance.findByProps({ children: 'Juan Carlos!' });
    expect(greetingText).toBeTruthy();

    // Verify phone format
    const phoneText = instance.findByProps({ children: '+57 3007654321' });
    expect(phoneText).toBeTruthy();

    // Verify initial balance rendering format
    const balanceValueText = instance.findByProps({ children: '$75.000,00' });
    expect(balanceValueText).toBeTruthy();
  });
});

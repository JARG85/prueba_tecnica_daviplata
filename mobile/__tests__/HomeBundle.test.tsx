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
    
    await ReactTestRenderer.act(async () => {
      component = ReactTestRenderer.create(
        <HomeBundle name="Juan Carlos Perez" phone="3007654321" balance={75000} />
      );
    });

    // Wait for useEffect fetchBalance to resolve and update state
    await ReactTestRenderer.act(async () => {
      await Promise.resolve();
    });

    const instance = component!.root;

    // Retrieve all Text components and helper to join children (in case of template variables)
    const texts = instance.findAllByType('Text');
    
    const findText = (query: string) => {
      return texts.find(t => {
        const textContent = Array.isArray(t.props.children)
          ? t.props.children.join('')
          : String(t.props.children || '');
        return textContent.includes(query);
      });
    };

    // Verify first name greeting (e.g. "Juan Carlos!")
    const greetingText = findText('Juan Carlos!');
    expect(greetingText).toBeTruthy();

    // Verify phone format
    const phoneText = findText('+57 3007654321');
    expect(phoneText).toBeTruthy();

    // Verify balance rendering format
    const balanceValueText = findText('$75.000,00');
    expect(balanceValueText).toBeTruthy();
  });
});

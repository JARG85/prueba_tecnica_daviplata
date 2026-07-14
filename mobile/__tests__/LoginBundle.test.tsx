import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import LoginBundle from '../src/bundles/Login/LoginBundle';

// Mock NativeBridge to prevent native module resolution errors
jest.mock('../src/services/bridge', () => ({
  NativeBridge: {
    login: jest.fn().mockResolvedValue(true),
    getBalance: jest.fn().mockResolvedValue(50000),
  },
}));

describe('LoginBundle', () => {
  it('renders inputs and login button correctly', async () => {
    let component: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(() => {
      component = ReactTestRenderer.create(<LoginBundle />);
    });

    const instance = component!.root;
    
    // Check that we render the phone input
    const textInputs = instance.findAllByType('TextInput');
    expect(textInputs.length).toBe(2); // Phone and Password

    // Verify placeholders
    expect(textInputs[0].props.placeholder).toBe('Número de celular');
    expect(textInputs[1].props.placeholder).toBe('Clave');

    // Verify login button text
    const loginButtonText = instance.findByProps({ children: 'INGRESAR' });
    expect(loginButtonText).toBeTruthy();
  });
});

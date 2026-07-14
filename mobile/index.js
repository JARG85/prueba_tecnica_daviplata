import { AppRegistry } from 'react-native';
import LoginBundle from './src/bundles/LoginBundle';
import HomeBundle from './src/bundles/HomeBundle';
import TransferenciaBundle from './src/bundles/TransferenciaBundle';
import MovimientosBundle from './src/bundles/MovimientosBundle';

// Cada bundle se registra de manera independiente para que Kotlin los llame por su llave (AppKey)
AppRegistry.registerComponent('LoginBundle', () => LoginBundle);
AppRegistry.registerComponent('HomeBundle', () => HomeBundle);
AppRegistry.registerComponent('TransferenciaBundle', () => TransferenciaBundle);
AppRegistry.registerComponent('MovimientosBundle', () => MovimientosBundle);

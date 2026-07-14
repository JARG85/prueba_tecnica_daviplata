import { AppRegistry } from 'react-native';
import LoginBundle from './src/bundles/Login/LoginBundle';
import HomeBundle from './src/bundles/Home/HomeBundle';
import TransferenciaBundle from './src/bundles/Transferencia/TransferenciaBundle';
import MovimientosBundle from './src/bundles/Movimientos/MovimientosBundle';

// Cada bundle se registra de manera independiente para que Kotlin los llame por su llave (AppKey)
AppRegistry.registerComponent('LoginBundle', () => LoginBundle);
AppRegistry.registerComponent('HomeBundle', () => HomeBundle);
AppRegistry.registerComponent('TransferenciaBundle', () => TransferenciaBundle);
AppRegistry.registerComponent('MovimientosBundle', () => MovimientosBundle);

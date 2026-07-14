import { NativeModules, DeviceEventEmitter, EmitterSubscription } from 'react-native';

const { DaviPlataBridge } = NativeModules;

export interface SessionData {
  sessionId: string;
  userId: string;
  name: string;
  phone: string;
  expiresAt: string;
}

export interface TransferData {
  destinationPhone: string;
  amount: number;
  description?: string;
}

export interface Movement {
  id: string;
  date: string;
  type: 'DEBITO' | 'CREDITO';
  value: number;
  description: string;
  status: string;
}

/**
 * Service to handle bidirectional communication between Kotlin (Android) and React Native.
 */
class NativeBridgeService {
  
  /**
   * Performs authentication via the native host layer.
   * Excludes direct RN fetch.
   */
  async login(phone: string, password: string): Promise<boolean> {
    if (DaviPlataBridge && DaviPlataBridge.login) {
      return await DaviPlataBridge.login(phone, password);
    } else {
      throw new Error('DaviPlataBridge.login no está disponible');
    }
  }

  /**
   * Performs transfer on the Rails backend via the native host layer.
   */
  async sendTransfer(destinationPhone: string, amount: number, description: string): Promise<string> {
    if (DaviPlataBridge && DaviPlataBridge.sendTransfer) {
      return await DaviPlataBridge.sendTransfer(destinationPhone, amount, description);
    } else {
      throw new Error('DaviPlataBridge.sendTransfer no está disponible');
    }
  }

  /**
   * Fetches the user movements from the Rails backend via the native host layer.
   */
  async getMovements(): Promise<Movement[]> {
    if (DaviPlataBridge && DaviPlataBridge.getMovements) {
      const data = await DaviPlataBridge.getMovements();
      // Map properties back if they are mapped to local spanish keys in backend
      // Backend: fecha, tipo, valor, descripcion, estado
      return data.map((m: any) => ({
        id: m.id || Math.random().toString(),
        date: m.fecha || m.date,
        type: m.tipo || m.type,
        value: m.valor !== undefined ? m.valor : m.value,
        description: m.descripcion || m.description,
        status: m.estado || m.status
      }));
    } else {
      throw new Error('DaviPlataBridge.getMovements no está disponible');
    }
  }

  sendLoginSuccess(session: SessionData): void {
    if (DaviPlataBridge && DaviPlataBridge.sendLoginSuccess) {
      DaviPlataBridge.sendLoginSuccess(JSON.stringify(session));
    } else {
      console.warn('DaviPlataBridge.sendLoginSuccess not available');
    }
  }

  openTransfer(): void {
    if (DaviPlataBridge && DaviPlataBridge.openTransfer) {
      DaviPlataBridge.openTransfer();
    } else {
      console.warn('DaviPlataBridge.openTransfer not available');
    }
  }

  openMovements(): void {
    if (DaviPlataBridge && DaviPlataBridge.openMovements) {
      DaviPlataBridge.openMovements();
    } else {
      console.warn('DaviPlataBridge.openMovements not available');
    }
  }

  sendTransferSuccess(transfer: TransferData): void {
    if (DaviPlataBridge && DaviPlataBridge.sendTransferSuccess) {
      DaviPlataBridge.sendTransferSuccess(JSON.stringify(transfer));
    } else {
      console.warn('DaviPlataBridge.sendTransferSuccess not available');
    }
  }

  sendLogout(): void {
    if (DaviPlataBridge && DaviPlataBridge.sendLogout) {
      DaviPlataBridge.sendLogout();
    } else {
      console.warn('DaviPlataBridge.sendLogout not available');
    }
  }

  closeActivity(): void {
    if (DaviPlataBridge && DaviPlataBridge.closeActivity) {
      DaviPlataBridge.closeActivity();
    } else {
      console.warn('DaviPlataBridge.closeActivity not available');
    }
  }

  onLoadHome(callback: (data: any) => void): EmitterSubscription {
    return DeviceEventEmitter.addListener('LOAD_HOME', callback);
  }

  onSessionExpired(callback: () => void): EmitterSubscription {
    return DeviceEventEmitter.addListener('SESSION_EXPIRED', callback);
  }
}

export const NativeBridge = new NativeBridgeService();


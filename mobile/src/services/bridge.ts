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

/**
 * Service to handle bidirectional communication between Kotlin (Android) and React Native.
 */
class NativeBridgeService {
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

  onLoadHome(callback: (data: any) => void): EmitterSubscription {
    return DeviceEventEmitter.addListener('LOAD_HOME', callback);
  }

  onSessionExpired(callback: () => void): EmitterSubscription {
    return DeviceEventEmitter.addListener('SESSION_EXPIRED', callback);
  }
}

export const NativeBridge = new NativeBridgeService();

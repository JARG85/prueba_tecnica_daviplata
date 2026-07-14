import { Platform, StatusBar } from 'react-native';

export const COLORS = {
  primary: '#C8102E',          // Davivienda Red
  primaryDisabled: '#F5A3A8',
  bgLight: '#F3F4F6',           // Screen background
  cardBg: '#FFFFFF',
  inputBg: '#F3F4F6',
  inputBgFocused: '#FFFFFF',
  border: '#E2E8F0',
  borderFocused: '#C8102E',
  textDark: '#1A202C',
  textMedium: '#4A5568',
  textLight: '#718096',
  textMuted: '#A0AEC0',
  textWhite: '#FFFFFF',
  textRed: '#C8102E',
  bgRedGlow: '#E53E3E',
  bgRedDark: '#7A091A',
  bgRedMedium: '#9B0F23',
  textSuccess: '#059669',
  bgSuccessLight: '#D1FAE5',
  textSuccessBadge: '#00A389',
  bgSuccessBadge: '#E6FFFA',
  textPendingBadge: '#B7791F',
  bgPendingBadge: '#FEFCBF',
  valueBurgundy: '#4A0E17',
};

export const SPACING = {
  statusBarPadding: Platform.OS === 'android' ? (StatusBar.currentHeight ? StatusBar.currentHeight + 30 : 55) : 50,
  statusBarPaddingHome: Platform.OS === 'android' ? (StatusBar.currentHeight ? StatusBar.currentHeight + 60 : 85) : 80,
  paddingHorizontal: 20,
};

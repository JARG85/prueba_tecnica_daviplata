import { StyleSheet } from 'react-native';
import { COLORS } from '../../styles/theme';

export const styles = StyleSheet.create({
  headerWelcomeText: {
    marginTop: 15,
  },
  balanceText: {
    fontSize: 15,
    color: '#FEE2E2',
    textAlign: 'center',
    marginTop: 6,
    fontWeight: '600',
    zIndex: 10,
  },
  formSection: {
    width: '100%',
  },
  phoneIconOuter: {
    width: 14,
    height: 24,
    borderRadius: 3,
    borderWidth: 1.8,
    borderColor: COLORS.textLight,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 3,
  },
  phoneIconDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.textLight,
  },
  dollarIconOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.8,
    borderColor: COLORS.textLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dollarIconText: {
    color: COLORS.textLight,
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 14,
  },
  messageIconOuter: {
    width: 22,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageIconBubble: {
    width: 20,
    height: 14,
    borderRadius: 3,
    borderWidth: 1.8,
    borderColor: COLORS.textLight,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  messageIconLine1: {
    width: '100%',
    height: 1.5,
    backgroundColor: COLORS.textLight,
    marginBottom: 2,
  },
  messageIconLine2: {
    width: '60%',
    height: 1.5,
    backgroundColor: COLORS.textLight,
    alignSelf: 'flex-start',
  },
});

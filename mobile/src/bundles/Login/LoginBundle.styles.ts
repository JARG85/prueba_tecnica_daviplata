import { StyleSheet, Platform } from 'react-native';
import { COLORS } from '../../styles/theme';

export const styles = StyleSheet.create({
  logoRoundedContainer: {
    width: 96,
    height: 96,
    borderRadius: 22,
    backgroundColor: COLORS.cardBg,
    borderWidth: 2,
    borderColor: COLORS.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  headerLogoImage: {
    width: 64,
    height: 64,
  },
  formSection: {
    width: '100%',
  },
  eyeButton: {
    paddingHorizontal: 4,
  },
  eyeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-start',
    paddingLeft: 8,
    marginBottom: 28,
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  registerText: {
    color: COLORS.textLight,
    fontSize: 14,
  },
  registerLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
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
  lockIconOuter: {
    width: 18,
    height: 22,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  lockIconShackle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.8,
    borderColor: COLORS.textLight,
    borderBottomWidth: 0,
    marginBottom: -2,
  },
  lockIconBody: {
    width: 16,
    height: 11,
    borderRadius: 2,
    borderWidth: 1.8,
    borderColor: COLORS.textLight,
    backgroundColor: 'transparent',
  },
});

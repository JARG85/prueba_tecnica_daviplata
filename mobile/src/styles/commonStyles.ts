import { StyleSheet, Platform, StatusBar } from 'react-native';
import { COLORS } from './theme';

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgLight,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  // Red Header Section with Gradient Blobs
  headerSection: {
    backgroundColor: COLORS.primary,
    height: 330,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ? StatusBar.currentHeight + 30 : 55) : 50,
    paddingBottom: 55,
    position: 'relative',
    overflow: 'hidden',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  gradientOverlay1: {
    position: 'absolute',
    top: -120,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: COLORS.bgRedGlow,
    opacity: 0.3,
  },
  gradientOverlay2: {
    position: 'absolute',
    bottom: -150,
    left: -100,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: COLORS.bgRedDark,
    opacity: 0.5,
  },
  gradientOverlay3: {
    position: 'absolute',
    bottom: -20,
    right: -30,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: COLORS.bgRedMedium,
    opacity: 0.45,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.textWhite,
    textAlign: 'center',
    lineHeight: 34,
    zIndex: 10,
  },
  // Overlapping Card
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 36,
    marginHorizontal: 16,
    marginTop: -45, // Overlaps the red header
    paddingHorizontal: 24,
    paddingVertical: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  // Pill Input Field
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMedium,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 25,
    paddingHorizontal: 20,
    height: 52,
    marginBottom: 20,
  },
  inputWrapperFocused: {
    backgroundColor: COLORS.inputBgFocused,
    borderWidth: 1.5,
    borderColor: COLORS.borderFocused,
  },
  iconContainer: {
    marginRight: 12,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textDark,
    height: '100%',
    padding: 0,
  },
  // Primary Red Pill Button
  primaryButton: {
    backgroundColor: COLORS.primary,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
    marginBottom: 24,
  },
  primaryButtonDisabled: {
    backgroundColor: COLORS.primaryDisabled,
    elevation: 0,
    shadowOpacity: 0,
  },
  primaryButtonText: {
    color: COLORS.textWhite,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  // Back Button
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? (StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 25) : 20,
    left: 20,
    zIndex: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 15,
  },
  backButtonText: {
    color: COLORS.textWhite,
    fontSize: 13,
    fontWeight: '700',
  },
});

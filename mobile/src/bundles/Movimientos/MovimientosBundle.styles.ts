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
  card: {
    flex: 1,
    marginHorizontal: 0, // Align full width for clean scroll lists
    paddingHorizontal: 20,
    paddingTop: 24,
    overflow: 'hidden',
  },
  listContainer: {
    paddingBottom: 40,
  },
  movementItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },
  indicatorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  debitoCircle: {
    backgroundColor: '#FEE2E2', // Soft red
  },
  creditoCircle: {
    backgroundColor: COLORS.bgSuccessLight, // Soft green
  },
  indicatorArrow: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  debitoArrowColor: {
    color: COLORS.primary, // Davivienda red
  },
  creditoArrowColor: {
    color: COLORS.textSuccess, // Safe emerald green
  },
  detailsCol: {
    flex: 1,
  },
  description: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 6,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusSuccess: {
    backgroundColor: COLORS.bgSuccessBadge,
  },
  statusPending: {
    backgroundColor: COLORS.bgPendingBadge,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statusTextSuccess: {
    color: COLORS.textSuccessBadge,
  },
  statusTextPending: {
    color: COLORS.textPendingBadge,
  },
  rightCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
  },
  debitoColor: {
    color: COLORS.primary,
  },
  creditoColor: {
    color: COLORS.textSuccess,
  },
  typeText: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.textMuted,
    textAlign: 'center',
    fontWeight: '600',
  },
});

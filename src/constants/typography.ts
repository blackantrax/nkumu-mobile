import { StyleSheet } from 'react-native';
import { COLORS } from './colors';

export const FONTS = {
  regular: undefined,
  medium: undefined,
  bold: undefined,
  heavy: undefined,
};

export const TEXT = StyleSheet.create({
  display: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  h1: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  h2: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  h3: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  body: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    color: COLORS.textMuted,
  },
  gold: {
    color: COLORS.gold,
    fontWeight: '700',
  },
});

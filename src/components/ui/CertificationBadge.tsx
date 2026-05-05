import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import type { CertificationLevel } from '../../data/artists';

const BADGE_CONFIG: Record<NonNullable<CertificationLevel>, { color: string; label: string; emoji: string }> = {
  bronze: { color: COLORS.bronze, label: 'BRONZE', emoji: '🥉' },
  silver: { color: COLORS.silver, label: 'ARGENT', emoji: '🥈' },
  gold: { color: COLORS.gold_cert, label: 'OR', emoji: '🥇' },
  platinum: { color: COLORS.platinum, label: 'PLATINE', emoji: '💿' },
  diamond: { color: COLORS.diamond, label: 'DIAMANT', emoji: '💎' },
};

interface Props {
  level: CertificationLevel;
  size?: 'sm' | 'md' | 'lg';
}

export function CertificationBadge({ level, size = 'md' }: Props) {
  if (!level) return null;
  const cfg = BADGE_CONFIG[level];
  const isLg = size === 'lg';
  const isSm = size === 'sm';

  return (
    <View style={[styles.badge, { borderColor: cfg.color }, isSm && styles.sm, isLg && styles.lg]}>
      <Text style={[styles.emoji, isSm && { fontSize: 10 }, isLg && { fontSize: 18 }]}>{cfg.emoji}</Text>
      {!isSm && (
        <Text style={[styles.label, { color: cfg.color }, isLg && { fontSize: 10 }]}>
          CAMUCA {cfg.label}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sm: {
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  lg: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  emoji: {
    fontSize: 12,
  },
  label: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
});

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/colors';
import { formatPrice } from '../../utils/formatPrice';
import type { Track } from '../../data/artists';

function formatDuration(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

interface Props {
  track: Track;
  index?: number;
  onPress: () => void;
  isPlaying?: boolean;
  isPreorder?: boolean;
}

export function TrackRow({ track, index, onPress, isPlaying, isPreorder }: Props) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.left}>
        {isPlaying ? (
          <View style={styles.playingDot}>
            <Text style={styles.playingBar}>▶</Text>
          </View>
        ) : (
          <Text style={styles.index}>{index ?? ''}</Text>
        )}
      </View>

      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, isPlaying && { color: COLORS.gold }]} numberOfLines={1}>
            {track.title}
          </Text>
          {track.explicit && (
            <View style={styles.explicitBadge}>
              <Text style={styles.explicitText}>E</Text>
            </View>
          )}
        </View>
        {track.featuring && track.featuring.length > 0 && (
          <Text style={styles.feat} numberOfLines={1}>
            feat. {track.featuring.join(', ')}
          </Text>
        )}
      </View>

      <View style={styles.right}>
        {isPreorder ? (
          <Text style={styles.preorder}>Pré-commande</Text>
        ) : (
          <>
            <Text style={styles.duration}>{formatDuration(track.durationSec)}</Text>
            <Text style={styles.price}>{formatPrice(track.priceXaf)}</Text>
          </>
        )}
        <TouchableOpacity style={styles.more}>
          <Text style={styles.moreDots}>•••</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  left: {
    width: 24,
    alignItems: 'center',
  },
  index: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  playingDot: {
    width: 24,
    alignItems: 'center',
  },
  playingBar: {
    color: COLORS.gold,
    fontSize: 12,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
  },
  feat: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  explicitBadge: {
    backgroundColor: COLORS.bgElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 2,
    paddingHorizontal: 3,
    paddingVertical: 1,
  },
  explicitText: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: '700',
  },
  right: {
    alignItems: 'flex-end',
    gap: 2,
  },
  duration: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  price: {
    fontSize: 11,
    color: COLORS.gold,
    fontWeight: '600',
  },
  preorder: {
    fontSize: 10,
    color: COLORS.gold,
    fontWeight: '600',
  },
  more: {
    padding: 4,
  },
  moreDots: {
    color: COLORS.textMuted,
    fontSize: 10,
    letterSpacing: 1,
  },
});

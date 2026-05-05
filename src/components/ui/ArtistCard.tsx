import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { COLORS } from '../../constants/colors';
import { formatStreams } from '../../utils/formatPrice';
import { CertificationBadge } from './CertificationBadge';
import type { Artist } from '../../data/artists';

const { width } = Dimensions.get('window');
const CARD_W = (width - 48) / 2;

interface Props {
  artist: Artist;
  onPress: () => void;
  variant?: 'grid' | 'row';
}

export function ArtistCard({ artist, onPress, variant = 'grid' }: Props) {
  if (variant === 'row') {
    return (
      <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.8}>
        <View style={[styles.rowAvatar, { backgroundColor: artist.imageColor }]}>
          <Text style={styles.rowAvatarText}>{artist.name[0]}</Text>
          {artist.verified && <View style={styles.verifiedDot} />}
        </View>
        <View style={styles.rowInfo}>
          <Text style={styles.rowName} numberOfLines={1}>{artist.name}</Text>
          <Text style={styles.rowMeta}>{artist.genre} · {formatStreams(artist.streams)} streams</Text>
        </View>
        {artist.certification && <CertificationBadge level={artist.certification} size="sm" />}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={[styles.card, { width: CARD_W }]} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.avatar, { backgroundColor: artist.imageColor }]}>
        <Text style={styles.avatarText}>{artist.name[0]}</Text>
        {artist.verified && (
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedIcon}>✓</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{artist.name}</Text>
        <Text style={styles.genre} numberOfLines={1}>{artist.genre}</Text>
        {artist.certification && <CertificationBadge level={artist.certification} size="sm" />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatar: {
    width: '100%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.6)',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedIcon: {
    color: '#000',
    fontSize: 12,
    fontWeight: '800',
  },
  info: {
    padding: 10,
    gap: 4,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  genre: {
    fontSize: 11,
    color: COLORS.textMuted,
  },

  // Row variant
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  rowAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  rowAvatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.6)',
  },
  verifiedDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.gold,
    borderWidth: 2,
    borderColor: COLORS.bg,
  },
  rowInfo: {
    flex: 1,
  },
  rowName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  rowMeta: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
});

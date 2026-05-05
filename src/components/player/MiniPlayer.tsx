import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { usePlayerStore } from '../../store/playerStore';

const { width } = Dimensions.get('window');

export function MiniPlayer() {
  const router = useRouter();
  const { currentTrack, currentArtist, isPlaying, progress, togglePlay } = usePlayerStore();
  const waveAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(80)).current;

  useEffect(() => {
    if (currentTrack) {
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, damping: 20 }).start();
    }
  }, [currentTrack]);

  useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(waveAnim, { toValue: 1, duration: 800, useNativeDriver: false }),
          Animated.timing(waveAnim, { toValue: 0, duration: 800, useNativeDriver: false }),
        ])
      ).start();
    } else {
      waveAnim.stopAnimation();
    }
  }, [isPlaying]);

  if (!currentTrack) return null;

  const progressWidth = progress * (width - 32);

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
      {/* Waveform progress bar */}
      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: progressWidth }]} />
      </View>

      <TouchableOpacity
        style={styles.inner}
        onPress={() => router.push('/player')}
        activeOpacity={0.9}
      >
        {/* Cover art placeholder */}
        <View style={[styles.cover, { backgroundColor: currentArtist?.imageColor ?? '#1a1a1a' }]}>
          <Text style={styles.coverText}>{currentTrack.title[0]}</Text>
        </View>

        {/* Track info */}
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{currentTrack.title}</Text>
          <Text style={styles.artist} numberOfLines={1}>{currentArtist?.name ?? ''}</Text>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity onPress={togglePlay} style={styles.playBtn}>
            <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.skipBtn}>
            <Text style={styles.skipIcon}>⏭</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.bgElevated,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: 4,
  },
  progressBg: {
    height: 2,
    backgroundColor: COLORS.border,
  },
  progressFill: {
    height: 2,
    backgroundColor: COLORS.gold,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 12,
  },
  cover: {
    width: 44,
    height: 44,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverText: {
    fontSize: 18,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.5)',
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  artist: {
    fontSize: 12,
    color: COLORS.gold,
    fontWeight: '500',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  playBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    color: '#000',
    fontSize: 14,
  },
  skipBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipIcon: {
    color: COLORS.textSecondary,
    fontSize: 18,
  },
});

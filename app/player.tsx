import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../src/constants/colors';
import { usePlayerStore } from '../src/store/playerStore';
import { ARTISTS, TRACKS } from '../src/data/artists';

const { width } = Dimensions.get('window');

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function PlayerModal() {
  const router = useRouter();
  const { currentTrack, currentArtist, isPlaying, progress, duration, togglePlay, seek } = usePlayerStore();

  if (!currentTrack || !currentArtist) {
    router.back();
    return null;
  }

  const elapsed = Math.floor(progress * duration);
  const remaining = duration - elapsed;

  // Build waveform bars (visual only)
  const BARS = 40;
  const bars = Array.from({ length: BARS }, (_, i) => ({
    height: 20 + Math.sin(i * 0.7) * 14 + Math.random() * 6,
    filled: i / BARS < progress,
  }));

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[currentArtist.imageColor, COLORS.bg, COLORS.bg]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.6 }}
      />

      <SafeAreaView style={styles.safe}>
        {/* Nav */}
        <View style={styles.nav}>
          <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
            <Text style={styles.chevron}>⌄</Text>
          </TouchableOpacity>
          <View style={styles.navCenter}>
            <Text style={styles.navLabel}>EN LECTURE</Text>
          </View>
          <TouchableOpacity style={styles.navBtn}>
            <Text style={styles.dots}>•••</Text>
          </TouchableOpacity>
        </View>

        {/* Large artwork */}
        <View style={[styles.artwork, { backgroundColor: currentArtist.imageColor }]}>
          <Text style={styles.artworkText}>{currentTrack.title[0]}</Text>
        </View>

        {/* Track info */}
        <View style={styles.trackInfo}>
          <View style={styles.trackMeta}>
            <View style={styles.trackNames}>
              <Text style={styles.trackTitle}>{currentTrack.title}</Text>
              <Text style={styles.trackArtist}>{currentArtist.name}</Text>
            </View>
            <TouchableOpacity style={styles.heartBtn}>
              <Text style={styles.heartIcon}>♡</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Waveform */}
        <TouchableOpacity
          style={styles.waveformWrap}
          onPress={(e) => {
            const tapX = e.nativeEvent.locationX;
            seek(tapX / (width - 48));
          }}
          activeOpacity={1}
        >
          <View style={styles.waveform}>
            {bars.map((bar, i) => (
              <View
                key={i}
                style={[
                  styles.bar,
                  { height: bar.height, backgroundColor: bar.filled ? COLORS.gold : COLORS.border },
                ]}
              />
            ))}
          </View>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{formatTime(elapsed)}</Text>
            <Text style={styles.timeText}>-{formatTime(remaining)}</Text>
          </View>
        </TouchableOpacity>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlBtn}>
            <Text style={styles.controlIcon}>🔀</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlBtn}>
            <Text style={styles.skipIcon}>⏮</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.playBtn} onPress={togglePlay}>
            <Text style={styles.playBtnIcon}>{isPlaying ? '⏸' : '▶'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlBtn}>
            <Text style={styles.skipIcon}>⏭</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlBtn}>
            <Text style={styles.controlIcon}>🔁</Text>
          </TouchableOpacity>
        </View>

        {/* Queue label */}
        <View style={styles.queueRow}>
          <Text style={styles.queueLabel}>LISTE DE LECTURE</Text>
          <TouchableOpacity>
            <Text style={styles.queueIcon}>☰</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  safe: { flex: 1, paddingHorizontal: 24 },
  nav: { flexDirection: 'row', alignItems: 'center', paddingTop: 12, paddingBottom: 20 },
  navBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  navCenter: { flex: 1, alignItems: 'center' },
  navLabel: { fontSize: 10, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 1.5 },
  chevron: { fontSize: 28, color: COLORS.textSecondary },
  dots: { color: COLORS.textSecondary, letterSpacing: 2 },
  artwork: {
    width: width - 48,
    height: width - 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  artworkText: { fontSize: 80, fontWeight: '900', color: 'rgba(255,255,255,0.3)' },
  trackInfo: { marginBottom: 28 },
  trackMeta: { flexDirection: 'row', alignItems: 'center' },
  trackNames: { flex: 1 },
  trackTitle: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary },
  trackArtist: { fontSize: 14, color: COLORS.gold, fontWeight: '600', marginTop: 4 },
  heartBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  heartIcon: { fontSize: 24, color: COLORS.textSecondary },

  waveformWrap: { marginBottom: 20 },
  waveform: { flexDirection: 'row', alignItems: 'flex-end', height: 56, gap: 2.5 },
  bar: { flex: 1, borderRadius: 2, minHeight: 4 },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  timeText: { fontSize: 12, color: COLORS.textMuted },

  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 },
  controlBtn: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  controlIcon: { fontSize: 20 },
  skipIcon: { fontSize: 28, color: COLORS.textPrimary },
  playBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtnIcon: { color: '#000', fontSize: 28 },

  queueRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTopWidth: 1, borderTopColor: COLORS.border },
  queueLabel: { fontSize: 10, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 1.5 },
  queueIcon: { color: COLORS.textSecondary, fontSize: 18 },
});

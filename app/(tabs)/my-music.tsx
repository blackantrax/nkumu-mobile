import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { ARTISTS, TRACKS } from '../../src/data/artists';
import { ArtistCard } from '../../src/components/ui/ArtistCard';
import { TrackRow } from '../../src/components/ui/TrackRow';
import { usePlayerStore } from '../../src/store/playerStore';
import { useAuthStore } from '../../src/store/authStore';

type Tab = 'achetes' | 'telecharges' | 'aimes' | 'artistes';

export default function MyMusicScreen() {
  const router = useRouter();
  const { user, switchToArtistMode } = useAuthStore();
  const { play, currentTrack } = usePlayerStore();
  const [tab, setTab] = useState<Tab>('achetes');

  const purchasedTracks = TRACKS.slice(0, 4);
  const likedTracks = TRACKS.slice(2, 7);
  const followedArtists = ARTISTS.slice(0, 5);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour, {user?.name ?? 'Ami'} 👋</Text>
          <Text style={styles.title}>Ma Musique</Text>
        </View>
        <TouchableOpacity style={styles.settingsBtn}>
          <Text style={styles.settingsIcon}>⚙</Text>
        </TouchableOpacity>
      </View>

      {/* Artist mode banner */}
      {user?.isArtist ? (
        <TouchableOpacity style={styles.artistBanner} onPress={() => router.push('/artist-dashboard')} activeOpacity={0.8}>
          <Text style={styles.artistBannerIcon}>🎤</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.artistBannerTitle}>Mode Artiste actif</Text>
            <Text style={styles.artistBannerSub}>Voir mes analytics, paroles & CAMUCA</Text>
          </View>
          <Text style={styles.artistBannerArrow}>›</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.artistBannerInvite}
          activeOpacity={0.8}
          onPress={() => {
            Alert.alert(
              'Mode Artiste',
              'Êtes-vous un artiste NKUMU ? Activez le Mode Artiste pour accéder à vos analytics, paroles et certification CAMUCA.',
              [
                { text: 'Annuler', style: 'cancel' },
                { text: 'Activer', onPress: () => { switchToArtistMode('lifka'); router.push('/artist-dashboard'); } },
              ]
            );
          }}
        >
          <Text style={styles.artistBannerIcon}>🎤</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.artistBannerInviteTitle}>Vous êtes artiste ?</Text>
            <Text style={styles.artistBannerSub}>Accédez à votre espace artiste</Text>
          </View>
          <Text style={styles.artistBannerArrow}>›</Text>
        </TouchableOpacity>
      )}

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabList}>
        {([
          { key: 'achetes', label: 'Achetés' },
          { key: 'telecharges', label: 'Téléchargés' },
          { key: 'aimes', label: 'Aimés' },
          { key: 'artistes', label: 'Artistes suivis' },
        ] as { key: Tab; label: string }[]).map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tabBtn, tab === t.key && styles.tabBtnActive]}
            onPress={() => setTab(t.key)}
          >
            <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {tab === 'achetes' && (
          <View>
            {purchasedTracks.map((track, i) => {
              const artist = ARTISTS.find((a) => a.id === track.artistId)!;
              return (
                <TrackRow
                  key={track.id}
                  track={track}
                  index={i + 1}
                  onPress={() => play(track, artist)}
                  isPlaying={currentTrack?.id === track.id}
                />
              );
            })}
            {purchasedTracks.length === 0 && <EmptyState icon="🛒" text="Aucun titre acheté pour l'instant" />}
          </View>
        )}

        {tab === 'telecharges' && (
          <View>
            {purchasedTracks.slice(0, 2).map((track, i) => {
              const artist = ARTISTS.find((a) => a.id === track.artistId)!;
              return (
                <TrackRow
                  key={track.id}
                  track={track}
                  index={i + 1}
                  onPress={() => play(track, artist)}
                  isPlaying={currentTrack?.id === track.id}
                />
              );
            })}
          </View>
        )}

        {tab === 'aimes' && (
          <View>
            {likedTracks.map((track, i) => {
              const artist = ARTISTS.find((a) => a.id === track.artistId)!;
              return (
                <TrackRow
                  key={track.id}
                  track={track}
                  index={i + 1}
                  onPress={() => play(track, artist)}
                  isPlaying={currentTrack?.id === track.id}
                />
              );
            })}
          </View>
        )}

        {tab === 'artistes' && (
          <View style={styles.artistList}>
            {followedArtists.map((artist) => (
              <ArtistCard
                key={artist.id}
                artist={artist}
                variant="row"
                onPress={() => router.push(`/artist/${artist.id}`)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={{ alignItems: 'center', paddingTop: 60, gap: 12 }}>
      <Text style={{ fontSize: 48 }}>{icon}</Text>
      <Text style={{ color: COLORS.textMuted, fontSize: 15 }}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  greeting: { fontSize: 13, color: COLORS.textMuted },
  title: { fontSize: 28, fontWeight: '900', color: COLORS.textPrimary, marginTop: 2 },
  settingsBtn: { padding: 8 },
  settingsIcon: { fontSize: 20, color: COLORS.textSecondary },
  tabList: { paddingHorizontal: 16, paddingBottom: 16, gap: 8 },
  tabBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.border },
  tabBtnActive: { backgroundColor: COLORS.goldSubtle, borderColor: COLORS.gold },
  tabText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  tabTextActive: { color: COLORS.gold },
  artistList: { paddingBottom: 20 },
  artistBanner: { marginHorizontal: 16, marginBottom: 12, backgroundColor: COLORS.goldSubtle, borderWidth: 1, borderColor: COLORS.gold, borderRadius: 14, flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  artistBannerInvite: { marginHorizontal: 16, marginBottom: 12, backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.border, borderRadius: 14, flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  artistBannerIcon: { fontSize: 24 },
  artistBannerTitle: { fontSize: 14, fontWeight: '700', color: COLORS.gold },
  artistBannerInviteTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  artistBannerSub: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  artistBannerArrow: { fontSize: 22, color: COLORS.textMuted },
});

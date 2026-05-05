import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../src/constants/colors';
import { ALBUMS, ARTISTS, TRACKS } from '../../src/data/artists';
import { TrackRow } from '../../src/components/ui/TrackRow';
import { CertificationBadge } from '../../src/components/ui/CertificationBadge';
import { formatPrice } from '../../src/utils/formatPrice';
import { usePlayerStore } from '../../src/store/playerStore';

export default function AlbumScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { play, currentTrack } = usePlayerStore();
  const [purchased, setPurchased] = useState(false);

  const album = ALBUMS.find((a) => a.id === id);
  if (!album) return null;

  const artist = ARTISTS.find((a) => a.id === album.artistId);
  const tracks = TRACKS.filter((t) => t.albumId === id);

  function buyAlbum() {
    Alert.alert(
      'Acheter l\'album',
      `${album.title}\n${formatPrice(album.priceXaf)}\n\nChoisir le mode de paiement :`,
      [
        { text: 'Orange Money 📱', onPress: () => { Alert.alert('Paiement initié', 'Orange Money'); setPurchased(true); } },
        { text: 'MTN MoMo 📲', onPress: () => { Alert.alert('Paiement initié', 'MTN MoMo'); setPurchased(true); } },
        { text: 'Carte bancaire 💳', onPress: () => { Alert.alert('Paiement initié', 'Stripe'); setPurchased(true); } },
        { text: 'Annuler', style: 'cancel' },
      ]
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Hero */}
        <LinearGradient colors={[album.coverColor, COLORS.bg]} style={styles.hero}>
          <SafeAreaView edges={['top']}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
          </SafeAreaView>

          <View style={styles.coverArt}>
            <Text style={styles.coverArtText}>{album.title[0]}</Text>
            {album.explicit && (
              <View style={styles.explicitBadge}>
                <Text style={styles.explicitText}>E</Text>
              </View>
            )}
          </View>
        </LinearGradient>

        {/* Info */}
        <View style={styles.info}>
          {album.isPreorder && (
            <View style={styles.preorderBanner}>
              <Text style={styles.preorderText}>
                Album en pré-commande · Sortie officielle le{' '}
                {new Date(album.releaseDate!).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </Text>
            </View>
          )}

          <Text style={styles.albumTitle}>{album.title}</Text>
          {artist && (
            <TouchableOpacity
              style={styles.artistRow}
              onPress={() => router.push(`/artist/${artist.id}`)}
            >
              <Text style={styles.artistName}>{artist.name}</Text>
              {artist.certification && <CertificationBadge level={artist.certification} size="sm" />}
            </TouchableOpacity>
          )}
          <Text style={styles.albumMeta}>{album.year} · {album.trackCount} titres · {formatPrice(album.priceXaf)}</Text>
        </View>

        {/* CTA */}
        <View style={styles.ctaRow}>
          {!purchased ? (
            <TouchableOpacity style={styles.buyBtn} onPress={buyAlbum}>
              <Text style={styles.buyBtnText}>
                {album.isPreorder ? '🔔 Pré-commander · ' : '🛒 Acheter · '}
                {formatPrice(album.priceXaf)}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.purchasedBanner}>
              <Text style={styles.purchasedText}>✓ Acheté — disponible dans Ma Musique</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.playBtn}
            onPress={() => tracks[0] && artist && play(tracks[0], artist)}
          >
            <Text style={styles.playIcon}>▶</Text>
          </TouchableOpacity>
        </View>

        {/* Tracklist */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Titres</Text>
          {tracks.length > 0 ? (
            tracks.map((track, i) => (
              <TrackRow
                key={track.id}
                track={track}
                index={i + 1}
                onPress={() => artist && play(track, artist)}
                isPlaying={currentTrack?.id === track.id}
                isPreorder={album.isPreorder}
              />
            ))
          ) : (
            <Text style={styles.noTracks}>La liste des titres sera disponible à la sortie de l'album.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  hero: { paddingBottom: 24, paddingHorizontal: 20 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.overlay40, alignItems: 'center', justifyContent: 'center', marginTop: 8, alignSelf: 'flex-start' },
  backIcon: { color: COLORS.textPrimary, fontSize: 18 },
  coverArt: { width: 200, height: 200, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: 20, position: 'relative' },
  coverArtText: { fontSize: 60, fontWeight: '900', color: 'rgba(255,255,255,0.4)' },
  explicitBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: COLORS.bgElevated, borderRadius: 3, paddingHorizontal: 5, paddingVertical: 2 },
  explicitText: { color: COLORS.textMuted, fontSize: 10, fontWeight: '700' },
  info: { paddingHorizontal: 20, paddingTop: 20, gap: 8 },
  preorderBanner: { backgroundColor: COLORS.goldSubtle, borderWidth: 1, borderColor: COLORS.gold, borderRadius: 8, padding: 10 },
  preorderText: { color: COLORS.gold, fontSize: 12, fontWeight: '600' },
  albumTitle: { fontSize: 24, fontWeight: '900', color: COLORS.textPrimary },
  artistRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  artistName: { fontSize: 16, color: COLORS.gold, fontWeight: '700' },
  albumMeta: { fontSize: 13, color: COLORS.textMuted },
  ctaRow: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 16, gap: 12, alignItems: 'center' },
  buyBtn: { flex: 1, height: 50, backgroundColor: COLORS.gold, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  buyBtnText: { color: '#000', fontWeight: '800', fontSize: 15 },
  purchasedBanner: { flex: 1, height: 50, backgroundColor: COLORS.bgCard, borderRadius: 25, borderWidth: 1, borderColor: COLORS.green, alignItems: 'center', justifyContent: 'center' },
  purchasedText: { color: COLORS.green, fontWeight: '700', fontSize: 14 },
  playBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  playIcon: { color: COLORS.textPrimary, fontSize: 18 },
  section: { paddingTop: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary, paddingHorizontal: 20, marginBottom: 8 },
  noTracks: { color: COLORS.textMuted, fontSize: 14, paddingHorizontal: 20, paddingVertical: 20, lineHeight: 20 },
});

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../src/constants/colors';
import { ARTISTS, ALBUMS, TRACKS } from '../../src/data/artists';
import { CertificationBadge } from '../../src/components/ui/CertificationBadge';
import { TrackRow } from '../../src/components/ui/TrackRow';
import { ArtistCard } from '../../src/components/ui/ArtistCard';
import { formatStreams, formatPrice } from '../../src/utils/formatPrice';
import { usePlayerStore } from '../../src/store/playerStore';

const { width } = Dimensions.get('window');
const HERO_H = 300;

export default function ArtistProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { play, currentTrack } = usePlayerStore();
  const [subscribed, setSubscribed] = useState(false);

  const artist = ARTISTS.find((a) => a.id === id);
  if (!artist) return null;

  const albums = ALBUMS.filter((a) => a.artistId === id);
  const bestTracks = TRACKS.filter((t) => t.artistId === id).sort((a, b) => b.streams - a.streams);
  const similar = ARTISTS.filter((a) => a.id !== id && a.genre === artist.genre).slice(0, 4);

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Hero */}
        <View style={styles.hero}>
          <LinearGradient
            colors={[artist.imageColor, COLORS.bg]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
          <SafeAreaView edges={['top']} style={styles.heroNav}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <View style={styles.heroNavRight}>
              <TouchableOpacity style={styles.shareBtn}><Text style={styles.shareIcon}>↗</Text></TouchableOpacity>
              <TouchableOpacity style={styles.infoBtn}><Text style={styles.infoIcon}>ℹ</Text></TouchableOpacity>
            </View>
          </SafeAreaView>

          {/* Artist avatar */}
          <View style={styles.heroAvatar}>
            <Text style={styles.heroAvatarText}>{artist.name[0]}</Text>
          </View>

          {/* Artist info */}
          <View style={styles.heroInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.heroName}>{artist.name}</Text>
              {artist.verified && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedIcon}>✓</Text>
                </View>
              )}
            </View>
            {artist.certification && (
              <CertificationBadge level={artist.certification} size="lg" />
            )}
            <Text style={styles.heroHandle}>{artist.handle}</Text>
          </View>
        </View>

        {/* Stats + CTA */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{artist.subscribers.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Abonnés</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{formatStreams(artist.streams)}</Text>
            <Text style={styles.statLabel}>Streams</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{albums.length}</Text>
            <Text style={styles.statLabel}>Albums</Text>
          </View>
        </View>

        <View style={styles.ctaRow}>
          <TouchableOpacity
            style={[styles.subscribeBtn, subscribed && styles.subscribedBtn]}
            onPress={() => setSubscribed((s) => !s)}
          >
            <Text style={styles.subscribeBtnIcon}>{subscribed ? '✓' : '+'}</Text>
            <Text style={styles.subscribeBtnText}>{subscribed ? 'Abonné' : 'S\'abonner'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.playAllBtn}
            onPress={() => bestTracks[0] && play(bestTracks[0], artist)}
          >
            <Text style={styles.playAllIcon}>▶</Text>
          </TouchableOpacity>
        </View>

        {/* Social */}
        {(artist.socialFb || artist.socialX) && (
          <View style={styles.socialRow}>
            {artist.socialFb && <TouchableOpacity style={styles.socialBtn}><Text style={styles.socialIcon}>f</Text></TouchableOpacity>}
            {artist.socialX && <TouchableOpacity style={styles.socialBtn}><Text style={styles.socialIcon}>𝕏</Text></TouchableOpacity>}
            <Text style={styles.location}>📍 {artist.location}</Text>
          </View>
        )}

        {/* Bio */}
        {artist.bio && (
          <View style={styles.bioSection}>
            <Text style={styles.sectionLabel}>BIOGRAPHIE</Text>
            <Text style={styles.bio}>{artist.bio}</Text>
          </View>
        )}

        {/* Certification explainer */}
        {artist.certification && (
          <View style={styles.certSection}>
            <View style={styles.certHeader}>
              <CertificationBadge level={artist.certification} size="lg" />
              <Text style={styles.certTitle}>Certification CAMUCA officielle</Text>
            </View>
            <Text style={styles.certDesc}>
              Délivrée par l'Autorité de Certification de la Musique Camerounaise (CAMUCA), enregistrée en Ontario, Canada.
              {artist.certification === 'diamond' && ' Cet artiste a franchi le cap du million de streams certifiés — le plus haut niveau de reconnaissance.'}
              {artist.certification === 'platinum' && ' Cet artiste a dépassé les 500 000 streams certifiés.'}
              {artist.certification === 'gold' && ' Cet artiste a dépassé les 100 000 streams certifiés.'}
              {artist.certification === 'silver' && ' Cet artiste a dépassé les 50 000 streams certifiés.'}
              {artist.certification === 'bronze' && ' Cet artiste a dépassé les 10 000 streams certifiés.'}
            </Text>
          </View>
        )}

        {/* Recent Albums */}
        {albums.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Albums récents</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.albumRow}>
              {albums.map((album) => (
                <TouchableOpacity
                  key={album.id}
                  style={styles.albumCard}
                  onPress={() => router.push(`/album/${album.id}`)}
                  activeOpacity={0.85}
                >
                  <View style={[styles.albumCover, { backgroundColor: album.coverColor }]}>
                    <Text style={styles.albumCoverText}>{album.title[0]}</Text>
                    {album.isPreorder && (
                      <View style={styles.preorderTag}>
                        <Text style={styles.preorderTagText}>PRÉ-COMMANDE</Text>
                      </View>
                    )}
                    {album.explicit && (
                      <View style={styles.explicitTag}>
                        <Text style={styles.explicitTagText}>E</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.albumTitle} numberOfLines={2}>{album.title}</Text>
                  <Text style={styles.albumArtist}>{artist.name}</Text>
                  <Text style={styles.albumPrice}>{formatPrice(album.priceXaf)}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Best Listening */}
        {bestTracks.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Meilleurs titres</Text>
              <TouchableOpacity><Text style={styles.seeAll}>Voir tout</Text></TouchableOpacity>
            </View>
            {bestTracks.slice(0, 5).map((track, i) => (
              <TrackRow
                key={track.id}
                track={track}
                index={i + 1}
                onPress={() => play(track, artist)}
                isPlaying={currentTrack?.id === track.id}
              />
            ))}
          </View>
        )}

        {/* Similar artists */}
        {similar.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Découvrez aussi</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.similarRow}>
              {similar.map((a) => (
                <ArtistCard
                  key={a.id}
                  artist={a}
                  onPress={() => router.push(`/artist/${a.id}`)}
                />
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  hero: { height: HERO_H, position: 'relative', justifyContent: 'flex-end', paddingBottom: 20, paddingHorizontal: 20 },
  heroNav: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.overlay40, alignItems: 'center', justifyContent: 'center' },
  backIcon: { color: COLORS.textPrimary, fontSize: 18 },
  heroNavRight: { flexDirection: 'row', gap: 8 },
  shareBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.overlay40, alignItems: 'center', justifyContent: 'center' },
  shareIcon: { color: COLORS.textPrimary, fontSize: 16 },
  infoBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.overlay40, alignItems: 'center', justifyContent: 'center' },
  infoIcon: { color: COLORS.textPrimary, fontSize: 14 },
  heroAvatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 12, borderWidth: 2, borderColor: COLORS.gold },
  heroAvatarText: { fontSize: 36, fontWeight: '900', color: 'rgba(255,255,255,0.7)' },
  heroInfo: { gap: 8 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  heroName: { fontSize: 28, fontWeight: '900', color: COLORS.textPrimary },
  verifiedBadge: { width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.gold, alignItems: 'center', justifyContent: 'center' },
  verifiedIcon: { color: '#000', fontSize: 12, fontWeight: '900' },
  heroHandle: { fontSize: 13, color: COLORS.textSecondary },

  statsRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 20, paddingHorizontal: 24, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary },
  statLabel: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  statDivider: { width: 1, height: 36, backgroundColor: COLORS.border },

  ctaRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 16, gap: 12, alignItems: 'center' },
  subscribeBtn: { flex: 1, height: 46, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 23, borderWidth: 1.5, borderColor: COLORS.gold },
  subscribedBtn: { backgroundColor: COLORS.goldSubtle },
  subscribeBtnIcon: { color: COLORS.gold, fontSize: 16, fontWeight: '700' },
  subscribeBtnText: { color: COLORS.gold, fontWeight: '700', fontSize: 15 },
  playAllBtn: { width: 46, height: 46, borderRadius: 23, backgroundColor: COLORS.gold, alignItems: 'center', justifyContent: 'center' },
  playAllIcon: { color: '#000', fontSize: 18 },

  socialRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, gap: 12, marginBottom: 16 },
  socialBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  socialIcon: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '700' },
  location: { fontSize: 12, color: COLORS.textMuted, flex: 1 },

  bioSection: { paddingHorizontal: 20, marginBottom: 20 },
  sectionLabel: { fontSize: 10, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 1.5, marginBottom: 8 },
  bio: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 },

  certSection: { marginHorizontal: 16, marginBottom: 24, backgroundColor: COLORS.bgCard, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: COLORS.border, gap: 10 },
  certHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  certTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, flex: 1 },
  certDesc: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },

  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: COLORS.textPrimary, paddingHorizontal: 16, marginBottom: 12 },
  seeAll: { fontSize: 13, color: COLORS.gold, fontWeight: '600' },
  albumRow: { paddingHorizontal: 16, gap: 12 },
  albumCard: { width: 140 },
  albumCover: { width: 140, height: 140, borderRadius: 10, alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' },
  albumCoverText: { fontSize: 40, fontWeight: '900', color: 'rgba(255,255,255,0.3)' },
  preorderTag: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: COLORS.gold, paddingVertical: 4 },
  preorderTagText: { color: '#000', fontSize: 8, fontWeight: '800', textAlign: 'center', letterSpacing: 0.5 },
  explicitTag: { position: 'absolute', top: 8, right: 8, backgroundColor: COLORS.bgElevated, borderWidth: 1, borderColor: COLORS.border, borderRadius: 3, paddingHorizontal: 4, paddingVertical: 1 },
  explicitTagText: { color: COLORS.textMuted, fontSize: 9, fontWeight: '700' },
  albumTitle: { marginTop: 8, fontSize: 13, fontWeight: '700', color: COLORS.textPrimary, lineHeight: 17 },
  albumArtist: { fontSize: 11, color: COLORS.gold, fontWeight: '500' },
  albumPrice: { fontSize: 11, color: COLORS.textMuted },
  similarRow: { paddingHorizontal: 16, gap: 12 },
});

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { ARTISTS, ALBUMS, TRACKS, GENRES } from '../../src/data/artists';
import { ArtistCard } from '../../src/components/ui/ArtistCard';
import { CertificationBadge } from '../../src/components/ui/CertificationBadge';
import { formatPrice, formatStreams } from '../../src/utils/formatPrice';
import { usePlayerStore } from '../../src/store/playerStore';

const { width } = Dimensions.get('window');

export default function DiscoveryScreen() {
  const router = useRouter();
  const { play } = usePlayerStore();
  const [activeGenre, setActiveGenre] = useState('Tout');

  const trending = ARTISTS.slice(0, 5);
  const newReleases = ALBUMS.filter((a) => !a.isPreorder).slice(0, 4);
  const preorder = ALBUMS.find((a) => a.isPreorder);
  const preorderArtist = preorder ? ARTISTS.find((a) => a.id === preorder.artistId) : null;

  const filteredArtists = activeGenre === 'Tout'
    ? ARTISTS
    : ARTISTS.filter((a) => a.genre === activeGenre || activeGenre === 'Tout');

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>NKUMU</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn}><Text style={styles.iconBtnText}>🔔</Text></TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}><Text style={styles.iconBtnText}>🔍</Text></TouchableOpacity>
          <View style={styles.avatar}><Text style={styles.avatarText}>K</Text></View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

        {/* Pre-order banner */}
        {preorder && preorderArtist && (
          <TouchableOpacity
            style={[styles.preorderBanner, { backgroundColor: preorderArtist.imageColor }]}
            onPress={() => router.push(`/album/${preorder.id}`)}
            activeOpacity={0.9}
          >
            <View style={styles.preorderContent}>
              <View style={styles.preorderBadge}>
                <Text style={styles.preorderBadgeText}>PRÉ-COMMANDE EXCLUSIVE</Text>
              </View>
              <Text style={styles.preorderTitle}>{preorder.title}</Text>
              <Text style={styles.preorderArtist}>{preorderArtist.name}</Text>
              <Text style={styles.preorderDate}>
                Sortie le {new Date(preorder.releaseDate!).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </Text>
              <View style={styles.preorderPriceRow}>
                <Text style={styles.preorderPrice}>{formatPrice(preorder.priceXaf)}</Text>
                <CertificationBadge level={preorderArtist.certification} size="md" />
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* Genre filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.genreList}>
          {GENRES.map((g) => (
            <TouchableOpacity
              key={g}
              style={[styles.genreChip, activeGenre === g && styles.genreChipActive]}
              onPress={() => setActiveGenre(g)}
            >
              <Text style={[styles.genreText, activeGenre === g && styles.genreTextActive]}>{g}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Trending this week */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>En tendance cette semaine</Text>
            <TouchableOpacity><Text style={styles.seeAll}>Voir tout</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.albumRow}>
            {TRACKS.slice(0, 6).map((track) => {
              const artist = ARTISTS.find((a) => a.id === track.artistId)!;
              const album = ALBUMS.find((a) => a.id === track.albumId)!;
              return (
                <TouchableOpacity
                  key={track.id}
                  style={styles.trendCard}
                  onPress={() => play(track, artist)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.trendCover, { backgroundColor: album?.coverColor ?? '#1a1a1a' }]}>
                    <Text style={styles.trendCoverText}>{track.streams.toLocaleString()}</Text>
                    <View style={styles.playOverlay}>
                      <Text style={styles.playIcon}>▶</Text>
                    </View>
                  </View>
                  <Text style={styles.trendTitle} numberOfLines={1}>{track.title}</Text>
                  <Text style={styles.trendArtist} numberOfLines={1}>{artist.name}</Text>
                  <Text style={styles.trendPrice}>{formatPrice(track.priceXaf)}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Artists with Certifications */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Artistes certifiés CAMUCA</Text>
            <TouchableOpacity><Text style={styles.seeAll}>Voir tout</Text></TouchableOpacity>
          </View>
          <FlatList
            data={filteredArtists.filter((a) => a.certification)}
            keyExtractor={(a) => a.id}
            numColumns={2}
            columnWrapperStyle={styles.artistGrid}
            scrollEnabled={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            renderItem={({ item }) => (
              <ArtistCard
                artist={item}
                onPress={() => router.push(`/artist/${item.id}`)}
              />
            )}
          />
        </View>

        {/* New Releases */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nouvelles sorties</Text>
            <TouchableOpacity><Text style={styles.seeAll}>Voir tout</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.albumRow}>
            {newReleases.map((album) => {
              const artist = ARTISTS.find((a) => a.id === album.artistId)!;
              return (
                <TouchableOpacity
                  key={album.id}
                  style={styles.albumCard}
                  onPress={() => router.push(`/album/${album.id}`)}
                  activeOpacity={0.85}
                >
                  <View style={[styles.albumCover, { backgroundColor: album.coverColor }]}>
                    <Text style={styles.albumCoverText}>{album.title[0]}</Text>
                  </View>
                  <Text style={styles.albumTitle} numberOfLines={2}>{album.title}</Text>
                  <Text style={styles.albumArtist} numberOfLines={1}>{artist?.name}</Text>
                  <Text style={styles.albumPrice}>{formatPrice(album.priceXaf)}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* All artists row */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tous les artistes</Text>
          </View>
          {ARTISTS.map((artist) => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              variant="row"
              onPress={() => router.push(`/artist/${artist.id}`)}
            />
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logo: { fontSize: 22, fontWeight: '900', color: COLORS.gold, letterSpacing: 3 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  iconBtnText: { fontSize: 18 },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.gold, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: COLORS.gold, fontWeight: '700', fontSize: 13 },

  // Pre-order banner
  preorderBanner: { marginHorizontal: 16, marginBottom: 16, borderRadius: 16, overflow: 'hidden' },
  preorderContent: { padding: 20, gap: 6 },
  preorderBadge: { backgroundColor: COLORS.gold, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  preorderBadgeText: { color: '#000', fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  preorderTitle: { fontSize: 20, fontWeight: '900', color: COLORS.textPrimary, marginTop: 4 },
  preorderArtist: { fontSize: 13, color: COLORS.textSecondary },
  preorderDate: { fontSize: 12, color: COLORS.textMuted },
  preorderPriceRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4 },
  preorderPrice: { fontSize: 16, fontWeight: '700', color: COLORS.gold },

  genreList: { paddingHorizontal: 16, paddingBottom: 8, gap: 8 },
  genreChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.border },
  genreChipActive: { backgroundColor: COLORS.goldSubtle, borderColor: COLORS.gold },
  genreText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  genreTextActive: { color: COLORS.gold },

  section: { marginBottom: 28 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: COLORS.textPrimary },
  seeAll: { fontSize: 13, color: COLORS.gold, fontWeight: '600' },

  albumRow: { paddingHorizontal: 16, gap: 12 },

  trendCard: { width: 140 },
  trendCover: { width: 140, height: 100, borderRadius: 10, alignItems: 'flex-end', justifyContent: 'flex-start', padding: 8, position: 'relative', overflow: 'hidden' },
  trendCoverText: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.7)', backgroundColor: COLORS.overlay40, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
  playOverlay: { position: 'absolute', bottom: 8, right: 8, width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.gold, alignItems: 'center', justifyContent: 'center' },
  playIcon: { color: '#000', fontSize: 12 },
  trendTitle: { marginTop: 8, fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
  trendArtist: { fontSize: 11, color: COLORS.gold, fontWeight: '500' },
  trendPrice: { fontSize: 11, color: COLORS.textMuted },

  albumCard: { width: 140 },
  albumCover: { width: 140, height: 140, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  albumCoverText: { fontSize: 40, fontWeight: '900', color: 'rgba(255,255,255,0.3)' },
  albumTitle: { marginTop: 8, fontSize: 13, fontWeight: '700', color: COLORS.textPrimary, lineHeight: 17 },
  albumArtist: { fontSize: 11, color: COLORS.gold, fontWeight: '500' },
  albumPrice: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },

  artistGrid: { gap: 12, paddingBottom: 12 },
});

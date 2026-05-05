import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../src/constants/colors';

const { width } = Dimensions.get('window');
const CARD_W = (width - 48) / 2;

const MOCK_PLAYLISTS = [
  { id: 'p1', name: 'Mes favoris', count: 12, color: '#1a3a2a' },
  { id: 'p2', name: 'Hits Makossa', count: 8, color: '#2a0a2a' },
  { id: 'p3', name: 'Rap Cam 2025', count: 15, color: '#0a1a3a' },
  { id: 'p4', name: 'Soirée Bikutsi', count: 6, color: '#3a1a0a' },
];

const GRADIENTS = ['#1a3a2a', '#2a0a2a', '#0a1a3a', '#3a1a0a', '#1a0a3a', '#3a3a0a'];

export default function PlaylistsScreen() {
  const [playlists, setPlaylists] = useState(MOCK_PLAYLISTS);

  function createPlaylist() {
    const idx = playlists.length;
    setPlaylists((prev) => [
      ...prev,
      { id: `p${Date.now()}`, name: `Ma playlist ${idx + 1}`, count: 0, color: GRADIENTS[idx % GRADIENTS.length] },
    ]);
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Playlists</Text>
        <TouchableOpacity style={styles.createBtn} onPress={createPlaylist}>
          <Text style={styles.createIcon}>+</Text>
          <Text style={styles.createText}>Créer</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={playlists}
        keyExtractor={(p) => p.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.card, { width: CARD_W }]} activeOpacity={0.85}>
            <View style={[styles.cover, { backgroundColor: item.color }]}>
              <Text style={styles.coverIcon}>🎵</Text>
            </View>
            <Text style={styles.playlistName} numberOfLines={2}>{item.name}</Text>
            <Text style={styles.playlistCount}>{item.count} titre{item.count !== 1 ? 's' : ''}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🎵</Text>
            <Text style={styles.emptyText}>Aucune playlist pour l'instant</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={createPlaylist}>
              <Text style={styles.emptyBtnText}>Créer ma première playlist</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20 },
  title: { fontSize: 28, fontWeight: '900', color: COLORS.textPrimary },
  createBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.border, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  createIcon: { color: COLORS.gold, fontSize: 18, fontWeight: '700' },
  createText: { color: COLORS.textPrimary, fontWeight: '600', fontSize: 13 },
  grid: { paddingHorizontal: 16, paddingBottom: 120 },
  row: { gap: 12, marginBottom: 12 },
  card: { backgroundColor: COLORS.bgCard, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
  cover: { width: '100%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center' },
  coverIcon: { fontSize: 36 },
  playlistName: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary, padding: 10, paddingBottom: 2 },
  playlistCount: { fontSize: 11, color: COLORS.textMuted, paddingHorizontal: 10, paddingBottom: 10 },
  empty: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyIcon: { fontSize: 48 },
  emptyText: { color: COLORS.textMuted, fontSize: 15 },
  emptyBtn: { backgroundColor: COLORS.gold, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, marginTop: 8 },
  emptyBtnText: { color: '#000', fontWeight: '800', fontSize: 14 },
});

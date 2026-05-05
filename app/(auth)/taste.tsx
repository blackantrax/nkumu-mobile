import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { ARTISTS } from '../../src/data/artists';
import { useAuthStore } from '../../src/store/authStore';
import { CertificationBadge } from '../../src/components/ui/CertificationBadge';

const { width } = Dimensions.get('window');
const COL = 3;
const ITEM_W = (width - 48 - (COL - 1) * 12) / COL;

export default function TasteScreen() {
  const router = useRouter();
  const { completeTaste } = useAuthStore();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');

  const filtered = ARTISTS.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function proceed() {
    completeTaste();
    router.replace('/(tabs)');
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={proceed} style={styles.skipBtn}>
          <Text style={styles.skipText}>Passer</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Choisissez au moins{'\n'}3 artistes que vous aimez</Text>

      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un artiste"
          placeholderTextColor={COLORS.textMuted}
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(a) => a.id}
        numColumns={COL}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => {
          const sel = selected.has(item.id);
          return (
            <TouchableOpacity
              style={[styles.item, { width: ITEM_W }, sel && styles.itemSelected]}
              onPress={() => toggle(item.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.circle, { backgroundColor: item.imageColor }, sel && styles.circleSelected]}>
                <Text style={styles.circleText}>{item.name[0]}</Text>
                {sel && (
                  <View style={styles.checkOverlay}>
                    <Text style={styles.checkIcon}>✓</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.artistName, sel && styles.artistNameSelected]} numberOfLines={1}>
                {item.name}
              </Text>
              {item.certification && <CertificationBadge level={item.certification} size="sm" />}
            </TouchableOpacity>
          );
        }}
      />

      <View style={styles.footer}>
        <Text style={styles.count}>
          {selected.size} sélectionné{selected.size !== 1 ? 's' : ''} {selected.size < 3 ? `(min 3)` : '✓'}
        </Text>
        <TouchableOpacity
          style={[styles.nextBtn, selected.size < 3 && styles.nextBtnDisabled]}
          onPress={proceed}
          disabled={selected.size < 3}
        >
          <Text style={styles.nextText}>Suivant</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backBtn: { padding: 8 },
  backIcon: { fontSize: 20, color: COLORS.textPrimary },
  skipBtn: { padding: 8 },
  skipText: { color: COLORS.gold, fontWeight: '600' },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
    paddingHorizontal: 20,
    marginBottom: 16,
    lineHeight: 32,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: COLORS.bgInput,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    gap: 8,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, color: COLORS.textPrimary, fontSize: 14 },
  clearIcon: { color: COLORS.textMuted, fontSize: 16 },
  grid: { paddingHorizontal: 20, paddingBottom: 120 },
  row: { gap: 12, marginBottom: 16 },
  item: { alignItems: 'center', gap: 6 },
  itemSelected: {},
  circle: {
    width: ITEM_W,
    height: ITEM_W,
    borderRadius: ITEM_W / 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  circleSelected: {
    borderWidth: 3,
    borderColor: COLORS.gold,
  },
  circleText: { fontSize: 28, fontWeight: '800', color: 'rgba(255,255,255,0.6)' },
  checkOverlay: {
    position: 'absolute',
    inset: 0,
    borderRadius: ITEM_W / 2,
    backgroundColor: 'rgba(252,209,22,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: { fontSize: 28, color: COLORS.gold, fontWeight: '900' },
  artistName: { fontSize: 12, color: COLORS.textSecondary, textAlign: 'center', fontWeight: '500' },
  artistNameSelected: { color: COLORS.gold, fontWeight: '700' },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.overlay90,
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 32,
    gap: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  count: { flex: 1, color: COLORS.textMuted, fontSize: 14 },
  nextBtn: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 24,
  },
  nextBtnDisabled: { opacity: 0.35 },
  nextText: { color: '#000', fontWeight: '800', fontSize: 15 },
});

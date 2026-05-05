import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../src/constants/colors';
import { NEWS } from '../../src/data/artists';

export default function NewsScreen() {
  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Actualités</Text>
        <Text style={styles.subtitle}>Musique camerounaise · CAMAS · CAMUCA</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120, gap: 0 }}>
        {NEWS.map((article) => (
          <TouchableOpacity key={article.id} style={styles.card} activeOpacity={0.85}>
            <View style={[styles.cardImage, { backgroundColor: article.imageColor }]}>
              <Text style={styles.cardImageText}>{article.tag}</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.cardMeta}>
                <Text style={styles.cardSource}>{article.source}</Text>
                <Text style={styles.cardTime}>{article.timeAgo}</Text>
              </View>
              <Text style={styles.cardHeadline} numberOfLines={2}>{article.headline}</Text>
              <Text style={styles.cardBody} numberOfLines={2}>{article.body}</Text>
              <View style={styles.tagRow}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{article.tag}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20 },
  title: { fontSize: 28, fontWeight: '900', color: COLORS.textPrimary },
  subtitle: { fontSize: 12, color: COLORS.textMuted, marginTop: 4 },

  card: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  cardImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardImageText: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: 4 },
  cardContent: { flex: 1, gap: 4 },
  cardMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  cardSource: { fontSize: 10, fontWeight: '700', color: COLORS.gold, letterSpacing: 0.3 },
  cardTime: { fontSize: 10, color: COLORS.textMuted },
  cardHeadline: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, lineHeight: 19 },
  cardBody: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 17 },
  tagRow: { flexDirection: 'row', marginTop: 4 },
  tag: { backgroundColor: COLORS.bgElevated, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  tagText: { fontSize: 10, color: COLORS.textMuted, fontWeight: '600' },
});

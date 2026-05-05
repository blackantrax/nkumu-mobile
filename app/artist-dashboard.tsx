import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Modal, Dimensions, Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../src/constants/colors';
import { ARTISTS, TRACKS, Track } from '../src/data/artists';
import { useAuthStore } from '../src/store/authStore';

const { width } = Dimensions.get('window');

const CAMUCA_LEVELS = [
  { level: 'bronze',   threshold: 10_000,   color: '#CD7F32', emoji: '🥉', label: 'Bronze' },
  { level: 'silver',   threshold: 50_000,   color: '#C0C0C0', emoji: '🥈', label: 'Argent' },
  { level: 'gold',     threshold: 100_000,  color: '#FCD116', emoji: '🥇', label: 'Or' },
  { level: 'platinum', threshold: 500_000,  color: '#E5E4E2', emoji: '💿', label: 'Platine' },
  { level: 'diamond',  threshold: 1_000_000,color: '#B9F2FF', emoji: '💎', label: 'Diamant' },
];

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
}

function fmtXaf(n: number) {
  return `${n.toLocaleString('fr-FR')} XAF`;
}

export default function ArtistDashboardScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const artistId = user?.artistId ?? 'lifka';
  const artist = ARTISTS.find((a) => a.id === artistId) ?? ARTISTS[0];
  const tracks = TRACKS.filter((t) => t.artistId === artistId);

  const totalStreams = artist.streams;
  const monthlyStreams = tracks.reduce((s, t) => s + (t.monthlyStreams ?? 0), 0);
  const weeklyStreams = tracks.reduce((s, t) => s + (t.weeklyStreams ?? 0), 0);
  const revenueXaf = Math.round(totalStreams * 2.5);

  // CAMUCA progress
  const currentLevelIdx = CAMUCA_LEVELS.findIndex((l) => l.level === artist.certification) ?? 0;
  const currentLevel = CAMUCA_LEVELS[currentLevelIdx] ?? CAMUCA_LEVELS[0];
  const nextLevel = CAMUCA_LEVELS[currentLevelIdx + 1];
  const prevThreshold = currentLevelIdx > 0 ? CAMUCA_LEVELS[currentLevelIdx - 1].threshold : 0;
  const progress = nextLevel
    ? Math.min((totalStreams - prevThreshold) / (nextLevel.threshold - prevThreshold), 1)
    : 1;

  const [lyricsTrack, setLyricsTrack] = useState<Track | null>(null);
  const [activeTab, setActiveTab] = useState<'analytics' | 'lyrics' | 'certification'>('analytics');

  // Weekly bar chart — 7 fake days proportional to weeklyStreams
  const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const weekValues = weekDays.map((_, i) => {
    const weights = [0.10, 0.14, 0.12, 0.16, 0.18, 0.20, 0.10];
    return Math.round((weeklyStreams || 1000) * weights[i]);
  });
  const maxDay = Math.max(...weekValues);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mode Artiste</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Artist hero */}
      <LinearGradient colors={[artist.imageColor, COLORS.bg]} style={styles.hero}>
        <View style={[styles.avatarCircle, { backgroundColor: artist.imageColor }]}>
          <Text style={styles.avatarLetter}>{artist.name[0]}</Text>
        </View>
        <View style={styles.heroInfo}>
          <Text style={styles.artistName}>{artist.name}</Text>
          <Text style={styles.artistHandle}>{artist.handle}</Text>
          <View style={styles.badgeRow}>
            <View style={[styles.camucaBadge, { borderColor: currentLevel.color }]}>
              <Text style={styles.camucaBadgeEmoji}>{currentLevel.emoji}</Text>
              <Text style={[styles.camucaBadgeText, { color: currentLevel.color }]}>
                CAMUCA {currentLevel.label.toUpperCase()}
              </Text>
            </View>
            {artist.verified && (
              <View style={styles.verifiedDot}>
                <Text style={{ fontSize: 10 }}>✓</Text>
              </View>
            )}
          </View>
        </View>
      </LinearGradient>

      {/* Tab bar */}
      <View style={styles.tabBar}>
        {([
          { key: 'analytics', label: 'Analytics' },
          { key: 'lyrics', label: 'Paroles' },
          { key: 'certification', label: 'CAMUCA' },
        ] as const).map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tabBtn, activeTab === t.key && styles.tabBtnActive]}
            onPress={() => setActiveTab(t.key)}
          >
            <Text style={[styles.tabText, activeTab === t.key && styles.tabTextActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* ── ANALYTICS TAB ── */}
        {activeTab === 'analytics' && (
          <View style={styles.section}>
            {/* Stats grid */}
            <View style={styles.statsGrid}>
              <StatCard label="Streams totaux" value={fmt(totalStreams)} icon="▶" />
              <StatCard label="Ce mois" value={fmt(monthlyStreams)} icon="📅" />
              <StatCard label="Cette semaine" value={fmt(weeklyStreams)} icon="📈" />
              <StatCard label="Revenus estimés" value={fmtXaf(revenueXaf)} icon="💰" small />
            </View>

            {/* Weekly chart */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Streams — 7 derniers jours</Text>
              <View style={styles.barChart}>
                {weekValues.map((v, i) => (
                  <View key={i} style={styles.barCol}>
                    <Text style={styles.barValue}>{fmt(v)}</Text>
                    <View style={styles.barTrack}>
                      <View style={[styles.barFill, { height: `${Math.round((v / maxDay) * 100)}%` }]} />
                    </View>
                    <Text style={styles.barLabel}>{weekDays[i]}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Per-track table */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Performance par titre</Text>
              {tracks.map((track, i) => {
                const pct = totalStreams > 0 ? (track.streams / totalStreams) * 100 : 0;
                const revenue = Math.round(track.streams * 2.5);
                return (
                  <View key={track.id} style={styles.trackRow}>
                    <View style={styles.trackRowLeft}>
                      <Text style={styles.trackIndex}>{i + 1}</Text>
                      <View>
                        <Text style={styles.trackTitle}>{track.title}</Text>
                        {track.featuring && (
                          <Text style={styles.trackFeat}>ft. {track.featuring.join(', ')}</Text>
                        )}
                      </View>
                    </View>
                    <View style={styles.trackRowRight}>
                      <Text style={styles.trackStreams}>{fmt(track.streams)}</Text>
                      <Text style={styles.trackRevenue}>{fmtXaf(revenue)}</Text>
                      <View style={styles.trackBar}>
                        <View style={[styles.trackBarFill, { width: `${pct}%` }]} />
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Audience breakdown */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Audience</Text>
              {[
                { country: '🇨🇲 Cameroun', pct: 62 },
                { country: '🇫🇷 France', pct: 18 },
                { country: '🇨🇦 Canada', pct: 9 },
                { country: '🇧🇪 Belgique', pct: 6 },
                { country: '🌍 Autres', pct: 5 },
              ].map((row) => (
                <View key={row.country} style={styles.audienceRow}>
                  <Text style={styles.audienceCountry}>{row.country}</Text>
                  <View style={styles.audienceBarTrack}>
                    <View style={[styles.audienceBarFill, { width: `${row.pct}%` }]} />
                  </View>
                  <Text style={styles.audiencePct}>{row.pct}%</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── LYRICS TAB ── */}
        {activeTab === 'lyrics' && (
          <View style={styles.section}>
            <Text style={styles.sectionHint}>Appuyez sur un titre pour voir ou modifier ses paroles</Text>
            {tracks.map((track) => (
              <TouchableOpacity
                key={track.id}
                style={styles.lyricsCard}
                onPress={() => setLyricsTrack(track)}
                activeOpacity={0.75}
              >
                <View style={styles.lyricsCardLeft}>
                  <Text style={styles.lyricsTitle}>{track.title}</Text>
                  {track.featuring && (
                    <Text style={styles.lyricsFeat}>ft. {track.featuring.join(', ')}</Text>
                  )}
                  <Text style={styles.lyricsPreview} numberOfLines={2}>
                    {track.lyrics ? track.lyrics.split('\n')[0] : 'Paroles non encore ajoutées'}
                  </Text>
                </View>
                <View style={styles.lyricsCardRight}>
                  {track.lyrics
                    ? <View style={styles.lyricsChip}><Text style={styles.lyricsChipText}>Paroles ✓</Text></View>
                    : <View style={styles.lyricsChipEmpty}><Text style={styles.lyricsChipEmptyText}>+ Ajouter</Text></View>
                  }
                  <Text style={styles.lyricsArrow}>›</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ── CAMUCA TAB ── */}
        {activeTab === 'certification' && (
          <View style={styles.section}>
            {/* Current badge hero */}
            <LinearGradient
              colors={[currentLevel.color + '22', COLORS.bgCard]}
              style={styles.camucaHero}
            >
              <Text style={styles.camucaHeroEmoji}>{currentLevel.emoji}</Text>
              <Text style={[styles.camucaHeroLabel, { color: currentLevel.color }]}>
                CAMUCA {currentLevel.label.toUpperCase()}
              </Text>
              <Text style={styles.camucaHeroStreams}>{fmt(totalStreams)} streams certifiés</Text>
            </LinearGradient>

            {/* Progress to next */}
            {nextLevel && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Progression vers {nextLevel.emoji} {nextLevel.label}</Text>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%`, backgroundColor: currentLevel.color }]} />
                </View>
                <View style={styles.progressLabels}>
                  <Text style={styles.progressLabelLeft}>{fmt(totalStreams)}</Text>
                  <Text style={styles.progressLabelRight}>{fmt(nextLevel.threshold)}</Text>
                </View>
                <Text style={styles.progressHint}>
                  Encore {fmt(nextLevel.threshold - totalStreams)} streams pour atteindre {nextLevel.label}
                </Text>
              </View>
            )}

            {/* All levels ladder */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Niveaux CAMUCA</Text>
              {CAMUCA_LEVELS.map((lvl, i) => {
                const isReached = i <= currentLevelIdx;
                const isCurrent = i === currentLevelIdx;
                return (
                  <View key={lvl.level} style={[styles.levelRow, isCurrent && styles.levelRowActive]}>
                    <Text style={styles.levelEmoji}>{lvl.emoji}</Text>
                    <View style={styles.levelInfo}>
                      <Text style={[styles.levelName, { color: isReached ? lvl.color : COLORS.textMuted }]}>
                        {lvl.label.toUpperCase()}
                      </Text>
                      <Text style={styles.levelThreshold}>{fmt(lvl.threshold)} streams</Text>
                    </View>
                    <View style={[styles.levelStatus, isReached && { backgroundColor: lvl.color + '33', borderColor: lvl.color }]}>
                      <Text style={[styles.levelStatusText, { color: isReached ? lvl.color : COLORS.textMuted }]}>
                        {isCurrent ? 'Actuel' : isReached ? 'Atteint' : 'À venir'}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Info card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>À propos de CAMUCA</Text>
              <Text style={styles.infoText}>
                La Certification Artistique Musicale Unique Camerounaise (CAMUCA) est le système officiel de certification des streamings de NKUMU. Elle récompense les artistes selon leur nombre de streams certifiés, avec des avantages exclusifs à chaque niveau.
              </Text>
              <View style={styles.infoBullets}>
                {['Visibilité accrue sur la plateforme', 'Badge officiel sur votre profil', 'Accès aux playlists éditorialisées', 'Meilleures opportunités de pré-commandes'].map((b) => (
                  <View key={b} style={styles.infoBullet}>
                    <Text style={styles.infoBulletDot}>›</Text>
                    <Text style={styles.infoBulletText}>{b}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Lyrics modal */}
      <Modal
        visible={!!lyricsTrack}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setLyricsTrack(null)}
      >
        <View style={styles.modalRoot}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{lyricsTrack?.title}</Text>
            <Pressable onPress={() => setLyricsTrack(null)} style={styles.modalClose}>
              <Text style={styles.modalCloseText}>Fermer</Text>
            </Pressable>
          </View>
          {lyricsTrack?.featuring && (
            <Text style={styles.modalFeat}>ft. {lyricsTrack.featuring.join(', ')}</Text>
          )}
          <ScrollView contentContainerStyle={styles.modalBody}>
            {lyricsTrack?.lyrics
              ? <Text style={styles.lyricsText}>{lyricsTrack.lyrics}</Text>
              : <Text style={styles.lyricsEmpty}>Aucune parole ajoutée pour ce titre.{'\n\n'}Les paroles vous permettent d'améliorer votre visibilité sur NKUMU et d'engager votre audience.</Text>
            }
          </ScrollView>
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.editBtn}>
              <Text style={styles.editBtnText}>✎  Modifier les paroles</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function StatCard({ label, value, icon, small }: { label: string; value: string; icon: string; small?: boolean }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={[styles.statValue, small && { fontSize: 14 }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  backIcon: { fontSize: 22, color: COLORS.textPrimary },
  headerTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary },

  hero: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 20, gap: 16 },
  avatarCircle: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.gold },
  avatarLetter: { fontSize: 28, fontWeight: '900', color: COLORS.gold },
  heroInfo: { flex: 1, gap: 4 },
  artistName: { fontSize: 22, fontWeight: '900', color: COLORS.textPrimary },
  artistHandle: { fontSize: 13, color: COLORS.textSecondary },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  camucaBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3 },
  camucaBadgeEmoji: { fontSize: 12 },
  camucaBadgeText: { fontSize: 10, fontWeight: '700' },
  verifiedDot: { width: 18, height: 18, borderRadius: 9, backgroundColor: COLORS.gold, alignItems: 'center', justifyContent: 'center' },

  tabBar: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: COLORS.border, marginHorizontal: 20, marginBottom: 4 },
  tabBtn: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabBtnActive: { borderBottomWidth: 2, borderBottomColor: COLORS.gold },
  tabText: { fontSize: 13, fontWeight: '600', color: COLORS.textMuted },
  tabTextActive: { color: COLORS.gold },

  section: { paddingHorizontal: 16, paddingTop: 16, gap: 16 },
  sectionHint: { fontSize: 13, color: COLORS.textMuted, textAlign: 'center', marginBottom: 4 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: { flex: 1, minWidth: (width - 56) / 2, backgroundColor: COLORS.bgCard, borderRadius: 16, padding: 16, gap: 4, borderWidth: 1, borderColor: COLORS.border },
  statIcon: { fontSize: 20 },
  statValue: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary, marginTop: 4 },
  statLabel: { fontSize: 11, color: COLORS.textMuted },

  card: { backgroundColor: COLORS.bgCard, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.border, gap: 12 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8 },

  barChart: { flexDirection: 'row', alignItems: 'flex-end', height: 100, gap: 6 },
  barCol: { flex: 1, alignItems: 'center', gap: 4 },
  barValue: { fontSize: 8, color: COLORS.textMuted },
  barTrack: { flex: 1, width: '100%', backgroundColor: COLORS.bgElevated, borderRadius: 4, overflow: 'hidden', justifyContent: 'flex-end' },
  barFill: { width: '100%', backgroundColor: COLORS.gold, borderRadius: 4 },
  barLabel: { fontSize: 10, color: COLORS.textMuted },

  trackRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  trackRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  trackIndex: { fontSize: 13, color: COLORS.textMuted, width: 18, textAlign: 'center' },
  trackTitle: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  trackFeat: { fontSize: 11, color: COLORS.textMuted },
  trackRowRight: { alignItems: 'flex-end', gap: 2 },
  trackStreams: { fontSize: 13, fontWeight: '700', color: COLORS.gold },
  trackRevenue: { fontSize: 10, color: COLORS.textMuted },
  trackBar: { width: 60, height: 3, backgroundColor: COLORS.bgElevated, borderRadius: 2, overflow: 'hidden', marginTop: 2 },
  trackBarFill: { height: '100%', backgroundColor: COLORS.gold, borderRadius: 2 },

  audienceRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  audienceCountry: { fontSize: 13, color: COLORS.textSecondary, width: 110 },
  audienceBarTrack: { flex: 1, height: 6, backgroundColor: COLORS.bgElevated, borderRadius: 3, overflow: 'hidden' },
  audienceBarFill: { height: '100%', backgroundColor: COLORS.green, borderRadius: 3 },
  audiencePct: { fontSize: 12, color: COLORS.textMuted, width: 32, textAlign: 'right' },

  lyricsCard: { backgroundColor: COLORS.bgCard, borderRadius: 14, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  lyricsCardLeft: { flex: 1, gap: 4 },
  lyricsTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  lyricsFeat: { fontSize: 11, color: COLORS.textMuted },
  lyricsPreview: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 17 },
  lyricsCardRight: { alignItems: 'center', gap: 6, marginLeft: 12 },
  lyricsChip: { backgroundColor: COLORS.goldSubtle, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  lyricsChipText: { fontSize: 10, fontWeight: '700', color: COLORS.gold },
  lyricsChipEmpty: { backgroundColor: COLORS.bgElevated, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: COLORS.border },
  lyricsChipEmptyText: { fontSize: 10, fontWeight: '600', color: COLORS.textMuted },
  lyricsArrow: { fontSize: 20, color: COLORS.textMuted },

  camucaHero: { borderRadius: 20, padding: 28, alignItems: 'center', gap: 8 },
  camucaHeroEmoji: { fontSize: 56 },
  camucaHeroLabel: { fontSize: 18, fontWeight: '900', letterSpacing: 1 },
  camucaHeroStreams: { fontSize: 13, color: COLORS.textSecondary },

  progressTrack: { height: 10, backgroundColor: COLORS.bgElevated, borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 5 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  progressLabelLeft: { fontSize: 12, color: COLORS.textSecondary },
  progressLabelRight: { fontSize: 12, color: COLORS.textMuted },
  progressHint: { fontSize: 12, color: COLORS.textMuted, textAlign: 'center' },

  levelRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderRadius: 10 },
  levelRowActive: { backgroundColor: COLORS.bgElevated, paddingHorizontal: 8, marginHorizontal: -8 },
  levelEmoji: { fontSize: 24, width: 32, textAlign: 'center' },
  levelInfo: { flex: 1 },
  levelName: { fontSize: 14, fontWeight: '700' },
  levelThreshold: { fontSize: 12, color: COLORS.textMuted },
  levelStatus: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  levelStatusText: { fontSize: 11, fontWeight: '600' },

  infoText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },
  infoBullets: { gap: 6 },
  infoBullet: { flexDirection: 'row', gap: 8 },
  infoBulletDot: { color: COLORS.gold, fontSize: 14, fontWeight: '700' },
  infoBulletText: { fontSize: 13, color: COLORS.textSecondary, flex: 1 },

  // Lyrics modal
  modalRoot: { flex: 1, backgroundColor: COLORS.bg },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  modalTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary },
  modalClose: { padding: 4 },
  modalCloseText: { fontSize: 15, color: COLORS.gold, fontWeight: '600' },
  modalFeat: { fontSize: 12, color: COLORS.textMuted, paddingHorizontal: 20, paddingTop: 8 },
  modalBody: { padding: 24 },
  lyricsText: { fontSize: 16, color: COLORS.textPrimary, lineHeight: 28, fontStyle: 'italic' },
  lyricsEmpty: { fontSize: 14, color: COLORS.textMuted, lineHeight: 22, textAlign: 'center', paddingTop: 40 },
  modalFooter: { padding: 20, borderTopWidth: 1, borderTopColor: COLORS.border },
  editBtn: { backgroundColor: COLORS.goldSubtle, borderWidth: 1, borderColor: COLORS.gold, borderRadius: 12, padding: 14, alignItems: 'center' },
  editBtnText: { fontSize: 15, fontWeight: '700', color: COLORS.gold },
});

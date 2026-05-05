import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Dimensions, TouchableOpacity, FlatList, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../src/constants/colors';
import { useAuthStore } from '../../src/store/authStore';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '0',
    title: 'Découvrez de nouveaux\nartistes et talents',
    subtitle: 'La royauté de la musique camerounaise, certifiée par CAMUCA',
    accent: '#FCD116',
    bgColor: '#0D0D0D',
    icon: '👑',
  },
  {
    id: '1',
    title: 'Écoutez vos chansons\nfavorites, hors ligne',
    subtitle: 'Achetez vos albums et accédez à votre musique partout dans le monde',
    accent: '#00A854',
    bgColor: '#050F08',
    icon: '📀',
  },
  {
    id: '2',
    title: 'Albums exclusifs,\ncertifications CAMUCA',
    subtitle: 'Bronze, Argent, Or, Platine, Diamant — la prestige visible sur chaque profil',
    accent: '#FCD116',
    bgColor: '#0D0A00',
    icon: '💎',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { completeOnboarding } = useAuthStore();
  const [activeIdx, setActiveIdx] = useState(0);
  const listRef = useRef<FlatList>(null);

  function goNext() {
    if (activeIdx < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: activeIdx + 1 });
    } else {
      completeOnboarding();
      router.replace('/(auth)/login');
    }
  }

  function skip() {
    completeOnboarding();
    router.replace('/(auth)/login');
  }

  return (
    <View style={styles.root}>
      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(s) => s.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          setActiveIdx(Math.round(e.nativeEvent.contentOffset.x / width));
        }}
        renderItem={({ item }) => (
          <LinearGradient
            colors={[item.bgColor, '#0A0A0A']}
            style={styles.slide}
          >
            {/* Crown logo */}
            <View style={styles.logoRow}>
              <Text style={styles.logoText}>NKUMU</Text>
            </View>

            {/* Big icon */}
            <View style={styles.iconWrap}>
              <Text style={styles.icon}>{item.icon}</Text>
              <View style={[styles.iconGlow, { backgroundColor: item.accent + '22' }]} />
            </View>

            {/* Text */}
            <View style={styles.textWrap}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>
          </LinearGradient>
        )}
      />

      {/* Dots + CTA */}
      <SafeAreaView edges={['bottom']} style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === activeIdx && styles.dotActive]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.btn} onPress={goNext} activeOpacity={0.85}>
          <Text style={styles.btnText}>
            {activeIdx < SLIDES.length - 1 ? 'Suivant' : 'Commencer'}
          </Text>
        </TouchableOpacity>

        {activeIdx < SLIDES.length - 1 && (
          <TouchableOpacity onPress={skip} style={styles.skipBtn}>
            <Text style={styles.skipText}>Passer</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  slide: {
    width,
    height,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 160,
  },
  logoRow: {
    position: 'absolute',
    top: 64,
    alignItems: 'center',
  },
  logoText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.gold,
    letterSpacing: 4,
  },
  iconWrap: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  icon: {
    fontSize: 80,
    zIndex: 2,
  },
  iconGlow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  textWrap: {
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 16,
    paddingBottom: 32,
    paddingTop: 20,
    backgroundColor: COLORS.overlay90,
    paddingHorizontal: 24,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
  },
  dotActive: {
    width: 20,
    backgroundColor: COLORS.gold,
  },
  btn: {
    width: '100%',
    height: 54,
    backgroundColor: COLORS.gold,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#000',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  skipBtn: {
    padding: 8,
  },
  skipText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
});

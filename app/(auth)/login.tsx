import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { useAuthStore } from '../../src/store/authStore';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    login({ name: name || email.split('@')[0], email });
    router.replace('/(auth)/taste');
    setLoading(false);
  }

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.kav}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>NKUMU</Text>
          <Text style={styles.tagline}>La royauté musicale camerounaise</Text>
        </View>

        {/* Tab switcher */}
        <View style={styles.tabs}>
          {(['login', 'signup'] as const).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tabBtn, tab === t && styles.tabBtnActive]}
              onPress={() => setTab(t)}
            >
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                {t === 'login' ? 'Se connecter' : 'S\'inscrire'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Form */}
        <View style={styles.form}>
          {tab === 'signup' && (
            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>NOM COMPLET</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Ton nom"
                placeholderTextColor={COLORS.textMuted}
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={styles.inputWrap}>
            <Text style={styles.inputLabel}>EMAIL OU TÉLÉPHONE</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="email@example.com"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputWrap}>
            <Text style={styles.inputLabel}>MOT DE PASSE</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, loading && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Text style={styles.submitText}>
              {loading ? 'Chargement...' : tab === 'login' ? 'Se connecter' : 'Créer mon compte'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dividerBtn}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>ou continuer avec</Text>
            <View style={styles.divider} />
          </TouchableOpacity>

          <View style={styles.socialRow}>
            {['📱 Orange Money', '📲 MTN MoMo'].map((s) => (
              <TouchableOpacity key={s} style={styles.socialBtn} onPress={handleSubmit}>
                <Text style={styles.socialText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  kav: { flex: 1, paddingHorizontal: 24 },
  header: { alignItems: 'center', paddingVertical: 40 },
  logo: { fontSize: 32, fontWeight: '900', color: COLORS.gold, letterSpacing: 6 },
  tagline: { fontSize: 13, color: COLORS.textMuted, marginTop: 6 },
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    padding: 4,
    marginBottom: 28,
  },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  tabBtnActive: { backgroundColor: COLORS.bgElevated },
  tabText: { color: COLORS.textMuted, fontWeight: '600', fontSize: 14 },
  tabTextActive: { color: COLORS.textPrimary },
  form: { gap: 16 },
  inputWrap: { gap: 6 },
  inputLabel: { fontSize: 10, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 1.2 },
  input: {
    backgroundColor: COLORS.bgInput,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 16,
    color: COLORS.textPrimary,
    fontSize: 15,
  },
  submitBtn: {
    height: 54,
    backgroundColor: COLORS.gold,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitText: { color: '#000', fontWeight: '800', fontSize: 16 },
  dividerBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 4 },
  divider: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { color: COLORS.textMuted, fontSize: 12 },
  socialRow: { flexDirection: 'row', gap: 12 },
  socialBtn: {
    flex: 1,
    height: 48,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialText: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '600' },
});

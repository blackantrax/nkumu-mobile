import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../../src/constants/colors';
import { MiniPlayer } from '../../src/components/player/MiniPlayer';
import { usePlayerStore } from '../../src/store/playerStore';

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <View style={{ opacity: focused ? 1 : 0.5 }}>
      <View style={focused ? styles.iconActive : undefined}>
        {/* Using text emoji as placeholder icons */}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  const currentTrack = usePlayerStore((s) => s.currentTrack);

  return (
    <View style={styles.root}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: COLORS.gold,
          tabBarInactiveTintColor: COLORS.textMuted,
          tabBarLabelStyle: styles.tabLabel,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{ title: 'Découverte', tabBarIcon: ({ color }) => <TabIcon emoji="🧭" focused={color === COLORS.gold} /> }}
        />
        <Tabs.Screen
          name="playlists"
          options={{ title: 'Playlists', tabBarIcon: ({ color }) => <TabIcon emoji="🎵" focused={color === COLORS.gold} /> }}
        />
        <Tabs.Screen
          name="news"
          options={{ title: 'Actualités', tabBarIcon: ({ color }) => <TabIcon emoji="📰" focused={color === COLORS.gold} /> }}
        />
        <Tabs.Screen
          name="my-music"
          options={{ title: 'Ma Musique', tabBarIcon: ({ color }) => <TabIcon emoji="❤️" focused={color === COLORS.gold} /> }}
        />
      </Tabs>

      {currentTrack && <MiniPlayer />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  tabBar: {
    backgroundColor: COLORS.bgElevated,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    height: 72,
    paddingBottom: 12,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  iconActive: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.gold,
    alignSelf: 'center',
  },
});

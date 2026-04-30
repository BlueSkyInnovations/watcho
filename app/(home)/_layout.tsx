import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { useColors } from '@/hooks/useColors';

type IoniconsName = keyof typeof Ionicons.glyphMap;

function TabIcon({ name, focused, color }: { name: IoniconsName; focused: boolean; color: string }) {
  return (
    <Ionicons
      name={focused ? name : (`${name}-outline` as IoniconsName)}
      size={24}
      color={color}
    />
  );
}

export default function TabLayout() {
  const colors = useColors();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        lazy: false,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'My Lists',
          tabBarIcon: ({ focused, color }) => <TabIcon name="bookmark" focused={focused} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ focused, color }) => <TabIcon name="search" focused={focused} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused, color }) => <TabIcon name="stats-chart" focused={focused} color={color} />,
          headerRight: () => (
            <Pressable onPress={() => router.push('/settings')} hitSlop={10} style={{ marginRight: 4 }}>
              <Ionicons name="settings-outline" size={22} color={colors.textDim} />
            </Pressable>
          ),
        }}
      />
    </Tabs>
  );
}

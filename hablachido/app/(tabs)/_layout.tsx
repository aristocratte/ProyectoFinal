import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { colors, fonts } from '../../lib/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.red,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontFamily: fonts.negrita },
        tabBarStyle: { borderTopWidth: 0 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Palabras', tabBarIcon: ({ focused }) => <Ionicons name="book" size={22} color={focused ? colors.red : colors.muted} /> }}
      />
      <Tabs.Screen
        name="favoritos"
        options={{ title: 'Favoritos', tabBarIcon: ({ focused }) => <Ionicons name="heart" size={22} color={focused ? colors.red : colors.muted} /> }}
      />
      <Tabs.Screen
        name="quiz"
        options={{ title: 'Quiz', tabBarIcon: ({ focused }) => <Ionicons name="flash" size={22} color={focused ? colors.red : colors.muted} /> }}
      />
    </Tabs>
  );
}

import { Tabs } from 'expo-router';
import { Home, Calendar, User } from 'lucide-react-native';
import { COLORS } from '../../../constants/theme';
import { useLanguage } from '../../../stores/LanguageContext';
import { useBarbearia } from '../../../stores/BarbeariaContext';

export default function TabLayout() {
  const { t } = useLanguage();
  const { barbearia } = useBarbearia();
  const colors = barbearia?.colors || COLORS;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="agendar"
        options={{
          title: t('tab.book'),
          tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tab.profile'),
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

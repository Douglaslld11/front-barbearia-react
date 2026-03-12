import { Stack } from 'expo-router';
import { COLORS } from '../../constants/theme';
import { useLanguage } from '../../stores/LanguageContext';

export default function AdminLayout() {
  const { t } = useLanguage();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.surface,
        },
        headerTintColor: COLORS.primary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: {
          backgroundColor: COLORS.background,
        },
      }}
    >
      <Stack.Screen 
        name="login" 
        options={{ 
          title: t('admin.login'),
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="dashboard" 
        options={{ 
          title: 'Dashboard',
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="agenda" 
        options={{ 
          title: t('admin.agenda.title'),
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="finance" 
        options={{ 
          title: 'Financeiro',
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="config" 
        options={{ 
          title: t('profile.settings'),
          headerShown: false,
        }} 
      />
    </Stack>
  );
}

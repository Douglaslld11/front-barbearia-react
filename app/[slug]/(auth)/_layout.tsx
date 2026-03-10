import { Stack } from 'expo-router';
import { COLORS } from '../../../constants/theme';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="language-selection" options={{ headerShown: false }} />
    </Stack>
  );
}

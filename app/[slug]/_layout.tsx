import { Stack } from 'expo-router';
import { ActivityIndicator, View, Text } from 'react-native';
import { useBarbearia } from '../../stores/BarbeariaContext';
import { COLORS } from '../../constants/theme';

export default function TenantLayout() {
  const { barbearia, isLoading, error } = useBarbearia();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color="#D4AF37" />
      </View>
    );
  }

  if (error || !barbearia) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <Text style={{ color: 'white', fontSize: 18 }}>{error || 'Barbearia não encontrada'}</Text>
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: barbearia.colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}
